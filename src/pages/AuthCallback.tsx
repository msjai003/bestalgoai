
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
        console.log('Auth callback processing on path:', location.pathname);
        console.log('Full URL:', window.location.href);
        
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        console.log('Auth callback processing, search params:', { token: !!token, type });
        
        if (token && type === 'recovery') {
          handlePasswordRecovery(token, type, navigate);
          return;
        }
        
        // Check if there's a session first (user might already be logged in)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log('User already has an active session, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
        
        // Check for hash params (used in implicit flow)
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
          // Check for error in URL params
          const error = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (error || errorDescription) {
            console.error('Auth callback received error:', error, errorDescription);
            handleAuthError(
              error,
              errorDescription,
              setError,
              setErrorDetails,
              setIsProcessing,
              navigate
            );
          } else {
            // If we're on the callback page without tokens or errors, try to extract
            // the code from the URL and exchange it for a session
            const code = searchParams.get('code');
            
            if (code) {
              console.log('Found authorization code, attempting to exchange for session');
              try {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                
                if (error) {
                  console.error('Error exchanging code for session:', error);
                  setError('Authentication Error');
                  setErrorDetails(error.message || 'Failed to complete authentication.');
                  setIsProcessing(false);
                } else if (data.session) {
                  console.log('Successfully exchanged code for session, redirecting to dashboard');
                  setTimeout(() => navigate('/dashboard'), 500);
                }
              } catch (err) {
                console.error('Exception exchanging code for session:', err);
                setError('Authentication Failed');
                setErrorDetails('An unexpected error occurred. Please try again.');
                setIsProcessing(false);
              }
            } else {
              // No tokens, no code, no errors - redirect to the auth page
              console.log('No authentication data found in URL, redirecting to auth page');
              setTimeout(() => navigate('/auth'), 500);
            }
          }
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
