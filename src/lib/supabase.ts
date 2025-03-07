
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key - these should be public values
const supabaseUrl = 'https://vdvcqnqsykhsftkqsqvi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdmNxbnFzeWtoc2Z0a3FzcXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTExNDMsImV4cCI6MjAyNTQyNzE0M30.MaKfkmcAkUYe0NfWz9NfRj1THwQIAHh5hTDrrI4-W1s';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true, // Try to persist session to handle page refreshes
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'session',
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web/2.49.1',
      },
      fetch: (url: string, options?: RequestInit) => {
        const fetchOptions = options || {};
        // Set cache policy to no-store to avoid caching issues
        fetchOptions.cache = 'no-store';
        // Ensure credentials are included
        fetchOptions.credentials = 'include';
        // Add CORS mode
        fetchOptions.mode = 'cors';
        return fetch(url, fetchOptions);
      }
    }
  }
);

// Helper function to test Supabase connection with specific guidance
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Simple ping-style query that should always work
    const { data, error } = await supabase.from('user_profiles').select('count');
    
    if (error) {
      console.error('Supabase connection test error (query):', error);
      
      // Check for specific CORS or cookie-related errors
      if (error.message?.includes('fetch') || error.code === 'PGRST301') {
        return { 
          success: false, 
          error, 
          isCorsOrCookieIssue: true,
          browserInfo: detectBrowserInfo()
        };
      }
      
      return { success: false, error };
    }
    
    console.log("Connection test successful:", data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    
    // Check if this is a fetch/network error
    const isFetchError = error instanceof Error && 
      (error.message?.includes('fetch') || 
       error.message?.includes('network') ||
       error.message?.includes('Failed to fetch'));
       
    return { 
      success: false, 
      error,
      isCorsOrCookieIssue: isFetchError,
      browserInfo: detectBrowserInfo()
    };
  }
};

// Function to get browser information for better error messages
function detectBrowserInfo() {
  const userAgent = navigator.userAgent;
  const isChrome = userAgent.indexOf("Chrome") > -1;
  const isFirefox = userAgent.indexOf("Firefox") > -1;
  const isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
  const isEdge = userAgent.indexOf("Edg") > -1;
  const isPrivateMode = !window.localStorage;

  let browserName = "unknown";
  if (isChrome) browserName = "Chrome";
  if (isFirefox) browserName = "Firefox";
  if (isSafari) browserName = "Safari";
  if (isEdge) browserName = "Edge";

  return {
    browser: browserName,
    isPrivateMode: isPrivateMode,
    userAgent: userAgent
  };
}

// Direct signup function to bypass connection test if needed
export const directSignUp = async (email, password, userData) => {
  try {
    console.log("Attempting direct signup with:", { email, userData });
    
    // Try raw fetch approach first if normal method fails
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: window.location.origin + '/auth'
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('Direct signup error:', error);
    return { data: null, error };
  }
};

// Function to handle local signup when Supabase connection fails
export const offlineSignup = async (email, password, userData) => {
  // Store signup data in localStorage to try again later
  try {
    const signupData = {
      email,
      password: btoa(password), // Simple encoding (not secure but temporary)
      userData,
      timestamp: Date.now()
    };
    
    localStorage.setItem('pendingSignup', JSON.stringify(signupData));
    return { success: true, message: "Signup data saved locally" };
  } catch (e) {
    console.error("Failed to save local signup data:", e);
    return { success: false, error: e };
  }
};
