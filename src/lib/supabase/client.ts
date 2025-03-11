
import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
export const supabaseUrl = 'https://fzvrozrjtvflksumiqsk.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI';

// Get the current site URL for redirects
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a fallback client function
export const createFallbackClient = () => {
  console.log('Creating fallback client');
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Log information for debugging purposes
if (typeof window !== 'undefined') {
  console.log('Connected to Supabase database');
  console.log('Current site URL for redirects:', getSiteUrl());
  console.log('Browser: ', navigator.userAgent || 'Unknown');
  console.log('Online status: ', navigator.onLine ? 'Online' : 'Offline');
}
