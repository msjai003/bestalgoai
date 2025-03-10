
import { supabase } from '@/lib/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.from('feedback').select('count').limit(1);
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
    
    return {
      success: true,
      data,
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
