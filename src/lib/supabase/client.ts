
// Mock client that doesn't connect to Supabase
export const supabaseUrl = 'https://ohryyssrykyrmkdttaet.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocnl5c3NyeWt5cm1rZHR0YWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTIyMDgsImV4cCI6MjA1NzE2ODIwOH0.gQrW_Ki_YnnOeKOmMpJ1MQe8fkOMQ-oEbdzNKoRDDH0';

// Get the current site URL for redirects
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

// Create Supabase client
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a fallback client function
export const createFallbackClient = () => {
  console.log('Creating client for Supabase project: ohryyssrykyrmkdttaet');
  return supabase;
};
