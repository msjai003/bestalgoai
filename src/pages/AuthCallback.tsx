
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handlePasswordRecovery, handleAuthSession, handleAuthError, extractVerificationToken } from '@/utils/authCallbackUtils';
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
        const searchParams = new URLSearchParams(window.location.search);
        
        console.log('Processing auth callback on path:', currentPath);
        console.log('Full callback URL:', fullUrl);
        console.log('Query params:', Object.fromEntries(searchParams));
        
        // First check for recovery type in query params or URL
        if (searchParams.get('type') === 'recovery' || 
            fullUrl.includes('type=recovery') || 
            fullUrl.includes('access_token=')) {
          console.log('Recovery flow detected in URL parameters');
          
          const token = extractVerificationToken(fullUrl, currentPath);
          if (token) {
            console.log('Found recovery token, redirecting to reset password');
            handlePasswordRecovery(token, 'recovery', navigate);
            return;
          }
        }
        
        // Check for reset password paths
        if (currentPath.includes('/verify') || 
            currentPath.includes('/auth/v1/verify') ||
            currentPath.includes('/reset-password') ||
            currentPath.includes('/recovery')) {
          console.log('Verification or reset path detected');
          
          const token = extractVerificationToken(fullUrl, currentPath);
          
          if (token) {
            console.log('Token found, handling password recovery');
            handlePasswordRecovery(token, 'recovery', navigate);
            return;
          }
        }

        // Special handling for magic links that contain tokens in the hash
        const urlHashParams = new URLSearchParams(window.location.hash.substring(1));
        if (urlHashParams.get('access_token') || window.location.hash.includes('access_token=')) {
          console.log('Magic link with hash detected');
          
          if (urlHashParams.get('type') === 'recovery' || 
              window.location.hash.includes('type=recovery') ||
              fullUrl.includes('reset-password')) {
            console.log('Recovery hash detected, redirecting to reset password');
            const token = extractVerificationToken(window.location.hash, currentPath);
            if (token) {
              handlePasswordRecovery(token, 'recovery', navigate);
              return;
            }
          }
        }

        // Special handling for password recovery flows
        if (fullUrl.includes('type=recovery') || searchParams.get('type') === 'recovery') {
          console.log('Recovery flow detected in URL');
          
          // Try to extract token from various places in the URL
          const token = extractVerificationToken(fullUrl, currentPath);
          if (token) {
            handlePasswordRecovery(token, 'recovery', navigate);
            return;
          }
          
          navigate('/reset-password', { replace: true });
          return;
        }
        
        // Handle standard auth callback flows
        if (currentPath.includes('/auth/callback') || currentPath.includes('/auth/v1/callback')) {
          console.log('Detected auth callback route, processing...');
          
          const searchParams = new URLSearchParams(window.location.search);
          const authHashParams = new URLSearchParams(window.location.hash.substring(1));
          
          const code = searchParams.get('code');
          const error = searchParams.get('error') || authHashParams.get('error');
          const errorDescription = searchParams.get('error_description') || authHashParams.get('error_description');
          
          // Look for reset flow in auth callback path
          const reset = searchParams.get('reset');
          if (reset === 'true' || searchParams.get('type') === 'recovery') {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              console.log('Active session found and reset flag is true, redirecting to password reset page');
              navigate('/reset-password?reset=true', { replace: true });
              return;
            }
          }

          // Handle errors in the callback
          if (error) {
            handleAuthError(
              error,
              errorDescription,
              setError,
              setErrorDetails,
              setIsProcessing,
              navigate
            );
            return;
          }

          // Handle auth code exchange
          if (code) {
            console.log('Found auth code in callback, exchanging for session');
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code);
              
              if (error) {
                console.error('Error exchanging code for session:', error);
                setError('Authentication Error');
                setErrorDetails(error.message || 'Failed to complete authentication.');
                setIsProcessing(false);
              } else if (data.session) {
                console.log('Successfully exchanged code for session');
                
                // Check if this is a recovery (password reset) flow
                const currentSearchParams = new URLSearchParams(window.location.search);
                if (fullUrl.includes('type=recovery') || 
                    currentSearchParams.get('type') === 'recovery' || 
                    currentSearchParams.get('reset') === 'true') {
                  console.log('Recovery flow detected after exchanging code, redirecting to reset-password');
                  navigate('/reset-password?reset=true', { replace: true });
                  return;
                }
                
                const isGoogleAuth = data.session.user?.app_metadata?.provider === 'google';
                const delay = isGoogleAuth ? 3000 : 2000;
                
                const redirectPath = isGoogleAuth && !data.session.user?.user_metadata?.full_name 
                  ? '/google-registration' 
                  : '/dashboard';
                
                console.log(`Will redirect to ${redirectPath} after ${delay}ms delay`);
                
                setTimeout(() => {
                  navigate(redirectPath, { replace: true });
                }, delay);
                
                return;
              }
            } catch (err) {
              console.error('Exception exchanging code for session:', err);
              setError('Authentication Failed');
              setErrorDetails('An unexpected error occurred. Please try again.');
              setIsProcessing(false);
            }
            return;
          }
        }
        
        // Check if user already has a session and if this is a recovery flow
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          // Check if this is a recovery (password reset) flow
          if (fullUrl.includes('type=recovery') || 
              searchParams.get('type') === 'recovery' || 
              searchParams.get('reset') === 'true') {
            console.log('Recovery flow detected with active session, redirecting to reset password page');
            navigate('/reset-password?reset=true', { replace: true });
            return;
          }
          
          console.log('User already has an active session, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }
        
        // Check for magic link tokens in hash
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');
          
          console.log('Auth callback processing hash params:', { 
            accessToken: !!accessToken, 
            refreshToken: !!refreshToken,
            type,
            fullHash: window.location.hash
          });
          
          // For password reset flow
          if (type === 'recovery' || window.location.hash.includes('type=recovery')) {
            console.log('Recovery token found in hash');
            const token = accessToken || extractVerificationToken(window.location.hash, currentPath);
            if (token) {
              handlePasswordRecovery(token, 'recovery', navigate);
              return;
            }
          }
          
          // For regular auth session
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
        }
        
        console.log('No authentication data found in URL, redirecting to auth page');
        setTimeout(() => navigate('/auth', { replace: true }), 1000);
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
