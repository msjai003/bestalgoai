
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingState from './LoadingState';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthVerifyHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string>("Verifying authentication...");

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // First check for password recovery flow
      const searchParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = searchParams.get('access_token');
      const type = searchParams.get('type');
      
      if (accessToken && type === 'recovery') {
        // If we have a recovery token, redirect to reset password
        navigate(`/reset-password?token=${accessToken}`, { replace: true });
        return;
      }
      
      // Check for other auth flows (like OAuth with Google)
      if (location.hash && (location.hash.includes('access_token') || location.hash.includes('error'))) {
        setMessage("Processing authentication...");
        try {
          // The presence of hash suggests we're in an OAuth callback
          // Let Supabase auth handle the exchange
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Auth verification error:", error);
            toast.error("Authentication failed. Please try again.");
            navigate('/auth', { replace: true });
            return;
          }
          
          if (data?.session) {
            // Successfully authenticated
            console.log("Auth verified successfully");
            toast.success("Successfully logged in!");
            navigate('/dashboard', { replace: true });
            return;
          }
        } catch (err) {
          console.error("Exception during auth verification:", err);
        }
      }
      
      // If we get here, the auth flow was not recognized or failed
      toast.error('Authentication flow has been interrupted or is invalid');
      navigate('/auth', { replace: true });
    };
    
    handleAuthRedirect();
  }, [navigate, location]);

  return <LoadingState message={message} />;
};

export default AuthVerifyHandler;
