
import { supabase } from '@/integrations/supabase/client';

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
    console.log('Attempting to set session from callback tokens');
    
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
    
    console.log('Auth callback: Session set successfully, redirecting to dashboard');
    // Adding a longer delay before navigation to ensure session is fully set
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
    
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
    // If no error is specified but handleAuthError was called,
    // redirect to authentication page
    console.log('No specific error provided, redirecting to auth page');
    navigate('/auth');
  }
};
