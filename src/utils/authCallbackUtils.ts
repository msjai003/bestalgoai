import { supabase } from '@/integrations/supabase/client';

export const handlePasswordRecovery = (token: string, type: string, navigate: (path: string, options?: {replace: boolean}) => void) => {
  console.log('Processing password recovery with token:', token ? token.substring(0, 5) + '...' : 'null');
  // Directly navigate to reset-password instead of auth
  navigate(`/reset-password?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}&reset=true`, { replace: true });
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
  
  // Check access_token in hash (common for magic links)
  if (window.location.hash && window.location.hash.includes('access_token=')) {
    const accessToken = window.location.hash.split('access_token=')[1]?.split('&')[0];
    if (accessToken) {
      console.log('Found access_token in hash:', accessToken.substring(0, 5) + '...');
      // This isn't the recovery token itself, but indicates we're in a magic link flow
      return 'access_token_present';
    }
  }
  
  // Check if token might be in the path segment for /auth/v1/verify/:token format
  if (path.includes('/verify') || path.includes('/reset-password') || path.includes('/recovery')) {
    const pathSegments = path.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // If last segment is not "verify" or "reset-password" itself, it might be the token
    if (lastSegment && lastSegment !== 'verify' && lastSegment !== 'reset-password' && lastSegment !== 'recovery') {
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
  
  // Check if the URL itself might contain a token (sometimes tokens are embedded directly in paths)
  const urlParts = url.split('/');
  for (const part of urlParts) {
    // Look for parts that might be tokens (long strings that aren't common path segments)
    if (part && part.length > 20 && !part.includes('.') && !part.includes('?')) {
      console.log('Found possible token in URL path part:', part.substring(0, 5) + '...');
      return part;
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
      refresh_token: refreshToken,
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
