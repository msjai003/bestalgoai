
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
