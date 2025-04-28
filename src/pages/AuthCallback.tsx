
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isPasswordResetFlow, handleMagicLinkAuth } from '@/utils/authCallbackUtils';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('Processing auth callback with URL:', window.location.href);
        
        // Check if this is a password recovery/reset flow
        if (isPasswordResetFlow(window.location.href)) {
          console.log('Detected password reset flow, redirecting to reset password page');
          
          // Get any token from the URL if present
          const searchParams = new URLSearchParams(window.location.search);
          const token = searchParams.get('token');
          
          // Redirect to reset password with the token if available
          navigate('/reset-password' + (token ? `?token=${token}` : ''), { replace: true });
          return;
        }

        // Handle regular magic link authentication
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
          // This is a recovery magic link
          console.log('Detected recovery magic link');
          navigate('/reset-password', { replace: true });
          return;
        }

        if (hash && hash.includes('access_token=')) {
          const handled = await handleMagicLinkAuth(hash.substring(1), navigate);
          if (handled) {
            return;
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
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, location]);

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
