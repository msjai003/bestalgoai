
import { supabase } from '@/integrations/supabase/client';

export const handlePasswordRecovery = (token: string, type: string, navigate: (path: string, options?: {replace: boolean}) => void) => {
  console.log('Processing password recovery with token:', token ? token.substring(0, 5) + '...' : 'null');
  // Navigate to forgot-password with token and type as query params, using replace: true to prevent back navigation issues
  navigate(`/forgot-password?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`, { replace: true });
};

export const extractVerificationToken = (url: string, path: string): string | null => {
  console.log('Extracting verification token from URL:', url, 'Path:', path);
  
  // First check query parameters
  const searchParams = new URLSearchParams(window.location.search);
  let token = searchParams.get('token');
  
  if (token) {
    console.log('Found token in query params:', token.substring(0, 5) + '...');
    return token;
  }
  
  // Check URL hash fragment
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  token = hashParams.get('token');
  
  if (token) {
    console.log('Found token in hash fragment:', token.substring(0, 5) + '...');
    return token;
  }
  
  // Check if token might be in the path segment for /auth/v1/verify/:token format
  if (path.includes('/verify')) {
    const pathSegments = path.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // If last segment is not "verify" itself, it might be the token
    if (lastSegment && lastSegment !== 'verify') {
      console.log('Extracted token from path segment:', lastSegment.substring(0, 5) + '...');
      return lastSegment;
    }
  }
  
  // Check if token is part of the URL after token=
  if (url.includes('token=')) {
    const tokenPart = url.split('token=')[1];
    if (tokenPart) {
      token = tokenPart.split('&')[0];
      console.log('Extracted token from URL string:', token.substring(0, 5) + '...');
      return token;
    }
  }
  
  console.log('No token found in URL');
  return null;
};

export const handleAuthSession = async (
  accessToken: string,
  refreshToken: string,
  navigate: (path: string, options?: {replace: boolean}) => void,
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
      
      // Using a longer delay for Google auth to ensure session is properly set
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
  navigate: (path: string, options?: {replace: boolean}) => void
) => {
  if (error) {
    console.error('Auth error:', error, errorDescription);
    setError('Authentication Error');
    setErrorDetails(errorDescription || 'Authentication failed. Please try again.');
    setIsProcessing(false);
    
    // Give user a way back instead of staying on error page
    setTimeout(() => {
      navigate('/auth', { replace: true });
    }, 5000);
  } else {
    console.log('No error specified, redirecting to dashboard');
    navigate('/dashboard', { replace: true });
  }
};
