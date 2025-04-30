
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingState from './LoadingState';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthVerifyHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // First check if this is a recovery (password reset) flow
      const searchParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = searchParams.get('access_token');
      const type = searchParams.get('type');
      
      if (accessToken && type === 'recovery') {
        // If we have a recovery token, redirect to reset password
        navigate(`/reset-password?token=${accessToken}`, { replace: true });
        return;
      }

      // Check if this is an OAuth callback (like Google sign-in)
      try {
        // Getting the session will automatically process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth verification error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/auth', { replace: true });
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          console.log('Authentication successful, redirecting to dashboard');
          toast.success('Signed in successfully');
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error during auth verification:', error);
      }

      // If we get here, something went wrong or it's not an auth flow we recognize
      toast.error('Authentication flow has been removed or is invalid');
      navigate('/auth', { replace: true });
    };

    handleAuthRedirect();
  }, [navigate, location]);

  return <LoadingState message="Verifying authentication..." />;
};

export default AuthVerifyHandler;
