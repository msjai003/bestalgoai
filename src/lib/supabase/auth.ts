
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

// Sync offline registrations to Supabase when back online
export const syncOfflineRegistrations = async () => {
  if (!navigator.onLine) {
    return { success: false, message: "Still offline, can't sync" };
  }
  
  try {
    const existingData = localStorage.getItem('offlineRegistrations');
    if (!existingData) {
      return { success: true, message: "No offline registrations to sync" };
    }
    
    const offlineRegistrations = JSON.parse(existingData);
    if (!offlineRegistrations.length) {
      return { success: true, message: "No offline registrations to sync" };
    }
    
    console.log(`Found ${offlineRegistrations.length} offline registrations to sync`);
    
    const results = [];
    
    // Process each registration
    for (const registration of offlineRegistrations) {
      const { email, userData, password } = registration;
      
      // Skip if missing critical data
      if (!email || !userData) {
        results.push({ 
          email, 
          success: false, 
          message: "Incomplete registration data" 
        });
        continue;
      }
      
      // Attempt to register this user
      const { data, error } = await directSignUp(email, password || 'temporaryPassword123', userData);
      
      if (error) {
        // Check if user already exists
        if (error.message?.includes('already registered')) {
          results.push({
            email,
            success: true,
            message: "User already registered",
          });
        } else {
          results.push({
            email,
            success: false,
            error: error.message,
          });
        }
      } else {
        results.push({
          email,
          success: true,
          message: "Successfully registered",
          userId: data?.user?.id,
        });
      }
    }
    
    // Clear processed registrations
    localStorage.removeItem('offlineRegistrations');
    
    return { 
      success: true, 
      message: `Processed ${results.length} offline registrations`,
      results 
    };
  } catch (error) {
    console.error('Error syncing offline registrations:', error);
    return { 
      success: false, 
      error: new Error("Failed to sync offline registrations")
    };
  }
};
