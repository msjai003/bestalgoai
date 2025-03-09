import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key - these should be public values
export const supabaseUrl = 'https://fzvrozrjtvflksumiqsk.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI';

// Get the current site URL for redirects - more explicit for localhost
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    // Support HTTPS for localhost development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'https://localhost:3000';
    }
    // Otherwise use the current origin
    return window.location.origin;
  }
  // Fallback for SSR or non-browser environments
  return 'https://localhost:3000';
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, 
      storageKey: 'session',
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web/2.49.1',
      },
      fetch: (url: string, options?: RequestInit) => {
        const fetchOptions = options || {};
        fetchOptions.cache = 'no-store';
        fetchOptions.credentials = 'include';
        fetchOptions.mode = 'cors';
        
        // Add extra headers that might help with CORS issues
        if (fetchOptions.headers) {
          (fetchOptions.headers as Record<string, string>)['Origin'] = 'http://localhost:3000';
          (fetchOptions.headers as Record<string, string>)['Referer'] = 'http://localhost:3000';
        }
        
        // Add SameSite attribute to cookies for compatibility
        if (typeof document !== 'undefined') {
          document.cookie = "SameSite=None; Secure";
          document.cookie = "Path=/; SameSite=None; Secure";
        }
        
        console.log(`Fetch request to: ${url}`);
        
        return fetch(url, fetchOptions)
          .catch(error => {
            console.error(`Fetch error for ${url}:`, error);
            throw error;
          });
      }
    }
  }
);

// Log the current site URL on load for debugging
if (typeof window !== 'undefined') {
  console.log('Current site URL for redirects:', getSiteUrl());
  console.log('Browser: ', navigator.userAgent);
  console.log('Online status: ', navigator.onLine ? 'Online' : 'Offline');
  console.log('Cookies enabled: ', navigator.cookieEnabled ? 'Yes' : 'No');
}
