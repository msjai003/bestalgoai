
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from '@/components/auth/LoadingState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const currentUrl = window.location.href;
        console.log('Processing auth callback with URL:', currentUrl);

        // Parse URL parameters from both search and hash
        const urlSearchParams = new URLSearchParams(window.location.search);
        const hashSearchParams = new URLSearchParams(window.location.hash.substring(1));

        // Check if this is a recovery/reset password flow
        const type = urlSearchParams.get('type') || hashSearchParams.get('type');
        
        if (type === 'recovery') {
          console.log('Detected password reset flow, redirecting to reset-password page');
          navigate('/reset-password', { replace: true });
          return;
        }
        
        // Handle magic link or other authentication
        const hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
          console.log('Processing auth link from hash:', hash.substring(0, 20) + '...');
          
          try {
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
                toast.error('Authentication failed');
                navigate('/auth', { replace: true });
              } else if (data.session) {
                console.log('Authentication successful, redirecting to dashboard');
                toast.success('Successfully signed in');
                navigate('/dashboard', { replace: true });
              }
            } else {
              toast.error('Invalid authentication link');
              navigate('/auth', { replace: true });
            }
          } catch (err: any) {
            console.error('Error processing auth hash:', err);
            toast.error('Authentication process failed');
            navigate('/auth', { replace: true });
          }
        } else {
          console.log('No valid authentication data found in URL');
          toast.error('Authentication link may be invalid or expired');
          navigate('/auth', { replace: true });
        }
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        toast.error('An error occurred during authentication');
        navigate('/auth', { replace: true });
      }
    };

    processCallback();
  }, [navigate]);

  return <LoadingState message="Processing authentication..." />;
};

export default AuthCallback;
