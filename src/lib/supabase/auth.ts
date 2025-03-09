
import { supabase, supabaseUrl, getSiteUrl } from './client';

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

// Direct signup function with improved error handling
export const directSignUp = async (email: string, password: string, userData: any) => {
  try {
    console.log("Attempting direct signup with:", { email, userData });
    
    // Check network connectivity first
    if (!navigator.onLine) {
      return { 
        data: null, 
        error: new Error("You appear to be offline. Please check your internet connection.") 
      };
    }
    
    // Get the redirect URL from our helper function
    const redirectUrl = getSiteUrl() + '/auth';
    
    // Prepare the signUp options
    const signUpOptions = {
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: redirectUrl
      }
    };
    
    console.log("SignUp options:", JSON.stringify(signUpOptions, null, 2));
    
    // Try with manual fetch first if experiencing CORS issues
    try {
      // Only attempt if CORS is suspected
      if (localStorage.getItem('tryCORSBypass') === 'true') {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY || '',
            'X-Client-Info': 'supabase-js-web/2.49.1'
          },
          body: JSON.stringify(signUpOptions)
        });
        
        if (response.ok) {
          const data = await response.json();
          return { data, error: null };
        }
      }
    } catch (e) {
      console.log("Manual fetch attempt failed, falling back to Supabase client:", e);
    }
    
    // Try with simple auth signUp method
    const { data, error } = await supabase.auth.signUp(signUpOptions);
    
    // If successful, clear any CORS bypass flag
    if (!error) {
      localStorage.removeItem('tryCORSBypass');
    }
    
    return { data, error };
  } catch (error) {
    console.error('Direct signup error:', error);
    
    // If it seems like a CORS issue, set flag to try bypass next time
    if (error instanceof Error && (error.message?.includes('fetch') || error.message?.includes('network'))) {
      localStorage.setItem('tryCORSBypass', 'true');
    }
    
    return { data: null, error };
  }
};

// Function to handle login with improved error handling and fallbacks
export const directLogin = async (email: string, password: string) => {
  try {
    console.log("Attempting direct login with:", email);
    
    // Check if we're offline
    if (!navigator.onLine) {
      const offlineResult = offlineLogin(email, password);
      if (offlineResult.success) {
        return { data: offlineResult.user, error: null };
      }
      return { 
        data: null, 
        error: new Error("Cannot verify credentials while offline. Please try again when you're back online.") 
      };
    }
    
    // Try manual login first if experiencing CORS issues
    try {
      if (localStorage.getItem('tryCORSBypass') === 'true') {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY || '',
            'X-Client-Info': 'supabase-js-web/2.49.1'
          },
          body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
          const data = await response.json();
          return { data, error: null };
        }
      }
    } catch (e) {
      console.log("Manual login attempt failed, falling back to Supabase client:", e);
    }
    
    // Fall back to standard Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If successful, clear any CORS bypass flag
    if (!error) {
      localStorage.removeItem('tryCORSBypass');
    }
    
    return { data, error };
  } catch (error) {
    console.error('Direct login error:', error);
    
    // If it seems like a CORS issue, set flag to try bypass next time
    if (error instanceof Error && (error.message?.includes('fetch') || error.message?.includes('network'))) {
      localStorage.setItem('tryCORSBypass', 'true');
    }
    
    return { data: null, error };
  }
};

// Function to handle local signup when Supabase connection fails
export const offlineSignup = async (email: string, password: string, userData: any) => {
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
export const offlineLogin = (email: string, password: string) => {
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
