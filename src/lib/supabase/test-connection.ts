
import { supabase } from "./client";

export const testSupabaseConnection = async () => {
  try {
    // Test connection to the signup table
    const { data, error } = await supabase.from('signup').select('count').limit(1);
    
    // If we can connect successfully
    if (!error) {
      return {
        success: true,
        message: "Connected to Supabase successfully"
      };
    } else {
      return {
        success: false,
        message: error.message
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to connect to database"
    };
  }
};

// Add a specific function to test and insert into the signup table
export const testTableAccess = async (tableName: string) => {
  try {
    // Test connection to the specified table
    const { data, error } = await supabase.from(tableName).select('count').limit(1);
    
    if (!error) {
      return {
        success: true,
        message: `Connected to ${tableName} table successfully`
      };
    } else {
      return {
        success: false,
        message: error.message
      };
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: error?.message || `Failed to connect to ${tableName} table`
    };
  }
};

// Function to store signup data
export const storeSignupData = async (email: string, password: string, confirmPassword: string) => {
  try {
    const { data, error } = await supabase
      .from('signup')
      .insert([{ 
        email, 
        password,
        confirm_password: confirmPassword 
      }]);
    
    if (error) {
      console.error('Error storing signup data:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to store signup information' 
      };
    }
    
    return { 
      success: true, 
      message: 'Signup data stored successfully' 
    };
  } catch (error: any) {
    console.error('Exception storing signup data:', error);
    return { 
      success: false, 
      message: error?.message || 'Network error while storing signup data' 
    };
  }
};
