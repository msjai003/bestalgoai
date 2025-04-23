import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handlePasswordRecovery, handleAuthSession, handleAuthError, persistGoogleAuth } from '@/utils/authCallbackUtils';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const fullUrl = window.location.href;
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirect_to') || '/dashboard'; // Default to dashboard

        console.log('Processing auth callback on path:', currentPath);
        console.log('Full callback URL:', fullUrl);
        console.log('Redirect destination:', redirectTo);

        // Handle callback for Google OAuth or any auth provider
        if (currentPath.includes('/callback')) {
          console.log('Auth callback detected, processing...');
          
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

          console.log('Auth callback params:', {
            code: !!code,
            error: !!errorParam,
            redirectTo,
            fullSearch: window.location.search,
            fullHash: window.location.hash
          });

          if (errorParam) {
            console.error('Auth callback received error:', errorParam, errorDescription);
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

          if (code) {
            console.log('Found auth code in callback, exchanging for session');

            try {
              // Clear any existing tokens to ensure a clean state
              localStorage.removeItem('supabase.auth.token');
              sessionStorage.removeItem('supabase.auth.token');
              
              const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

              if (exchangeError) {
                console.error('Error exchanging code for session:', exchangeError);
                setError('Authentication Error');
                setErrorDetails(exchangeError.message || 'Failed to complete authentication.');
                setIsProcessing(false);
                return;
              }

              if (data?.session) {
                const user = data.session.user;
                console.log('Successfully exchanged code for session', user?.id);

                const isGoogleAuth = user?.app_metadata?.provider === 'google';

                console.log('User metadata:', user?.user_metadata);
                console.log('App metadata:', user?.app_metadata);
                console.log('Is Google Auth:', isGoogleAuth);

                // Store the session in localStorage with redundancy to ensure persistence
                const sessionData = {
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token,
                  expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in
                };
                
                localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
                sessionStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
                
                // Set the session in Supabase client
                const { error: setSessionError } = await supabase.auth.setSession({
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token
                });
                
                if (setSessionError) {
                  console.error('Error setting session:', setSessionError);
                  setError('Authentication Error');
                  setErrorDetails('Failed to set session: ' + setSessionError.message);
                  setIsProcessing(false);
                  return;
                }
                
                // Persist Google user details if applicable
                if (isGoogleAuth) {
                  const sessionPersisted = await persistGoogleAuth(data.session);
                  if (!sessionPersisted) {
                    console.warn('Session may not have been properly persisted');
                  }
                }

                toast.success('Sign-in successful!');
                
                // Force verification of session before redirect
                const { data: verifyData, error: verifyError } = await supabase.auth.getUser();
                if (verifyError) {
                  console.error('Error verifying user after auth:', verifyError);
                }
                
                console.log('Verified user ID before redirect:', verifyData?.user?.id);
                
                if (verifyData?.user) {
                  console.log('Verified user exists, redirecting to', redirectTo);
                  // Add a small delay to ensure all state updates are processed
                  setTimeout(() => {
                    // Use a hard redirect to ensure clean navigation with proper session
                    window.location.href = redirectTo;
                  }, 500);
                  return;
                } else {
                  console.error('User verification failed after auth');
                  setError('Authentication Error');
                  setErrorDetails('User verification failed. Please try again.');
                  setIsProcessing(false);
                }
                return;
              } else {
                console.error('No session returned after code exchange');
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

        // Handle password recovery flow
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        console.log('Auth callback processing, search params:', { token: !!token, type });

        if (token && type === 'recovery') {
          handlePasswordRecovery(token, type, navigate);
          return;
        }

        // Check if user already has a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error checking session:', sessionError);
        }

        if (sessionData?.session) {
          console.log('User already has session, redirecting to', redirectTo);
          // Hard redirect to dashboard
          window.location.href = redirectTo;
          return;
        }

        // Handle access token in hash fragment (for legacy auth flows)
        const hashFragment = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashFragment);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log('Auth callback processing hash params:', {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          fullHash: window.location.hash
        });

        if (accessToken && refreshToken) {
          await handleAuthSession(
            accessToken,
            refreshToken,
            navigate,
            setError,
            setErrorDetails,
            setIsProcessing,
            redirectTo
          );
          return;
        }

        // If we reach here, no valid auth parameters were found
        console.log('No auth tokens or code found in callback, redirecting to auth page');
        setTimeout(() => {
          navigate('/auth');
        }, 500);
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('Authentication Failed');
        setErrorDetails('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [navigate, retryCount, location.pathname]);

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
