
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handlePasswordRecovery, handleAuthSession, handleAuthError, persistGoogleAuth } from '@/utils/authCallbackUtils';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
        const redirectTo = searchParams.get('redirect_to') || '/dashboard';

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
              // Clear any existing tokens to ensure a clean state
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

              if (data?.session) {
                console.log('Session obtained successfully:', data.session.user.id);
                const user = data.session.user;

                // Store the session securely in both localStorage and sessionStorage
                const sessionData = {
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token,
                  expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in
                };
                
                localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
                sessionStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
                
                // Set the session in Supabase client
                await supabase.auth.setSession({
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token
                });
                
                // Persist Google user details if applicable
                if (user?.app_metadata?.provider === 'google') {
                  console.log('Persisting Google auth session...');
                  await persistGoogleAuth(data.session);
                  
                  // Also force fetch user details to ensure we have Google profile data
                  try {
                    const { data: userData } = await supabase.auth.getUser();
                    console.log("User data retrieved:", userData?.user?.id);
                  } catch (e) {
                    console.error("Error getting user after session setup:", e);
                  }
                }
                
                toast.success('Sign-in successful!');
                console.log('Authentication successful, redirecting to dashboard');

                // Force a hard redirect to ensure complete page reload and context reinitialization
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
          console.log('Existing session found, redirecting to dashboard');
          window.location.href = '/dashboard';
          return;
        }

        // Legacy fragment tokens
        const hashFragment = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashFragment);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
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
