import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingState from './LoadingState';
import { toast } from 'sonner';

const AuthVerifyHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse URL parameters to check for reset token
    const searchParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    if (accessToken && type === 'recovery') {
      // If we have a recovery token, redirect to reset password
      navigate(`/reset-password?token=${accessToken}`, { replace: true });
    } else {
      // Otherwise, redirect to auth page
      toast.error('Authentication flow has been removed or is invalid');
      navigate('/auth', { replace: true });
    }
  }, [navigate, location]);

  return <LoadingState message="Redirecting..." />;
};

export default AuthVerifyHandler;
