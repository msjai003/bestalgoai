
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      
      // Ensure session is properly stored in localStorage
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_at: sessionData.session.expires_at
      }));
      
      toast.success('Login successful!');

      setTimeout(() => {
        console.log('Redirecting to dashboard after successful auth');
        navigate('/dashboard');
      }, 1000);
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
    
    setTimeout(() => {
      navigate('/auth');
    }, 5000);
  } else {
    navigate('/dashboard');
  }
};

// Improved function to persist Google authentication
export const persistGoogleAuth = async (session: any): Promise<boolean> => {
  try {
    if (!session) return false;
    
    console.log('Persisting Google authentication session');
    
    // Ensure proper session storage in localStorage
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at
    }));
    
    // Store session data in browser storage for persistence
    const { error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
    
    if (error) {
      console.error('Failed to persist session:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error persisting Google auth:', error);
    return false;
  }
};
