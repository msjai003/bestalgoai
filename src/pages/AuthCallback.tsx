
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

  useEffect(() => {
    const processCallback = async () => {
      try {
        const fullUrl = window.location.href;
        const currentPath = location.pathname;

        console.log('Processing auth callback on path:', currentPath);
        console.log('Full callback URL:', fullUrl);

        // Handle callback for Google OAuth or any auth provider
        if (currentPath.includes('/callback')) {
          console.log('Auth callback detected, processing...');
          
          const searchParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(window.location.hash.substring(1));

          const code = searchParams.get('code');
          const errorParam = searchParams.get('error') || hashParams.get('error');
          const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

          console.log('Auth callback params:', {
            code: !!code,
            error: !!errorParam,
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

                // Persist the session
                const sessionPersisted = await persistGoogleAuth(data.session);
                
                if (!sessionPersisted) {
                  console.warn('Session may not have been properly persisted');
                }

                toast.success('Login successful!');
                
                // Force verification of session
                const { data: verifyData } = await supabase.auth.getUser();
                console.log('Verified user ID before redirect:', verifyData?.user?.id);
                
                // Add a delay to ensure session is fully established before redirect
                setTimeout(() => {
                  console.log('Redirecting to dashboard after successful authentication');
                  // Use window.location for a hard redirect
                  window.location.href = '/dashboard';
                }, 1000);
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
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        console.log('Auth callback processing, search params:', { token: !!token, type });

        if (token && type === 'recovery') {
          handlePasswordRecovery(token, type, navigate);
          return;
        }

        // Check if user already has a session
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          console.log('User already has session, redirecting to dashboard');
          // Use window.location for a hard redirect
          window.location.href = '/dashboard';
          return;
        }

        // Handle access token in hash fragment (for legacy auth flows)
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

        // If we reach here, no valid auth parameters were found
        console.log('No auth tokens or code, redirecting to auth page');
        setTimeout(() => {
          navigate('/auth');
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
    toast({ title: "Retrying authentication", description: "Please wait..." });
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
