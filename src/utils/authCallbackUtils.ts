
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
    console.log('Setting session with tokens from callback');
    
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    if (sessionError) {
      console.error('Error setting session:', sessionError);
      setError('Authentication Error');
      setErrorDetails(sessionError.message);
      setIsProcessing(false);
      return;
    }

    if (sessionData?.session?.user) {
      console.log('Session set successfully, user authenticated:', sessionData.session.user.id);
      
      // Using a longer delay for auth to ensure session is properly set
      setTimeout(() => {
        console.log('Redirecting to dashboard after successful auth');
        navigate('/dashboard', { replace: true });
      }, 2000);
    } else {
      console.error('No user in session data after setting session');
      setError('Authentication Error');
      setErrorDetails('Failed to get user session');
      setIsProcessing(false);
    }
    
  } catch (err) {
    console.error('Exception in handleAuthSession:', err);
    setError('Authentication Failed');
    setErrorDetails('An unexpected error occurred. Please try again.');
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
    console.error('Auth error:', error, errorDescription);
    setError('Authentication Error');
    setErrorDetails(errorDescription || 'Authentication failed. Please try again.');
    setIsProcessing(false);
    
    // Give user a way back instead of staying on error page
    setTimeout(() => {
      navigate('/auth');
    }, 5000);
  } else {
    console.log('No error specified, redirecting to dashboard');
    navigate('/dashboard', { replace: true });
  }
};
