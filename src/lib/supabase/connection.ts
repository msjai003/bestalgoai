
import { supabase } from './client';

export async function testTableAccess() {
  try {
    const { data, error } = supabase.from('signup').select('*');
    
    if (error) {
      console.error('Error accessing Supabase table:', error);
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
