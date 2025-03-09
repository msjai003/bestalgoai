
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key - these should be public values
export const supabaseUrl = 'https://fzvrozrjtvflksumiqsk.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI';

// Proxy configuration
export const proxyUrl = 'http://localhost:4000/proxy';
const PROXY_ENABLED_KEY = 'supabase-proxy-enabled';

// Check if proxy is enabled in localStorage
export const isProxyEnabled = () => {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(PROXY_ENABLED_KEY) === 'true';
};

// Enable/disable proxy
export const enableProxy = (enabled = true) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PROXY_ENABLED_KEY, enabled ? 'true' : 'false');
  // Reload the page to reinitialize the Supabase client
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

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

// Function to create a proxy fetch handler
const createProxyFetch = (url, options) => {
  // Modify the URL to use the proxy
  const proxyPath = url.replace(supabaseUrl, proxyUrl);
  console.log(`Using proxy for request: ${url} -> ${proxyPath}`);
  
  return fetch(proxyPath, options)
    .catch(error => {
      console.error(`Proxy fetch error for ${proxyPath}:`, error);
      throw error;
    });
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
      fetch: (url, options) => {
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
        
        // Use proxy if enabled and in browser environment
        if (isProxyEnabled() && typeof window !== 'undefined') {
          return createProxyFetch(url, fetchOptions);
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
              
              // If direct fetch fails and proxy is not enabled, try using the proxy
              if (!isProxyEnabled() && typeof window !== 'undefined') {
                console.log("Attempting to use proxy as fallback...");
                return createProxyFetch(url, fetchOptions);
              }
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
  console.log('Proxy enabled: ', isProxyEnabled() ? 'Yes' : 'No');
  
  // Log Chrome-specific information
  if (isChromeBrowser()) {
    console.log('Chrome detected: Adding special handling for Chrome browser');
  }
}
