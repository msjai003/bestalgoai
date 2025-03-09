
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

// Check if using Chrome browser - safely check userAgent
const isChromeBrowser = () => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1;
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
        
        // Essential fetch options that help with CORS
        fetchOptions.cache = 'no-store';
        fetchOptions.credentials = 'include';
        fetchOptions.mode = 'cors';
        
        // Add extra headers that might help with CORS issues
        if (fetchOptions.headers) {
          const headers = fetchOptions.headers as Record<string, string>;
          
          // Only add these headers in browser environment
          if (typeof window !== 'undefined') {
            headers['Origin'] = window.location.origin;
            headers['Referer'] = window.location.origin;
          }
        }
        
        // Chrome-specific workarounds for CORS and cookie issues
        if (isChromeBrowser()) {
          // Add SameSite attribute to cookies for Chrome compatibility
          if (typeof document !== 'undefined') {
            document.cookie = "SameSite=None; Secure";
            document.cookie = "Path=/; SameSite=None; Secure";
          }
          
          // For Chrome auth endpoints, add special handling
          if (url.includes('auth/v1')) {
            console.log("Using special Chrome auth configuration for:", url);
          }
        }
        
        console.log(`Fetch request to: ${url}`);
        
        return fetch(url, fetchOptions)
          .catch(error => {
            console.error(`Fetch error for ${url}:`, error);
            
            // Special handling for Chrome fetch errors
            if (isChromeBrowser() && error.message?.includes('Failed to fetch')) {
              console.log("Chrome-specific fetch error detected. This might be due to cookie or CORS settings.");
            }
            
            throw error;
          });
      }
    }
  }
);

// Create a fallback client with less restrictive settings
export const createFallbackClient = () => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'implicit'
      },
      global: {
        headers: {
          'X-Client-Info': 'fallback-client/1.0.0',
        }
      }
    });
  } catch (error) {
    console.error("Failed to create fallback client:", error);
    return null;
  }
};

// Log the current site URL on load for debugging
if (typeof window !== 'undefined') {
  console.log('Current site URL for redirects:', getSiteUrl());
  console.log('Browser: ', navigator.userAgent || 'Unknown');
  console.log('Online status: ', navigator.onLine ? 'Online' : 'Offline');
  console.log('Cookies enabled: ', navigator.cookieEnabled ? 'Yes' : 'No');
  
  // Log Chrome-specific information
  if (isChromeBrowser()) {
    console.log('Chrome detected: Adding special handling for Chrome browser');
  }
}
