
// Mock client that doesn't connect to Supabase
export const supabaseUrl = 'removed';
export const supabaseAnonKey = 'removed';

// Get the current site URL for redirects
export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

// Mock Supabase client
export const supabase = {
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Database connection removed' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Database connection removed' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
  },
  from: (tableName) => ({
    select: (columns) => ({
      limit: (limitNum) => ({
        order: (orderBy) => ({
          data: [],
          error: { message: 'Database connection removed' }
        }),
        data: [],
        error: { message: 'Database connection removed' }
      }),
      insert: (data) => ({ 
        data: null, 
        error: { message: 'Database connection removed' } 
      }),
      upsert: (data) => ({
        data: null,
        error: { message: 'Database connection removed' }
      }),
      data: [],
      error: { message: 'Database connection removed' }
    })
  }),
  storage: {
    from: (bucketName) => ({
      upload: async () => ({ data: null, error: { message: 'Database connection removed' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
    })
  },
  channel: (channelName) => ({
    on: () => ({
      subscribe: () => {}
    })
  }),
  removeChannel: () => {}
};

// Create a fallback client function
export const createFallbackClient = () => {
  console.log('Creating fallback client (no actual connection)');
  return supabase;
};
