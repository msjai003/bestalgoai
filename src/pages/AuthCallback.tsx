
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  handlePasswordRecovery, 
  handleAuthSession, 
  handleAuthError, 
  extractVerificationToken,
  isPasswordResetFlow,
  handleMagicLinkAuth
} from '@/utils/authCallbackUtils';
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
        console.log('URL hash:', window.location.hash);
        
        // First priority: Check if this is a recovery flow with token in query params or hash
        const token = searchParams.get('token') || extractVerificationToken(fullUrl, currentPath);
        const type = searchParams.get('type') || 'recovery';
        
        if ((token && type === 'recovery') || 
            fullUrl.includes('type=recovery') || 
            isPasswordResetFlow(fullUrl)) {
          console.log('Detected password recovery flow with token:', token ? token.substring(0, 5) + '...' : 'null');
          handlePasswordRecovery(token || '', type, navigate);
          return;
        }

        // Second priority: Check hash for magic link access token
        if (window.location.hash && window.location.hash.includes('access_token=')) {
          console.log('Detected magic link with token in hash');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const hashType = hashParams.get('type');
          
          // If it's a recovery type magic link
          if (hashType === 'recovery' || fullUrl.includes('type=recovery')) {
            console.log('Processing recovery magic link from hash');
            
            // Set session first to authenticate the user
            if (accessToken && refreshToken) {
              try {
                const { data, error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
                
                if (!error && data.session) {
                  console.log('Successfully set session from recovery magic link');
                  navigate('/reset-password?reset=true', { replace: true });
                  return;
                } else {
                  console.error('Error setting session from recovery magic link:', error);
                }
              } catch (err) {
                console.error('Exception handling recovery magic link:', err);
              }
            }
          } else {
            // Regular magic link auth
            const handled = await handleMagicLinkAuth(window.location.hash, navigate);
            if (handled) {
              console.log('Successfully handled regular magic link authentication');
              return;
            }
          }
        }
        
        // Handle standard auth callback flows
        if (currentPath.includes('/auth/callback') || currentPath.includes('/auth/v1/callback')) {
          console.log('Processing standard auth callback');
          
          const callbackSearchParams = new URLSearchParams(window.location.search);
          const code = callbackSearchParams.get('code');
          const callbackError = callbackSearchParams.get('error');
          const errorDescription = callbackSearchParams.get('error_description');
          
          // Check for password reset in auth callback path
          const reset = callbackSearchParams.get('reset');
          if (reset === 'true' || callbackSearchParams.get('type') === 'recovery') {
            console.log('Reset flag detected in callback params');
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              console.log('Active session found with reset flag, redirecting to password reset');
              navigate('/reset-password?reset=true', { replace: true });
              return;
            }
          }

          // Handle errors in the callback
          if (callbackError) {
            handleAuthError(
              callbackError,
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
            console.log('Processing auth code exchange');
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code);
              
              if (error) {
                console.error('Error exchanging code for session:', error);
                setError('Authentication Error');
                setErrorDetails(error.message || 'Failed to complete authentication.');
                setIsProcessing(false);
              } else if (data.session) {
                console.log('Successfully exchanged code for session');
                
                // Check if this is a recovery flow
                if (isPasswordResetFlow(fullUrl)) {
                  console.log('Recovery flow detected after code exchange');
                  navigate('/reset-password?reset=true', { replace: true });
                  return;
                }
                
                // Regular auth flow
                setTimeout(() => {
                  navigate('/dashboard', { replace: true });
                }, 2000);
              }
            } catch (err) {
              console.error('Exception in auth code exchange:', err);
              setError('Authentication Failed');
              setErrorDetails('An unexpected error occurred. Please try again.');
              setIsProcessing(false);
            }
            return;
          }
        }
        
        // Fallback: Check if user already has a session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          if (isPasswordResetFlow(fullUrl)) {
            console.log('Password reset flow with active session, redirecting to reset page');
            navigate('/reset-password?reset=true', { replace: true });
            return;
          }
          
          console.log('User already has an active session, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }
        
        console.log('No authentication data found, redirecting to auth page');
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
