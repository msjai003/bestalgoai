
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
        
        // Parse URL parameters - handle both query params and hash fragments
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'));
        
        // Look for type parameter in both places
        const type = urlParams.get('type') || hashParams.get('type');
        const token = urlParams.get('token') || hashParams.get('access_token');
        
        console.log('Auth parameters detected:', { type, hasToken: !!token });
        
        if (type === 'recovery') {
          console.log('Password reset flow detected, redirecting to reset page');
          
          // For recovery flow, immediately redirect to reset password page
          // The token is automatically handled by Supabase client
          setTimeout(() => {
            navigate('/reset-password', { replace: true });
          }, 100);
        } else if (token || currentUrl.includes('access_token=')) {
          console.log('Auth verification with token detected');
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
