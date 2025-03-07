
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
      persistSession: false, // Don't try to store the session in localStorage or cookies
      autoRefreshToken: true,
      detectSessionInUrl: false, // Don't look for the token in the URL
      storageKey: 'session', // Use a simple key name
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web/2.49.1',
      },
      fetch: (url, options) => {
        const fetchOptions = options || {};
        // Set cache policy to no-store to avoid caching issues
        fetchOptions.cache = 'no-store';
        // Ensure credentials are included
        fetchOptions.credentials = 'include';
        // Add CORS mode
        fetchOptions.mode = 'cors';
        return fetch(url, fetchOptions);
      }
    }
  }
);

// Helper function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    // Use a simpler, more direct approach
    const { data, error } = await supabase.from('user_profiles').select('count');
    
    if (error) {
      console.error('Supabase connection test error (query):', error);
      
      // Check for specific CORS or cookie-related errors
      if (error.message?.includes('fetch') || error.code === 'PGRST301') {
        return { 
          success: false, 
          error, 
          isCorsOrCookieIssue: true 
        };
      }
      
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test error (exception):', error);
    
    // Check if this is a fetch/network error
    const isFetchError = error instanceof Error && 
      (error.message?.includes('fetch') || 
       error.message?.includes('network') ||
       error.message?.includes('Failed to fetch'));
       
    return { 
      success: false, 
      error,
      isCorsOrCookieIssue: isFetchError
    };
  }
};

// Direct signup function to bypass connection test if needed
export const directSignUp = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('Direct signup error:', error);
    return { data: null, error };
  }
};
