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
      persistSession: true,
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
        fetchOptions.cache = 'no-store';
        fetchOptions.credentials = 'include';
        fetchOptions.mode = 'cors';
        // Add SameSite attribute to cookies for Firefox compatibility
        if (typeof document !== 'undefined') {
          document.cookie = "SameSite=None; Secure";
        }
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

// Add new function to handle authentication state
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }
    
    if (!session) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Add function to sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Exception during sign out:', error);
    return { success: false, error };
  }
};

// Add function to get user profile
export const getUserProfile = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching profile:', error);
    return null;
  }
};

// Add a function to get browser-specific instructions for Firefox
export const getFirefoxInstructions = () => {
  return {
    title: "Browser Privacy Settings",
    steps: [
      "Try using a different browser like Chrome or Edge",
      "If using Firefox: Click the shield icon in the address bar and turn off 'Enhanced Tracking Protection'",
      "If using Safari: Go to Preferences > Privacy and uncheck 'Prevent Cross-Site Tracking'",
      "Make sure cookies are enabled in your browser settings",
      "Try disabling any ad-blockers or privacy extensions temporarily",
      "If possible, try using a non-private/non-incognito window"
    ]
  };
};

// Add a function to check for common Firefox issues
export const checkFirefoxCompatibility = () => {
  const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
  const isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1;
  
  // Check if cookies are enabled
  const cookiesEnabled = navigator.cookieEnabled;
  
  // Check if in private browsing (approximate detection)
  let isPrivate = false;
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
  } catch (e) {
    isPrivate = true;
  }
  
  return {
    isFirefox,
    isSafari,
    cookiesEnabled,
    isPrivate,
    hasETP: isFirefox // Assume ETP is on by default in Firefox
  };
};
