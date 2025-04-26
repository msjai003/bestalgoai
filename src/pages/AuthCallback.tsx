
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
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('Processing auth callback with URL:', window.location.href);
        
        // First check if this is a password recovery/reset flow
        if (isPasswordResetFlow(window.location.href)) {
          console.log('Detected password reset flow');
          
          // Handle magic link hash for password reset (most common)
          if (window.location.hash && window.location.hash.includes('access_token=')) {
            console.log('Found magic link hash for recovery, processing...');
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            if (accessToken && refreshToken) {
              // Set the session first
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) {
                console.error('Error setting session from password reset link:', error);
                setError('Invalid or expired password reset link.');
                setIsProcessing(false);
                return;
              }
              
              if (data.session) {
                console.log('Successfully set session from password reset link');
                toast.success('You can now reset your password');
                navigate('/reset-password', { replace: true });
                return;
              }
            }
          }
          
          // If we have query params for password reset
          const searchParams = new URLSearchParams(window.location.search);
          const token = searchParams.get('token');
          const type = searchParams.get('type');
          
          if (token || type === 'recovery') {
            console.log('Found token in URL for recovery');
            navigate(`/reset-password?token=${token || ''}&type=${type || 'recovery'}`, { replace: true });
            return;
          }
          
          // Default to reset password page anyway if we detect recovery
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
        setError('No valid authentication data found.');
        setIsProcessing(false);
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      } catch (err) {
        console.error('Error processing authentication:', err);
        setError('An unexpected error occurred.');
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
    return <ErrorState error={error} />;
  }

  return <LoadingState message="Processing authentication..." />;
};

export default AuthCallback;
