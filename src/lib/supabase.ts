
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://your-project-url.supabase.co',  // Replace with your actual Supabase URL
  'your-anon-key'  // Replace with your actual anon/public key
);
