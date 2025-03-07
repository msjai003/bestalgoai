
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://vdvcqnqsykhsftkqsqvi.supabase.co',  // Your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdmNxbnFzeWtoc2Z0a3FzcXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTExNDMsImV4cCI6MjAyNTQyNzE0M30.MaKfkmcAkUYe0NfWz9NfRj1THwQIAHh5hTDrrI4-W1s',  // Your anon key
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    // Add additional client options if needed
    global: {
      fetch: (url: string, options?: RequestInit) => fetch(url, options)
    }
  }
);
