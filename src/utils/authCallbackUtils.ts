import { supabase } from '@/integrations/supabase/client';

export const handlePasswordRecovery = (token: string, type: string, navigate: (path: string, options?: {replace: boolean}) => void) => {
  console.log('Processing password recovery with token:', token ? token.substring(0, 5) + '...' : 'null');
  
  if (!token) {
    console.log('No token provided for password recovery, redirecting to reset-password with reset flag');
    navigate('/reset-password?reset=true', { replace: true });
    return;
  }
  
  // Add token to the URL to ensure it's available on the reset page
  navigate(`/reset-password?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type || 'recovery')}`, { replace: true });
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
  
  // Check old domain format with token in the URL path
  // This handles redirects from bestalgo.ai/auth/v1/verify/TOKEN
  const oldDomainVerifyMatch = url.match(/\/auth\/v1\/verify\/([^?&]+)/);
  if (oldDomainVerifyMatch && oldDomainVerifyMatch[1]) {
    console.log('Found token in old domain path format:', oldDomainVerifyMatch[1].substring(0, 5) + '...');
    return oldDomainVerifyMatch[1];
  }
  
  // Check URL hash fragment
  if (window.location.hash) {
    // Handle standard hash params format
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    token = hashParams.get('token');
    
    if (token) {
      console.log('Found token in hash fragment:', token.substring(0, 5) + '...');
      return token;
    }
    
    // Check access_token in hash (common for magic links)
    const accessToken = hashParams.get('access_token');
    if (accessToken) {
      console.log('Found access_token in hash:', accessToken.substring(0, 5) + '...');
      return accessToken;
    }
    
    // Try to extract raw token from hash if it doesn't contain standard params
    if (window.location.hash.length > 10 && !window.location.hash.includes('=')) {
      const cleanHash = window.location.hash.replace(/^#/, '');
      console.log('Extracted potential token from raw hash:', cleanHash.substring(0, 5) + '...');
      return cleanHash;
    }
  }
  
  // Check if token might be in the path segment for /auth/v1/verify/:token format
  if (path.includes('/verify') || path.includes('/reset-password') || path.includes('/recovery')) {
    // Check for v1 API format: /auth/v1/verify/:token
    const v1Match = path.match(/\/auth\/v1\/verify\/(.*)/);
    if (v1Match && v1Match[1]) {
      console.log('Extracted token from v1 path format:', v1Match[1].substring(0, 5) + '...');
      return v1Match[1];
    }
    
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

export const handleAuthError = async (
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

export const isPasswordResetFlow = (url: string): boolean => {
  // Check for bestalgo.ai domain with reset parameters - explicit check first
  if (url.includes('bestalgo.ai')) {
    console.log('Detected request from bestalgo.ai domain');
    if (url.includes('/auth/callback') || 
        url.includes('/auth/v1/verify') || 
        url.includes('type=recovery')) {
      console.log('Confirmed password reset flow from bestalgo.ai domain');
      return true;
    }
  }
  
  // Check for recovery parameters in query string
  const hasResetParam = url.includes('type=recovery') || 
                        url.includes('reset=true') ||
                        url.includes('flow=recovery');
  
  // Check for recovery in path segments
  const hasResetPath = url.includes('/reset-password') || 
                       url.includes('/recovery') ||
                       url.includes('/auth/recovery') ||
                       url.includes('/auth/v1/verify');
  
  // Check for "action=resetPassword" parameter which is used by some providers
  const hasResetAction = url.includes('action=resetPassword');
  
  // Check if URL contains hash with recovery type
  const hasRecoveryHash = url.includes('#type=recovery') ||
                          (url.includes('#') && url.toLowerCase().includes('recover'));
  
  console.log('Checking if password reset flow:', { 
    hasResetParam, 
    hasResetPath, 
    hasResetAction, 
    hasRecoveryHash, 
    url 
  });
  
  return hasResetParam || hasResetPath || hasResetAction || hasRecoveryHash;
};

export const handleMagicLinkAuth = async (hash: string, navigate: (path: string, options?: {replace: boolean}) => void): Promise<boolean> => {
  if (!hash || !hash.includes('access_token=')) {
    return false;
  }

  try {
    console.log('Processing magic link authentication from hash');
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');
    
    if (!accessToken || !refreshToken) {
      console.log('Missing required tokens in hash');
      return false;
    }
    
    // If this is a recovery flow, redirect to password reset
    if (type === 'recovery' || hash.includes('type=recovery') || hash.includes('recovery')) {
      console.log('Magic link is for password recovery, redirecting to reset page');
      
      // Set the session first
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      
      if (error) {
        console.error('Error setting session from recovery magic link:', error);
        return false;
      }
      
      // Redirect to reset password page with hash in URL to maintain state
      const encodedHash = encodeURIComponent(hash);
      navigate(`/reset-password?hash=${encodedHash}`, { replace: true });
      return true;
    }
    
    // Otherwise handle as regular magic link authentication
    console.log('Setting session from magic link tokens');
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    if (error) {
      console.error('Error setting session from magic link:', error);
      return false;
    }
    
    if (data.session) {
      console.log('Successfully set session from magic link, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Error handling magic link auth:', err);
    return false;
  }
};

export const handleOldDomainRedirect = (url: string, navigate: (path: string, options?: {replace: boolean}) => void): boolean => {
  // Check if this is a redirect from the old bestalgo.ai domain or any URL with the old format
  if (url.includes('bestalgo.ai') || url.includes('/auth/v1/verify')) {
    console.log('Detected redirect from bestalgo.ai domain or old URL format');
    
    // Extract the token from the URL
    const tokenMatch = url.match(/\/auth\/v1\/verify\/([^?&]+)/);
    let token = null;
    
    if (tokenMatch && tokenMatch[1]) {
      token = tokenMatch[1];
      console.log('Extracted token from URL path:', token.substring(0, 5) + '...');
    } else {
      // Try to get from search parameters
      const searchParams = new URLSearchParams(window.location.search);
      token = searchParams.get('token');
      if (token) {
        console.log('Extracted token from query params:', token.substring(0, 5) + '...');
      }
    }
    
    // Extract type from query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type') || 'recovery'; // Default to recovery
    
    // Always redirect to reset password page
    if (token) {
      console.log('Redirecting to reset password page with token');
      navigate(`/reset-password?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`, { replace: true });
      return true;
    } else {
      // If no token found but still a recovery flow, redirect to reset password
      console.log('Redirecting to reset password page without token');
      navigate(`/reset-password?type=${encodeURIComponent(type)}`, { replace: true });
      return true;
    }
  }
  
  return false;
};
