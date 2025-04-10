
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
          limit: (limit) => ({
            data: [],
            error: null
          }),
          data: [],
          error: null
        }),
        eq: () => ({ data: [], error: null }),
        data: [],
        error: null
      }),
      order: (column, { ascending } = { ascending: false }) => ({
        limit: (limit) => ({
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
    insert: (data) => ({ 
      select: () => ({ data: [], error: null }),
      data: [], 
      error: null 
    }),
    update: (data) => ({ 
      eq: () => ({ data: [], error: null }),
      data: [], 
      error: null 
    }),
    delete: () => ({ 
      eq: () => ({ data: [], error: null }),
      data: [], 
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
    
    // Mock specific RPC functions
    if (functionName === 'get_broker_infocap_functions') {
      return {
        data: [
          {
            id: "1",
            broker_id: 1,
            broker_name: "Zerodha",
            function_name: "Order Placement",
            function_description: "Place new orders with the broker",
            function_slug: "order_placement",
            function_enabled: true,
            is_premium: false,
            function_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            broker_id: 1,
            broker_name: "Zerodha",
            function_name: "Order Modification",
            function_description: "Modify existing orders",
            function_slug: "order_modification",
            function_enabled: true,
            is_premium: false,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        error: null
      };
    }
    
    if (functionName === 'get_all_broker_infocap_functions') {
      return {
        data: [
          {
            id: "1",
            broker_id: 1,
            broker_name: "Zerodha",
            function_name: "Order Placement",
            function_description: "Place new orders with the broker",
            function_slug: "order_placement",
            function_enabled: true,
            is_premium: false,
            function_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            broker_id: 1,
            broker_name: "Zerodha",
            function_name: "Order Modification",
            function_description: "Modify existing orders",
            function_slug: "order_modification",
            function_enabled: true,
            is_premium: false,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
            broker_id: 2,
            broker_name: "ICICI Direct",
            function_name: "Order Placement",
            function_description: "Place new orders with the broker",
            function_slug: "order_placement",
            function_enabled: true,
            is_premium: false,
            function_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        error: null
      };
    }
    
    if (functionName === 'save_broker_infocap_function') {
      return {
        data: 123, // Return a mock ID
        error: null
      };
    }
    
    if (functionName === 'delete_broker_infocap_function') {
      return {
        data: true,
        error: null
      };
    }
    
    if (functionName === 'update_broker_infocap_function_order') {
      return {
        data: true,
        error: null
      };
    }
    
    // Default response for other RPC functions
    return {
      data: [],
      error: null
    };
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
