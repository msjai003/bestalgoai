
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
        order: (column, { ascending } = { ascending: false }) => ({
          limit: (limit) => ({
            data: [],
            error: null
          }),
          data: [],
          error: null
        }),
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
    insert: (data) => ({ data: [], error: null }),
    update: (data) => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null }),
    count: () => ({ data: 0, error: null }),
  }),
  storage: {
    from: (bucketName) => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  rpc: (functionName, params = {}) => {
    // Type-safe handling of params based on function name
    if (functionName === 'get_broker_infocap_functions') {
      // Handle p_broker_id parameter
      const brokerId = params?.p_broker_id || 1;
      
      const mockFunctions = [
        {
          id: "1",
          broker_id: brokerId,
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
          broker_id: brokerId,
          broker_name: "Zerodha",
          function_name: "Market Data",
          function_description: "Access real-time market data",
          function_slug: "market_data",
          function_enabled: true,
          is_premium: true,
          function_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Filter the results by broker ID if provided
      const result = params && 'p_broker_id' in params 
        ? mockFunctions.filter(f => f.broker_id === params.p_broker_id)
        : mockFunctions;
        
      return {
        data: result,
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
            function_name: "Market Data",
            function_description: "Access real-time market data",
            function_slug: "market_data",
            function_enabled: true,
            is_premium: true,
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
      // Ensure params have proper type safety
      const mockParams = {
        p_broker_id: params.p_broker_id || 0,
        p_broker_name: params.p_broker_name || '',
        p_function_name: params.p_function_name || '',
        p_function_description: params.p_function_description || '',
        p_function_slug: params.p_function_slug || '',
        p_function_order: params.p_function_order || 0,
        p_function_enabled: params.p_function_enabled !== undefined ? params.p_function_enabled : true,
        p_is_premium: params.p_is_premium || false
      };
      
      return {
        data: Math.floor(Math.random() * 1000) + 1, // Random ID for the saved function
        error: null
      };
    }
    
    if (functionName === 'execute_sql') {
      if (params && 'query' in params && params.query && params.query.includes('EXISTS')) {
        return {
          data: [{ exists: true, count: 5 }],
          error: null
        };
      }
      return {
        data: [],
        error: null
      };
    }
    
    // Default mock response for any other RPC functions
    console.log(`Mock RPC call to ${functionName} with params:`, params);
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
