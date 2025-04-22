
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

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('Auth callback processing');
        
        // Check if there's already an active session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log('Active session found, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
        
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        
        if (code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error('Error exchanging code for session:', error);
              setError('Authentication Error');
              setErrorDetails(error.message);
              setIsProcessing(false);
            } else if (data.session) {
              console.log('Successfully exchanged code, redirecting to dashboard');
              navigate('/dashboard');
            }
          } catch (err) {
            console.error('Exception exchanging code for session:', err);
            setError('Authentication Failed');
            setErrorDetails('An unexpected error occurred. Please try again.');
            setIsProcessing(false);
          }
        } else {
          // No code found, redirect to auth page
          navigate('/auth');
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('Authentication Failed');
        setErrorDetails('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
      {error ? (
        <ErrorState 
          error={error}
          errorDetails={errorDetails}
          onRetry={() => {
            setError(null);
            setErrorDetails(null);
          }}
        />
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

export default AuthCallback;
