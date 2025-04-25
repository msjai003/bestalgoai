
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
        
        // Check for token in query parameters (recovery flow)
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        // Special handling for password recovery tokens
        if (token && type === 'recovery') {
          console.log('Password recovery token found, redirecting to reset password page');
          navigate(`/forgot-password?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`, { replace: true });
          return;
        }

        if (currentPath.includes('/auth/callback') || currentPath.includes('/auth/v1/callback')) {
          console.log('Detected auth callback route, processing...');
          
          const searchParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          
          const code = searchParams.get('code');
          const error = searchParams.get('error') || hashParams.get('error');
          const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
          
          // Look for recovery flow in auth callback path
          if (token && type === 'recovery') {
            console.log('Password recovery token found in auth callback, redirecting to forgot-password page');
            navigate(`/forgot-password?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`, { replace: true });
            return;
          }

          if (error) {
            console.error('Auth callback received error:', error, errorDescription);
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
                
                const isGoogleAuth = data.session.user?.app_metadata?.provider === 'google';
                const delay = isGoogleAuth ? 3000 : 2000;
                
                const redirectPath = isGoogleAuth && !data.session.user?.user_metadata?.full_name 
                  ? '/google-registration' 
                  : '/dashboard';
                
                console.log(`Will redirect to ${redirectPath} after ${delay}ms delay`);
                
                setTimeout(() => {
                  navigate(redirectPath);
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
        
        // Check again for token in case it wasn't handled above
        if (token && type === 'recovery') {
          handlePasswordRecovery(token, type, navigate);
          return;
        }
        
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log('User already has an active session, redirecting to dashboard');
          navigate('/dashboard');
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
        } else {
          console.log('No authentication data found in URL, redirecting to auth page');
          setTimeout(() => navigate('/auth'), 1000);
        }
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
