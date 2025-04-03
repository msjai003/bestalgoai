
// Mock Supabase client for frontend-only operation
export const supabaseUrl = 'mock-url';
export const supabaseAnonKey = 'mock-key';

// Create a mock client to maintain API compatibility
export const supabase = {
  auth: {
    signUp: async ({ email, password, options } = { email: '', password: '', options: undefined }) => ({ data: null, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'mock-id', email: 'mock@email.com' } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (tableName: string) => ({
    select: (query = '*') => ({
      eq: (column: string, value: any) => ({
        maybeSingle: () => ({ data: null, error: null }),
        order: (column: string, { ascending } = { ascending: false }) => ({
          limit: (limit: number) => ({
            data: [],
            error: null
          }),
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      order: (column: string, { ascending } = { ascending: false }) => ({
        limit: (limit: number) => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      count: () => ({ data: 0, error: null }),
      data: [],
      error: null
    }),
    insert: (data: any) => ({ data: [], error: null }),
    upsert: (data: any) => ({ data: [], error: null }),
    update: (data: any) => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null }),
    count: () => ({ data: 0, error: null }),
  }),
  storage: {
    from: (bucketName: string) => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

// Get the current site URL for redirects
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

// Create a fallback client function
export const createFallbackClient = () => {
  console.log('Creating mock Supabase client');
  return supabase;
};
