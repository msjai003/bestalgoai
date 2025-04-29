
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from './LoadingState';
import { toast } from 'sonner';

const AuthVerifyHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processVerification = async () => {
      try {
        const currentUrl = window.location.href;
        console.log('AuthVerifyHandler processing URL:', currentUrl);
        
        // Extract tokens from both URL parameters and hash fragments
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        
        const token = urlParams.get('token') || hashParams.get('access_token');
        
        console.log('Extracted token:', token ? 'Present' : 'Not found');
        console.log('URL Search:', window.location.search);
        console.log('URL Hash:', window.location.hash);
        
        // This is a magic link or other auth flow
        if (token || currentUrl.includes('access_token=')) {
          console.log('Auth verification with token detected');
          navigate('/auth', { replace: true });
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
