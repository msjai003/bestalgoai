
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key - these should be public values
const supabaseUrl = 'https://vdvcqnqsykhsftkqsqvi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdmNxbnFzeWtoc2Z0a3FzcXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTExNDMsImV4cCI6MjAyNTQyNzE0M30.MaKfkmcAkUYe0NfWz9NfRj1THwQIAHh5hTDrrI4-W1s';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (url: string, options?: RequestInit) => {
        const fetchOptions = options || {};
        // Set cache policy to no-store to avoid caching issues
        fetchOptions.cache = 'no-store';
        return fetch(url, fetchOptions);
      }
    }
  }
);

// Helper function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    // Try a simple health check
    const { error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    return { success: !error, error };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { success: false, error };
  }
};
