
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from './LoadingState';
import { toast } from 'sonner';

const AuthVerifyHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current URL and process it
    const currentUrl = window.location.href;
    console.log('AuthVerifyHandler processing URL:', currentUrl);

    // Check if URL contains recovery token
    if (currentUrl.includes('type=recovery')) {
      console.log('Password reset flow detected, redirecting to reset page');
      navigate('/reset-password', { replace: true });
    } else {
      console.log('Unrecognized auth URL, redirecting to auth page');
      toast.error('Authentication link may be invalid or expired');
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  return <LoadingState message="Processing authentication request..." />;
};

export default AuthVerifyHandler;
