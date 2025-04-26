
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // First check if we have a hash from magic link
        if (window.location.hash && window.location.hash.includes('access_token=')) {
          console.log('Found magic link hash, processing...');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');

          if (accessToken && refreshToken) {
            // Set the session with the tokens from the magic link
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (error) {
              console.error('Error setting session from magic link:', error);
              setError('Invalid or expired magic link.');
              return;
            }

            if (data.session) {
              console.log('Successfully authenticated with magic link');
              
              // If this is a recovery (password reset) flow
              if (type === 'recovery' || location.pathname.includes('recovery')) {
                toast.success('You can now reset your password');
                navigate('/reset-password', { replace: true });
                return;
              }
              
              // Regular magic link authentication
              toast.success('Successfully signed in!');
              navigate('/dashboard', { replace: true });
              return;
            }
          }
        }

        // If no valid authentication data found
        setError('No valid authentication data found.');
      } catch (err) {
        console.error('Error processing authentication:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [navigate, location]);

  if (error) {
    return <ErrorState error={error} />;
  }

  return <LoadingState />;
};

export default AuthCallback;
