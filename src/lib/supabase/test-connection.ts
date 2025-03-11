
import { supabase } from './client';

// Function for testing connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('signup').select('id').limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return {
        success: false,
        message: `Failed to connect to database: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: "Database connection successful"
    };
  } catch (error: any) {
    console.error('Exception testing connection:', error);
    return {
      success: false,
      message: error?.message || 'Unknown error testing database connection',
      details: error?.toString()
    };
  }
};

// Function for testing table access
export const testTableAccess = async (tableName: string) => {
  try {
    const { data, error } = await supabase.from(tableName).select('id').limit(1);
    
    if (error) {
      console.error(`Table access error for ${tableName}:`, error);
      return {
        success: false,
        message: `Failed to access ${tableName} table: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: `${tableName} table access successful`
    };
  } catch (error: any) {
    console.error(`Exception testing ${tableName} table access:`, error);
    return {
      success: false,
      message: error?.message || `Unknown error testing ${tableName} table access`,
      details: error?.toString()
    };
  }
};

// Function for storing signup data
export const storeSignupData = async (email: string, password: string, confirmPassword: string) => {
  try {
    console.log('Storing signup data for:', email);
    
    if (!email || !password || !confirmPassword) {
      return { 
        success: false, 
        message: 'Missing required fields for signup' 
      };
    }
    
    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match'
      };
    }
    
    // Store the signup data in the database
    const { data, error } = await supabase
      .from('signup')
      .insert([
        { 
          email: email,
          password_hash: password // In a real app, you would hash this password
        }
      ]);
    
    if (error) {
      console.error('Error storing signup data:', error);
      return { 
        success: false, 
        message: `Failed to store signup data: ${error.message}`,
        details: error
      };
    }
    
    console.log('Signup data stored successfully');
    return { 
      success: true, 
      message: 'Signup data stored successfully' 
    };
  } catch (error: any) {
    console.error('Exception in signup process:', error);
    return { 
      success: false, 
      message: error?.message || 'Error in signup process',
      details: error?.toString()
    };
  }
};
