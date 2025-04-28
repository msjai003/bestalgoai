
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from './LoadingState';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthVerifyHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processVerification = async () => {
      try {
        // Get the current URL and process it
        const currentUrl = window.location.href;
        console.log('AuthVerifyHandler processing URL:', currentUrl);
        
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check if URL contains recovery token
        const type = urlParams.get('type') || hashParams.get('type');
        
        if (type === 'recovery') {
          console.log('Password reset flow detected, redirecting to reset page');
          
          // Ensure we have a session before redirecting
          const { data } = await supabase.auth.getSession();
          console.log('Current session state:', data.session ? 'Session exists' : 'No session');
          
          // Redirect to reset password page
          navigate('/reset-password', { replace: true });
        } else if (currentUrl.includes('access_token=')) {
          console.log('Auth verification with access token detected');
          navigate('/auth/callback', { replace: true });
        } else {
          console.log('Unrecognized auth URL, redirecting to auth page');
          toast.error('Authentication link may be invalid or expired');
          navigate('/auth', { replace: true });
        }
      } catch (err) {
        console.error('Error in AuthVerifyHandler:', err);
        toast.error('Authentication process failed');
        navigate('/auth', { replace: true });
      }
    };
    
    processVerification();
  }, [navigate]);

  return <LoadingState message="Processing authentication request..." />;
};

export default AuthVerifyHandler;
