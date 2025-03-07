
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key - these should be public values
const supabaseUrl = 'https://fzvrozrjtvflksumiqsk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI';

// Test if the URL is reachable without Supabase
export const testDirectConnection = async () => {
  try {
    // Use a simple fetch to test direct URL access
    const response = await fetch(`${supabaseUrl}/auth/v1/`, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    });
    
    return { 
      success: response.ok, 
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Direct connection test error:', error);
    return { 
      success: false, 
      error,
      isFetchError: true
    };
  }
};

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
    
    // First check if we're online at all
    if (!navigator.onLine) {
      return {
        success: false,
        error: new Error("You appear to be offline. Please check your internet connection."),
        isNetworkIssue: true
      };
    }
    
    // Test direct access to the Supabase URL first
    const directTest = await testDirectConnection();
    if (!directTest.success) {
      console.log("Direct connection to Supabase URL failed:", directTest);
      return {
        success: false,
        error: new Error("Cannot reach Supabase URL directly. This may indicate network restrictions."),
        directTest,
        isNetworkIssue: true,
        isCorsOrCookieIssue: true,
        browserInfo: detectBrowserInfo()
      };
    }
    
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
          browserInfo: detectBrowserInfo(),
          networkDetails: {
            onLine: navigator.onLine,
            userAgent: navigator.userAgent,
            cookiesEnabled: navigator.cookieEnabled
          }
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
       error.message?.includes('Failed to fetch') ||
       error.message?.includes('NetworkError'));
       
    return { 
      success: false, 
      error,
      isCorsOrCookieIssue: isFetchError,
      isNetworkIssue: isFetchError,
      browserInfo: detectBrowserInfo(),
      networkDetails: {
        onLine: navigator.onLine,
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled
      }
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
    userAgent: userAgent,
    cookiesEnabled: navigator.cookieEnabled
  };
}

// Direct signup function to bypass connection test if needed
export const directSignUp = async (email, password, userData) => {
  try {
    console.log("Attempting direct signup with:", { email, userData });
    
    // Check network connectivity first
    if (!navigator.onLine) {
      return { 
        data: null, 
        error: new Error("You appear to be offline. Please check your internet connection.") 
      };
    }
    
    // Try with simple auth signUp method
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
    title: "Connection Issues",
    steps: [
      "Check your internet connection and make sure you're online",
      "Try reloading the page",
      "If using Firefox: Click the shield icon in the address bar and turn off 'Enhanced Tracking Protection'",
      "If using Chrome/Edge: Try disabling any extensions that might block requests",
      "If using Safari: Go to Preferences > Privacy and uncheck 'Prevent Cross-Site Tracking'",
      "Try using a different browser like Chrome or Edge",
      "Make sure cookies are enabled in your browser settings",
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
