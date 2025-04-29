
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
        const type = urlParams.get('type') || hashParams.get('type');
        
        console.log('Extracted token:', token ? 'Present' : 'Not found');
        console.log('Extracted type:', type);
        console.log('URL Search:', window.location.search);
        console.log('URL Hash:', window.location.hash);
        
        // Check for password reset flow first
        if (type === 'recovery' || 
            currentUrl.includes('type=recovery') || 
            currentUrl.toLowerCase().includes('recovery')) {
          // This is a password reset flow
          console.log('Password reset flow detected - redirecting to reset password page');
          
          // Pass the entire hash and search parameters to preserve all tokens
          navigate('/reset-password' + window.location.search + window.location.hash, { replace: true });
          
        } else if (token || currentUrl.includes('access_token=')) {
          // This is a magic link or other auth flow
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
