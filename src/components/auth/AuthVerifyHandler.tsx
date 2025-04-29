
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from './LoadingState';
import { toast } from 'sonner';

const AuthVerifyHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Since we're removing the auth callback functionality,
    // simply redirect users to the authentication page
    toast.error('Authentication flow has been removed');
    navigate('/auth', { replace: true });
  }, [navigate]);

  return <LoadingState message="Redirecting..." />;
};

export default AuthVerifyHandler;
