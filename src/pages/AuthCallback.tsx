
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handlePasswordRecovery, handleAuthSession, handleAuthError } from '@/utils/authCallbackUtils';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        console.log('Auth callback processing, search params:', { token: !!token, type });
        
        if (token && type === 'recovery') {
          handlePasswordRecovery(token, type, navigate);
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
            // If we don't have tokens or errors, this might be an invalid callback
            // Redirect to dashboard if user is already authenticated
            console.log('No tokens or errors in callback params, checking if user is already authenticated');
            
            // Let's wait a moment before redirecting to ensure auth state is ready
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
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
  }, [navigate, retryCount]);

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
