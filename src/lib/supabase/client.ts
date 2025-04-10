
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
  from: (tableName) => ({
    select: (query = '*') => ({
      eq: (column, value) => ({
        maybeSingle: () => ({ data: null, error: null }),
        single: () => ({ data: null, error: null }),
        order: (column, { ascending } = { ascending: false }) => ({
          limit: (limit, options) => ({
            data: [],
            error: null
          }),
          // Add headers method at this level
          headers: () => ({
            data: [],
            error: null
          }),
          data: [],
          error: null
        }),
        limit: (limit, options) => ({
          data: [],
          error: null
        }),
        eq: (column, value) => ({
          data: [],
          error: null
        }),
        // Add headers method at this level
        headers: () => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      gte: (column, value) => ({
        data: [],
        error: null
      }),
      order: (column, { ascending } = { ascending: false }) => ({
        limit: (limit, options) => ({
          data: [],
          error: null
        }),
        eq: (column, value) => ({
          data: [],
          error: null
        }),
        // Add headers method at this level
        headers: () => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      limit: (limit, options) => ({
        data: [],
        error: null,
        select: (subQuery) => ({
          data: [],
          error: null 
        })
      }),
      // Add headers method at this level also
      headers: () => ({
        data: [],
        error: null
      }),
      count: () => ({ data: 0, error: null }),
      data: [],
      error: null
    }),
    insert: (data) => ({ 
      select: (columns) => ({ data: [{ id: 'mock-id', ...data }], error: null }),
      single: () => ({ data: { id: 'mock-id', ...data }, error: null }),
      data: [{ id: 'mock-id', ...data }], 
      error: null 
    }),
    update: (data) => ({ 
      eq: (column, value) => ({ data, error: null }),
      single: () => ({ data, error: null }),
      data, 
      error: null 
    }),
    delete: () => ({ 
      eq: (column, value) => ({ data: null, error: null }),
      gte: (column, value) => ({ data: null, error: null }),
      data: null, 
      error: null 
    }),
    count: () => ({ data: 0, error: null }),
  }),
  storage: {
    from: (bucketName) => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  rpc: (functionName, params = {}) => {
    // Mock implementation of rpc function
    console.log(`Mock RPC call to ${functionName} with params:`, params);
    return {
      data: [],
      error: null
    };
  },
  channel: (channel) => ({
    on: (event, options, callback) => ({
      subscribe: () => {}
    })
  }),
  removeChannel: (channel) => {},
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
