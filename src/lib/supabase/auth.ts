
import { supabase } from './client';

// Test a direct sign-up with extra data
export const directSignUp = async (email: string, password: string, userData: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error during direct signup:', error);
    return { data: null, error };
  }
};

// For handling offline registration attempts
export const offlineSignup = async (email: string, password: string, userData: any) => {
  try {
    // In a real app, we would store this in IndexedDB or another offline storage
    const offlineData = {
      email,
      userData,
      timestamp: new Date().toISOString()
    };
    
    // For now, just store in localStorage
    const existingData = localStorage.getItem('offlineRegistrations');
    const offlineRegistrations = existingData ? JSON.parse(existingData) : [];
    offlineRegistrations.push(offlineData);
    
    localStorage.setItem('offlineRegistrations', JSON.stringify(offlineRegistrations));
    
    return { 
      success: true, 
      message: "Registration saved for when you're back online"
    };
  } catch (error) {
    console.error('Error during offline signup:', error);
    return { 
      success: false, 
      error: new Error("Could not save registration data offline")
    };
  }
};

// Test fetching user profiles
export const testFetchUserProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count');

    if (error) {
      console.error("Error fetching user profiles:", error);
      return { success: false, error };
    }
    
    console.log("Successfully fetched user profiles count:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception during test:", error);
    return { success: false, error };
  }
};
