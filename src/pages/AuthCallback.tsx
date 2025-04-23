
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handlePasswordRecovery, handleAuthSession, handleAuthError } from '@/utils/authCallbackUtils';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const fullUrl = window.location.href;
        const currentPath = location.pathname;

        console.log('Processing auth callback on path:', currentPath);
        console.log('Full callback URL:', fullUrl);

        // Handle any path that includes 'callback' for Google OAuth
        if (currentPath.includes('/callback')) {
          const searchParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(window.location.hash.substring(1));

          const code = searchParams.get('code');
          const errorParam = searchParams.get('error') || hashParams.get('error');
          const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
          const state = searchParams.get('state');

          console.log('Auth callback params:', {
            code: !!code,
            error: !!errorParam,
            state: !!state,
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
              // Exchange code for session explicitly
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
                console.log('Successfully exchanged code for session', user);

                const isGoogleAuth = user?.app_metadata?.provider === 'google';

                console.log('User metadata:', user?.user_metadata);
                console.log('App metadata:', user?.app_metadata);
                console.log('Is Google Auth:', isGoogleAuth);

                // Here explicitly set session, though exchangeCodeForSession should do it
                await supabase.auth.setSession({
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token
                });

                // Use a delay to ensure session is properly established
                setTimeout(() => {
                  if (isGoogleAuth) {
                    // Check if user missing full_name => redirect registration
                    const needsRegistration = !user?.user_metadata?.full_name;
                    const redirectPath = needsRegistration ? '/google-registration' : '/dashboard';

                    console.log(`Google auth detected. Redirecting to ${redirectPath} after delay.`);
                    navigate(redirectPath); // Remove { replace: true }
                  } else {
                    // Non-Google user redirect to dashboard
                    console.log('Non-Google auth. Redirecting to dashboard after delay.');
                    navigate('/dashboard'); // Remove { replace: true }
                  }
                }, 2000);
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

        // Fallback normal flow
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        console.log('Auth callback processing, search params:', { token: !!token, type });

        if (token && type === 'recovery') {
          handlePasswordRecovery(token, type, navigate);
          return;
        }

        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          console.log('User already has session, redirecting to dashboard');
          navigate('/dashboard'); // Remove { replace: true }
          return;
        }

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
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
            setIsProcessing
          );
          return;
        }

        console.log('No auth tokens or code, redirecting to auth page');
        setTimeout(() => {
          navigate('/auth'); // Remove { replace: true }
        }, 1000);
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
      {error ? (
        <ErrorState
          error={error}
          errorDetails={errorDetails}
          onRetry={handleRetry}
        />
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

export default AuthCallback;
