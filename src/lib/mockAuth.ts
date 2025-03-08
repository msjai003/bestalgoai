
// Mock authentication service to replace Supabase
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  mobile: string | null;
  trading_experience: string | null;
  is_research_analyst: boolean;
  certification_number: string | null;
}

// Store the user in localStorage
const LOCAL_STORAGE_USER_KEY = 'mock_auth_user';
const LOCAL_STORAGE_PROFILE_KEY = 'mock_auth_profile';

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const getUserProfile = (): UserProfile | null => {
  const profileJson = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
  if (!profileJson) return null;
  
  try {
    return JSON.parse(profileJson);
  } catch (error) {
    console.error('Error parsing profile from localStorage:', error);
    return null;
  }
};

// Mock login function
export const directLogin = async (email: string, password: string) => {
  console.log('Mock login attempt:', email, password);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Always allow login for testing
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    full_name: email.split('@')[0] || null,
  };
  
  // Create mock profile
  const profile: UserProfile = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    mobile: null,
    trading_experience: 'beginner',
    is_research_analyst: false,
    certification_number: null,
  };
  
  // Store in localStorage
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  
  console.log('Mock login successful:', user);
  
  return { data: { user }, error: null };
};

// Mock signup function
export const directSignUp = async (email: string, password: string, userData: any) => {
  console.log('Mock signup attempt:', email, userData);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create user
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    full_name: userData.full_name || null,
  };
  
  // Create mock profile
  const profile: UserProfile = {
    id: user.id,
    full_name: userData.full_name || null,
    email: user.email,
    mobile: userData.mobile || null,
    trading_experience: userData.trading_experience || 'beginner',
    is_research_analyst: userData.is_research_analyst || false,
    certification_number: userData.certification_number || null,
  };
  
  // Store in localStorage
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  
  console.log('Mock signup successful:', user);
  
  return { data: { user }, error: null };
};

// Mock sign out function
export const signOut = async () => {
  console.log('Mock sign out');
  
  // Clear localStorage
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
  
  return { success: true };
};

// Helper to check connection
export const testConnection = async () => {
  console.log('Testing connection...');
  
  // Simple connectivity check
  try {
    const online = navigator.onLine;
    if (!online) {
      return { 
        success: false, 
        message: 'You are offline',
        isOffline: true 
      };
    }
    
    // Try connecting to a reliable service
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store'
      });
      
      return { 
        success: true, 
        message: 'Connection test successful'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to connect to external services',
        error
      };
    }
  } catch (error) {
    console.error('Connection test error:', error);
    return { 
      success: false, 
      error
    };
  }
};

// Helper for browser information
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const isChrome = userAgent.indexOf("Chrome") > -1;
  const isFirefox = userAgent.indexOf("Firefox") > -1;
  const isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
  const isEdge = userAgent.indexOf("Edg") > -1;
  
  let browserName = "unknown";
  if (isChrome) browserName = "Chrome";
  if (isFirefox) browserName = "Firefox";
  if (isSafari) browserName = "Safari";
  if (isEdge) browserName = "Edge";
  
  return {
    browser: browserName,
    cookiesEnabled: navigator.cookieEnabled,
    userAgent: userAgent,
    onlineStatus: navigator.onLine
  };
};
