import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handlePasswordRecovery, handleAuthSession, handleAuthError, persistGoogleAuth } from '@/utils/authCallbackUtils';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GOOGLE_REGISTER_TOAST_SHOWN_KEY = "google.registered_toast_shown";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const fullUrl = window.location.href;
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(window.location.search);

        // Always redirect to dashboard after successful auth
        const redirectTo = '/dashboard';

        console.log('Processing auth callback on path:', currentPath);
        console.log('Full callback URL:', fullUrl);
        console.log('Redirect destination:', redirectTo);

        // Handle callback for Google OAuth or any auth provider
        if (currentPath.includes('/callback')) {
          const code = searchParams.get('code');
          const hashFragment = window.location.hash.substring(1);
          const hashParams = new URLSearchParams(hashFragment);
          const errorParam = searchParams.get('error') || hashParams.get('error');
          const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

          setDebugInfo({
            code: !!code,
            errorParam,
            errorDescription,
            fullSearch: window.location.search,
            fullHash: window.location.hash,
            redirectTo
          });

          // Error came from OAuth
          if (errorParam) {
            handleAuthError(
              errorParam,
              errorDescription,
              setError,
              setErrorDetails,
              setIsProcessing,
              navigate
            );
            return;
          }

          // Handle code exchange
          if (code) {
            try {
              // Clear tokens for clean state
              localStorage.removeItem('supabase.auth.token');
              sessionStorage.removeItem('supabase.auth.token');
              
              console.log('Exchanging code for session...');
              const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

              if (exchangeError) {
                console.error('Error exchanging code for session:', exchangeError);
                setError('Authentication Error');
                setErrorDetails(exchangeError.message || 'Failed to complete authentication.');
                setIsProcessing(false);
                return;
              }

              // Session check
              if (data?.session) {
                const user = data.session.user;

                // Store session tokens
                const sessionData = {
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token,
                  expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in
                };
                localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
                sessionStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));

                // Set session in Supabase client
                await supabase.auth.setSession({
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token
                });

                // Persist Google user details if applicable
                let isNewGoogleUser = false;
                if (user?.app_metadata?.provider === 'google') {
                  // Check if this user just got created by querying google_user_details
                  try {
                    const { data: googleInfo, error: gErr } = await supabase
                      .from('google_user_details')
                      .select('created_at')
                      .eq('id', user.id)
                      .maybeSingle();

                    if (googleInfo && googleInfo.created_at) {
                      // If created_at timestamp is within the last 2 minutes, consider as new registration
                      const now = new Date();
                      const createdAt = new Date(googleInfo.created_at);
                      const diffMs = now.getTime() - createdAt.getTime();
                      if (diffMs < 120000) {
                        isNewGoogleUser = true;
                      }
                    }
                  } catch (err) {
                    // Fallback: skip new user toast
                  }

                  await persistGoogleAuth(data.session);

                  // Fetch latest user details just in case
                  try {
                    await supabase.auth.getUser();
                  } catch {}
                }

                // Show toast only if this is a new Google registration and not shown before
                if (isNewGoogleUser && !localStorage.getItem(GOOGLE_REGISTER_TOAST_SHOWN_KEY)) {
                  toast.success('Your account was successfully registered.');
                  localStorage.setItem(GOOGLE_REGISTER_TOAST_SHOWN_KEY, 'true');
                } else {
                  toast.success('Sign-in successful!');
                }

                // Always redirect after login/registration
                window.location.href = '/dashboard';
                return;
              } else {
                console.error('No session data returned from code exchange');
                setError('Authentication Error');
                setErrorDetails('Failed to retrieve session.');
                setIsProcessing(false);
                return;
              }
            } catch (exchangeErr) {
              console.error('Exception during code exchange:', exchangeErr);
              setError('Authentication Error');
              setErrorDetails('Error during authentication. Please try again.');
              setIsProcessing(false);
              return;
            }
          }
        }

        // Password recovery fallback
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        if (token && type === 'recovery') {
          handlePasswordRecovery(token, type, navigate);
          return;
        }

        // Check for an already existing session, redirect if found
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionData?.session) {
          window.location.href = '/dashboard';
          return;
        }

        // Legacy fragment tokens
        const hashFragmentLegacy = window.location.hash.substring(1);
        const hashParamsLegacy = new URLSearchParams(hashFragmentLegacy);
        const accessToken = hashParamsLegacy.get('access_token');
        const refreshToken = hashParamsLegacy.get('refresh_token');
        if (accessToken && refreshToken) {
          await handleAuthSession(
            accessToken,
            refreshToken,
            navigate,
            setError,
            setErrorDetails,
            setIsProcessing,
            '/dashboard'
          );
          return;
        }

        // No recognisable auth params, return to auth
        console.log('No recognizable auth parameters found, redirecting to auth page');
        setTimeout(() => {
          navigate('/auth');
        }, 500);
      } catch (err) {
        console.error('Unhandled exception in auth callback:', err);
        setError('Authentication Failed');
        setErrorDetails('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [navigate, retryCount, location.pathname, toast]);

  const handleRetry = () => {
    setError(null);
    setErrorDetails(null);
    setIsProcessing(true);
    setRetryCount(prev => prev + 1);
    toast({ title: "Retrying authentication", description: "Please wait..." });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
      {error ? (
        <ErrorState
          error={error}
          errorDetails={errorDetails}
          onRetry={handleRetry}
          debugInfo={debugInfo}
        />
      ) : (
        <LoadingState message="Processing your authentication..." />
      )}
    </div>
  );
};

export default AuthCallback;
