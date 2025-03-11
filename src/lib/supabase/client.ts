
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key - these should be public values
export const supabaseUrl = 'https://ohryyssrykyrmkdttaet.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocnl5c3NyeWt5cm1rZHR0YWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTIyMDgsImV4cCI6MjA1NzE2ODIwOH0.gQrW_Ki_YnnOeKOmMpJ1MQe8fkOMQ-oEbdzNKoRDDH0';

// Get the current site URL for redirects
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

// Create a simplified fetch handler that adds CORS headers and better error handling
const customFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      'X-Client-Info': 'supabase-js-web/2.49.1',
      'Access-Control-Allow-Origin': '*' // Add CORS header
    },
    mode: 'cors', // Explicitly set CORS mode
  }).catch(error => {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  });
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: customFetch
    }
  }
);

// Create a fallback client with less restrictive settings
export const createFallbackClient = () => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'implicit'
      },
      global: {
        fetch: customFetch
      }
    });
  } catch (error) {
    console.error("Failed to create fallback client:", error);
    return null;
  }
};

// Log the current site URL on load for debugging
if (typeof window !== 'undefined') {
  console.log('Current site URL for redirects:', getSiteUrl());
  console.log('Browser: ', navigator.userAgent || 'Unknown');
  console.log('Online status: ', navigator.onLine ? 'Online' : 'Offline');
}
