
import { supabase } from './client';

export async function testTableAccess() {
  try {
    // Use a safer approach with RPC call instead of direct table access
    const { data, error } = await supabase
      .rpc('get_all_tables');
    
    if (error) {
      console.error('Error accessing Supabase tables:', error);
      return {
        success: false,
        message: `Database access error: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Supabase',
      data
    };
  } catch (error) {
    console.error('Exception during Supabase table access:', error);
    return {
      success: false,
      message: `Failed to connect to database: ${(error as Error).message}`,
      error
    };
  }
}
