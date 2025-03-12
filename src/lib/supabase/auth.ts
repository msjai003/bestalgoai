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
      password,
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
      .select();

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
      
      // Try multiple approaches to register the user, handling browser restrictions
      try {
        // Attempt to register this user with the standard client
        const { data, error } = await directSignUp(email, password || 'temporaryPassword123', userData);
        
        if (error) {
          // If we have a connection error but are online, try alternative approach
          if (error.message?.includes('fetch') || error.message?.includes('network')) {
            console.log("Trying alternative registration approach for", email);
            
            // Try a more direct API approach (this would need server-side support)
            results.push({
              email,
              success: false,
              error: error.message,
              needsManualProcessing: true,
              userData
            });
          } else if (error.message?.includes('already registered')) {
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
      } catch (registrationError) {
        console.error(`Error processing registration for ${email}:`, registrationError);
        results.push({
          email,
          success: false,
          error: registrationError.message || "Unknown error during registration",
          needsManualProcessing: true
        });
      }
    }
    
    // We'll save any that failed for manual processing later
    const failedRegistrations = results.filter(r => r.needsManualProcessing);
    if (failedRegistrations.length > 0) {
      localStorage.setItem('failedRegistrations', JSON.stringify(failedRegistrations));
      console.log(`${failedRegistrations.length} registrations need manual processing`);
    }
    
    // Clear processed registrations
    localStorage.removeItem('offlineRegistrations');
    
    return { 
      success: true, 
      message: `Processed ${results.length} offline registrations`,
      results,
      pendingCount: failedRegistrations.length
    };
  } catch (error) {
    console.error('Error syncing offline registrations:', error);
    return { 
      success: false, 
      error: new Error("Failed to sync offline registrations")
    };
  }
};

// Special function for use when normal Supabase connections are totally blocked
export const checkRegistrationStatus = async (email: string) => {
  try {
    // This is a fallback approach used when the browser is blocking Supabase connections
    // It would require server-side support to implement properly
    const checkUrl = `${window.location.origin}/api/check-registration?email=${encodeURIComponent(email)}`;
    
    try {
      const response = await fetch(checkUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, exists: data.exists };
      }
      
      return { success: false, message: "Unable to check registration status" };
    } catch (fetchError) {
      console.error("Error checking registration:", fetchError);
      return { 
        success: false, 
        error: new Error("Network error when checking registration")
      };
    }
  } catch (error) {
    console.error("Exception in checkRegistrationStatus:", error);
    return { success: false, error };
  }
};
