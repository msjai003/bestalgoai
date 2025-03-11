
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
      console.error('Connection test error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  } catch (error: any) {
    console.error('Connection test exception:', error);
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
      console.error(`Table access error (${tableName}):`, error);
      return {
        success: false,
        message: error.message
      };
    }
  }
  catch (error: any) {
    console.error(`Table access exception (${tableName}):`, error);
    return {
      success: false,
      message: error?.message || `Failed to connect to ${tableName} table`
    };
  }
};

// Function to store signup data
export const storeSignupData = async (email: string, password: string, confirmPassword: string) => {
  try {
    console.log('Attempting to store signup data for:', email);
    
    if (!email || !password || !confirmPassword) {
      return { 
        success: false, 
        message: 'Missing required fields for signup' 
      };
    }
    
    // Check if the record already exists to avoid duplicates
    const { data: existingData, error: checkError } = await supabase
      .from('signup')
      .select('*')
      .eq('email', email)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing signup:', checkError);
      return { 
        success: false, 
        message: checkError.message || 'Failed to check existing signup information' 
      };
    }
    
    // If the email already exists, return an error
    if (existingData && existingData.length > 0) {
      console.log('Email already exists in signup table');
      return { 
        success: true, 
        message: 'Email already registered' 
      };
    }
    
    // Simpler insert approach with explicit data
    const { error } = await supabase
      .from('signup')
      .insert({
        email: email,
        password: password,
        confirm_password: confirmPassword
      });
    
    if (error) {
      console.error('Error storing signup data:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to store signup information' 
      };
    }
    
    console.log('Signup data stored successfully');
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
