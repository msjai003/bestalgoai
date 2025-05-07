
import { supabase } from './client';
import { ExecuteSqlParams } from '@/types/broker';

export async function testTableAccess() {
  try {
    // Use RPC for direct SQL execution
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

// Add a function to test storage bucket access and availability
export async function testStorageAccess() {
  try {
    // Test both buckets to ensure they exist and are accessible
    const appFilesResult = await supabase.storage.from(STORAGE_BUCKETS.APP_FILES).list();
    const exeFilesResult = await supabase.storage.from(STORAGE_BUCKETS.EXE_FILES).list();
    
    if (appFilesResult.error || exeFilesResult.error) {
      console.error('Error accessing Supabase storage:', appFilesResult.error || exeFilesResult.error);
      return {
        success: false,
        message: `Storage access error: ${(appFilesResult.error || exeFilesResult.error)?.message}`,
        error: appFilesResult.error || exeFilesResult.error
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Supabase Storage',
      data: {
        appFiles: appFilesResult.data?.length || 0,
        exeFiles: exeFilesResult.data?.length || 0
      }
    };
  } catch (error) {
    console.error('Exception during Supabase storage access:', error);
    return {
      success: false,
      message: `Failed to connect to storage: ${(error as Error).message}`,
      error
    };
  }
}

// Define storage bucket constants centrally
export const STORAGE_BUCKETS = {
  APP_FILES: 'app-files',
  EXE_FILES: 'app-exe-files'
};
