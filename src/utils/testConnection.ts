
import { supabase } from '@/lib/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    const startTime = Date.now();
    
    // Try to access the users table for a more complete connection test
    const { data, error } = supabase.from('users').select('count');
    const endTime = Date.now();
    
    if (error) {
      console.error("Connection test error:", error);
      return {
        success: false,
        message: error.message,
        details: error,
        latency: endTime - startTime
      };
    }
    
    // Try to access the auth system as well
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error("Auth connection test error:", authError);
      return {
        success: false,
        message: authError.message,
        details: authError,
        latency: endTime - startTime
      };
    }
    
    return {
      success: true,
      data,
      authData,
      latency: endTime - startTime
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
    const { data, error } = supabase.from(tableName).select('count');
    
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
