
import { supabase } from '@/lib/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    const startTime = Date.now();
    
    // Use get_all_tables function which is supported
    const { data, error } = await supabase.rpc('get_all_tables');
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
    
    // Use execute_sql instead of check_table_access
    const { data, error } = await supabase.rpc('execute_sql', { 
      query: `
        WITH table_check AS (
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = '${tableName}'
          ) as exists
        ),
        sample_data AS (
          SELECT * FROM public.${tableName} LIMIT 5
        )
        SELECT 
          json_build_object(
            'exists', (SELECT exists FROM table_check),
            'count', CASE 
              WHEN (SELECT exists FROM table_check) 
              THEN (SELECT COUNT(*) FROM public.${tableName})
              ELSE 0
            END,
            'sample', CASE 
              WHEN (SELECT exists FROM table_check) 
              THEN (SELECT COALESCE(jsonb_agg(s), '[]'::jsonb) FROM sample_data s)
              ELSE '[]'::jsonb
            END
          ) as result
      `
    });
    
    if (error) {
      console.error(`Error accessing ${tableName} table:`, error);
      return {
        success: false,
        tableName,
        message: error.message,
        details: error
      };
    }
    
    // Check if data is an array before accessing its length
    const result = Array.isArray(data) && data.length > 0 ? data[0].result : { exists: false };
    
    return {
      success: true,
      tableName,
      data: result
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
