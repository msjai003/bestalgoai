
// Barrel export for mock auth helpers
export const extractTokenFromUrl = (url: URL): string | null => {
  // Try hash fragment first (most common format from Supabase)
  if (url.hash) {
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const token = hashParams.get('access_token');
    if (token) return token;
    
    // If no structured params, try the whole hash
    if (url.hash.length > 10) {
      return url.hash.substring(1);
    }
  }
  
  // If not in hash, check query params
  const tokenParam = url.searchParams.get('token');
  if (tokenParam) return tokenParam;
  
  // Check if token is in the path segments
  const pathSegments = url.pathname.split('/');
  for (const segment of pathSegments) {
    if (segment.length > 20) {
      return segment;
    }
  }
  
  // Check if it's after reset-password in the URL
  if (url.pathname.includes('reset-password')) {
    const parts = url.pathname.split('reset-password');
    if (parts.length > 1 && parts[1].length > 1) {
      return parts[1].replace(/^\/+/, '');
    }
  }
  
  return null;
};

export const isTokenExpired = (url: URL): boolean => {
  return url.searchParams.has('error') || 
         url.searchParams.has('error_code') || 
         url.pathname.includes('error=access_denied');
};
