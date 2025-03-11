
import { supabase } from './client';

export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Create a promise with timeout to avoid hanging requests
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout - server may be unavailable')), 10000);
    });
    
    // Simple ping test to check general connectivity
    const connectionPromise = supabase.from('feedback').select('count').limit(1);
    
    // Race the connection attempt against the timeout
    const { data, error } = await Promise.race([connectionPromise, timeout])
      .then(result => result)
      .catch(err => ({ data: null, error: err }));
    
    if (error) {
      console.error("Connection test error:", error);
      return {
        success: false,
        message: error.message || "Failed to connect to database",
        details: error
      };
    }
    
    // Try to access the auth system as well
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error("Auth connection test error:", authError);
      return {
        success: false,
        message: authError.message,
        details: authError
      };
    }
    
    return {
      success: true,
      data,
      authData
    };
  } catch (error: any) {
    console.error("Exception during connection test:", error);
    return {
      success: false,
      message: error.message || "Connection failed",
      error
    };
  }
};

// Test if specific tables exist and are accessible
export const testTableAccess = async (tableName: string) => {
  try {
    console.log(`Testing access to ${tableName} table...`);
    
    // Use more resilient fetch method with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const { data, error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    clearTimeout(timeoutId);
    
    if (error) {
      console.error(`Error accessing ${tableName} table:`, error);
      return {
        success: false,
        tableName,
        message: error.message,
        details: error
      };
    }
    
    return {
      success: true,
      tableName,
      data
    };
  } catch (error: any) {
    console.error(`Exception testing ${tableName} table access:`, error);
    return {
      success: false,
      tableName,
      message: error.message || `Failed to access ${tableName} table`,
      error
    };
  }
};
