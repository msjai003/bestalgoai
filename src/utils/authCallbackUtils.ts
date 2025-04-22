
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const handlePasswordRecovery = (token: string, type: string, navigate: (path: string) => void) => {
  console.log('Processing password recovery with token');
  navigate(`/forgot-password?token=${token}&type=${type}`);
};

export const handleAuthSession = async (
  accessToken: string,
  refreshToken: string,
  navigate: (path: string) => void,
  setError: (error: string | null) => void,
  setErrorDetails: (details: string | null) => void,
  setIsProcessing: (isProcessing: boolean) => void
): Promise<void> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    if (sessionError) {
      console.error('Error setting session from callback:', sessionError);
      setError('Authentication Error');
      setErrorDetails(sessionError.message || 'Failed to authenticate session. Please try again.');
      setIsProcessing(false);
      return;
    }
    
    console.log('Auth callback: Session set successfully');
    navigate('/dashboard');
    
  } catch (err) {
    console.error('Exception setting session in callback:', err);
    setError('Authentication Failed');
    setErrorDetails('An unexpected error occurred while processing your login. Please try again.');
    setIsProcessing(false);
  }
};

export const handleAuthError = (
  error: string | null,
  errorDescription: string | null,
  setError: (error: string | null) => void,
  setErrorDetails: (details: string | null) => void,
  setIsProcessing: (isProcessing: boolean) => void,
  navigate: (path: string) => void
) => {
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    setError('Authentication Error');
    setErrorDetails(errorDescription || 'Authentication failed. Please try again.');
    setIsProcessing(false);
  } else {
    navigate('/auth');
  }
};
