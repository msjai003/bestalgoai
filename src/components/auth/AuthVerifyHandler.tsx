
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
      try {
        // First check if this is a recovery (password reset) flow
        if (location.hash) {
          const searchParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = searchParams.get('access_token');
          const type = searchParams.get('type');
          
          if (accessToken && type === 'recovery') {
            // If we have a recovery token, redirect to reset password
            navigate(`/reset-password?token=${accessToken}`, { replace: true });
            return;
          }
        }

        // Check if this is an OAuth callback or if we have a session
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
        } else {
          // No session but also no error - likely not an auth redirect
          console.log('No active session found');
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('Error during auth verification:', error);
        toast.error('An error occurred during authentication');
        navigate('/auth', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [navigate, location]);

  return <LoadingState message="Verifying authentication..." />;
};

export default AuthVerifyHandler;
