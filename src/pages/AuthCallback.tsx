
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const currentUrl = window.location.href;
        console.log('Processing auth callback with URL:', currentUrl);
        
        // Handle magic link authentication
        const hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
          console.log('Processing auth link from hash:', hash.substring(0, 20) + '...');
          
          try {
            // Parse the hash to extract the tokens
            const hashParams = new URLSearchParams(hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            if (accessToken && refreshToken) {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) {
                console.error('Error setting session:', error);
                setError('Authentication failed.');
                setErrorDetails(error.message);
                setIsProcessing(false);
              } else if (data.session) {
                // Check if this is a password reset flow by looking for type=recovery in the URL
                const type = hashParams.get('type');
                if (type === 'recovery') {
                  // If it's a password reset, redirect to reset password page
                  navigate('/reset-password', { replace: true });
                  return;
                }
                
                // For normal sign-ins, redirect to dashboard
                console.log('Authentication successful, redirecting to dashboard');
                navigate('/dashboard', { replace: true });
                return;
              }
            }
          } catch (err: any) {
            console.error('Error processing auth hash:', err);
            setError('Failed to process authentication link.');
            setErrorDetails(err?.message || 'Please try logging in again.');
            setIsProcessing(false);
          }
        }

        // If no valid authentication data found
        console.error('No valid authentication data found. Redirecting to login page.');
        setError('No valid authentication data found.');
        setErrorDetails('Unable to process authentication. The link may have expired or is invalid.');
        setIsProcessing(false);
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      } catch (err: any) {
        console.error('Error processing authentication:', err);
        setError('An unexpected error occurred.');
        setErrorDetails(err?.message || 'Please try logging in again.');
        setIsProcessing(false);
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center p-4">
        <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
          <ErrorState error={error} errorDetails={errorDetails} />
        </div>
      </div>
    );
  }

  return <LoadingState message="Processing authentication..." />;
};

export default AuthCallback;
