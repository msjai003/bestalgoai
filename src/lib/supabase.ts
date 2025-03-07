
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key - these should be public values
const supabaseUrl = 'https://fzvrozrjtvflksumiqsk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI';

// Get the current site URL for redirects
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    // Check if running on localhost, common development patterns
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    // Otherwise use the current origin
    return window.location.origin;
  }
  // Fallback for SSR or non-browser environments
  return 'http://localhost:3000';
};

// Test if the URL is reachable without Supabase
export const testDirectConnection = async () => {
  try {
    // First try to check internet connectivity in general
    const onlineStatus = navigator.onLine;
    if (!onlineStatus) {
      return { 
        success: false, 
        status: 'offline',
        statusText: 'No internet connection',
        isOffline: true 
      };
    }
    
    // Try connecting to a reliable service as a fallback test
    try {
      const googleResponse = await fetch('https://www.google.com', { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store'
      });
      console.log('Google connectivity test:', googleResponse.type);
    } catch (e) {
      console.log('Unable to reach Google either, might be a network issue');
    }
    
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
      detectSessionInUrl: true,
      storageKey: 'session',
      flowType: 'pkce',
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
        isNetworkIssue: true,
        isOffline: true
      };
    }
    
    // Test direct access to the Supabase URL first
    const directTest = await testDirectConnection();
    if (!directTest.success) {
      console.log("Direct connection to Supabase URL failed:", directTest);
      
      // Try a different domain to test general internet connectivity
      try {
        const fallbackTest = await fetch('https://www.cloudflare.com', { 
          method: 'HEAD', 
          mode: 'no-cors',
          cache: 'no-store'
        });
        console.log('Fallback connectivity test:', fallbackTest.type);
        
        // If we can reach cloudflare but not Supabase, it might be a CORS/firewall issue
        return {
          success: false,
          error: new Error("Cannot reach Supabase, but other websites work. This suggests a CORS or network restriction specific to Supabase."),
          directTest,
          isNetworkIssue: false,
          isCorsOrCookieIssue: true,
          isSpecificDomainBlocked: true,
          browserInfo: detectBrowserInfo()
        };
      } catch (e) {
        // If we can't reach cloudflare either, it's likely a general network issue
        console.log('Fallback test also failed:', e);
      }
      
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

// Check if there's cached session data even if Supabase is unreachable
export const getCachedSession = () => {
  try {
    // Try to get the session from localStorage
    const sessionStr = localStorage.getItem('sb-' + supabaseUrl.replace('https://', '') + '-auth-token');
    if (!sessionStr) return null;
    
    const session = JSON.parse(sessionStr);
    if (!session) return null;
    
    // Check if the session hasn't expired
    const expiresAt = session.expires_at || 0;
    const now = Math.floor(Date.now() / 1000);
    
    if (expiresAt < now) {
      console.log('Cached session has expired');
      return null;
    }
    
    return {
      user: session.user,
      session: session
    };
  } catch (error) {
    console.error('Error getting cached session:', error);
    return null;
  }
};

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
        // This is the correct way to set the redirect URL
        emailRedirectTo: getSiteUrl() + '/auth'
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

// Function to attempt synchronization of offline data when online
export const syncOfflineData = async () => {
  if (!navigator.onLine) {
    return { success: false, message: "Still offline" };
  }
  
  // Check for pending signups
  const pendingSignupStr = localStorage.getItem('pendingSignup');
  if (pendingSignupStr) {
    try {
      const signupData = JSON.parse(pendingSignupStr);
      
      // Only attempt if it's been less than 3 days
      const ageHours = (Date.now() - signupData.timestamp) / (1000 * 60 * 60);
      if (ageHours < 72) {
        const { data, error } = await directSignUp(
          signupData.email,
          atob(signupData.password),
          signupData.userData
        );
        
        if (!error) {
          // Success, remove from pending
          localStorage.removeItem('pendingSignup');
          return { success: true, message: "Synchronized pending signup" };
        }
      } else {
        // Too old, discard
        localStorage.removeItem('pendingSignup');
      }
    } catch (e) {
      console.error("Error processing pending signup:", e);
    }
  }
  
  return { success: false, message: "No pending data to sync" };
};

// Add new function to handle authentication state
export const getCurrentUser = async () => {
  try {
    // First check if we're offline and have a cached session
    if (!navigator.onLine) {
      const cachedSession = getCachedSession();
      if (cachedSession) {
        return cachedSession.user;
      }
      return null;
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error fetching session:', error);
      
      // Fall back to cached session if API call fails
      const cachedSession = getCachedSession();
      if (cachedSession) {
        return cachedSession.user;
      }
      return null;
    }
    
    if (!session) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    
    // Fall back to cached session on exception
    const cachedSession = getCachedSession();
    if (cachedSession) {
      return cachedSession.user;
    }
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
    
    // If offline, try to get from localStorage
    if (!navigator.onLine) {
      const profileStr = localStorage.getItem('userProfile_' + user.id);
      if (profileStr) {
        return JSON.parse(profileStr);
      }
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    // Cache the profile for offline use
    localStorage.setItem('userProfile_' + user.id, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Exception fetching profile:', error);
    return null;
  }
};

// Add an offline authentication attempt function
export const offlineLogin = (email, password) => {
  try {
    // Check if we have a cached session
    const cachedSession = getCachedSession();
    if (cachedSession && cachedSession.user.email === email) {
      // We found a matching cached session
      return { 
        success: true, 
        message: "Logged in from cached session", 
        user: cachedSession.user 
      };
    }
    
    // No matching cached session
    return { 
      success: false, 
      message: "Cannot verify credentials while offline" 
    };
  } catch (error) {
    console.error('Exception during offline login:', error);
    return { 
      success: false, 
      error, 
      message: "Error during offline login attempt" 
    };
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

// Log the current site URL on load for debugging
if (typeof window !== 'undefined') {
  console.log('Current site URL for redirects:', getSiteUrl());
}
