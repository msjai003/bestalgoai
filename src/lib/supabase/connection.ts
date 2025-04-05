
import { supabase } from './client';

export async function testTableAccess() {
  try {
    const { data: queryResult, error } = await supabase.rpc('execute_sql', {
      query: 'SELECT * FROM signup LIMIT 5'
    });
    
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
      data: queryResult
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
