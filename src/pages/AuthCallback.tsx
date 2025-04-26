
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
          
          // Always redirect to reset password for any recovery flow
          navigate('/reset-password', { replace: true });
          return;
        }

        // Handle regular magic link authentication (for login, not recovery)
        if (window.location.hash && window.location.hash.includes('access_token=')) {
          const handled = await handleMagicLinkAuth(window.location.hash.substring(1), navigate);
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
