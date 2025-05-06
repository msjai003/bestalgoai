
import { supabase } from './client';
import { ExecuteSqlParams } from '@/types/broker';

export async function testTableAccess() {
  try {
    // Use from().select() instead of direct rpc for mock client compatibility
    const params: ExecuteSqlParams = { query: 'SELECT * FROM signup LIMIT 5' };
    const { data: queryResult, error } = await supabase.rpc('execute_sql', params);
    
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
