// This file now provides mock functionality instead of connecting to Supabase

// Mock client with dummy methods
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } },
        error: null
      })
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
          limit: () => ({ data: [], error: null })
        }),
        limit: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null })
      }),
      insert: async () => ({ data: null, error: null })
    })
  };
};

// Mock values that were previously used to connect to Supabase
export const supabaseUrl = 'mock-url';
export const supabaseAnonKey = 'mock-key';

// Get the current site URL for redirects (keeping this functionality)
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

// Create a mock supabase client
export const supabase = createMockClient();

// Mock fallback client function
export const createFallbackClient = () => {
  console.log('Creating mock fallback client');
  return createMockClient();
};

// Log information for debugging purposes
if (typeof window !== 'undefined') {
  console.log('Database connection removed - using mock client');
  console.log('Current site URL for redirects:', getSiteUrl());
  console.log('Browser: ', navigator.userAgent || 'Unknown');
  console.log('Online status: ', navigator.onLine ? 'Online' : 'Offline');
}
