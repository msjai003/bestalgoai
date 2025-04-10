
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
      // Ensure params has p_broker_id
      const brokerId = params && typeof params === 'object' && 'p_broker_id' in params ? params.p_broker_id : 1;
      
      // Create a comprehensive list of mock broker functions based on broker ID
      let mockFunctions = [];
      
      // Zerodha (ID: 1)
      if (brokerId === 1) {
        mockFunctions = [
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
            broker_id: 1,
            broker_name: "Zerodha",
            function_name: "Order Modification",
            function_description: "Modify existing orders",
            function_slug: "order_modification",
            function_enabled: true,
            is_premium: false,
            function_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      // ICICI Direct (ID: 2)
      else if (brokerId === 2) {
        mockFunctions = [
          {
            id: "4",
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
          },
          {
            id: "5",
            broker_id: 2,
            broker_name: "ICICI Direct",
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
      }
      
      // Angel One (ID: 3)
      else if (brokerId === 3) {
        mockFunctions = [
          {
            id: "6",
            broker_id: 3,
            broker_name: "Angel One",
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
            id: "7",
            broker_id: 3,
            broker_name: "Angel One",
            function_name: "Market Data",
            function_description: "Access real-time market data",
            function_slug: "market_data",
            function_enabled: true,
            is_premium: false,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "8",
            broker_id: 3,
            broker_name: "Angel One",
            function_name: "Order Modification",
            function_description: "Modify existing orders",
            function_slug: "order_modification",
            function_enabled: true,
            is_premium: false,
            function_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      // HDFC Securities (ID: 4)
      else if (brokerId === 4) {
        mockFunctions = [
          {
            id: "9",
            broker_id: 4,
            broker_name: "HDFC Securities",
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
            id: "10",
            broker_id: 4,
            broker_name: "HDFC Securities",
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
      }
      
      // Upstox (ID: 5)
      else if (brokerId === 5) {
        mockFunctions = [
          {
            id: "11",
            broker_id: 5,
            broker_name: "Upstox",
            function_name: "Order Placement",
            function_description: "Place new orders with the broker",
            function_slug: "order_placement",
            function_enabled: true,
            is_premium: false,
            function_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      // Groww (ID: 6)
      else if (brokerId === 6) {
        mockFunctions = [
          {
            id: "12",
            broker_id: 6,
            broker_name: "Groww",
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
            id: "13",
            broker_id: 6,
            broker_name: "Groww",
            function_name: "Portfolio Import",
            function_description: "Import existing portfolio",
            function_slug: "portfolio_import",
            function_enabled: true,
            is_premium: false,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      // 5 Paisa (ID: 7)
      else if (brokerId === 7) {
        mockFunctions = [
          {
            id: "14",
            broker_id: 7,
            broker_name: "5 Paisa",
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
            id: "15",
            broker_id: 7,
            broker_name: "5 Paisa",
            function_name: "Instant Fund Transfer",
            function_description: "Transfer funds instantly",
            function_slug: "fund_transfer",
            function_enabled: true,
            is_premium: true,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      // Bigul (ID: 8)
      else if (brokerId === 8) {
        mockFunctions = [
          {
            id: "16",
            broker_id: 8,
            broker_name: "Bigul",
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
            id: "17",
            broker_id: 8,
            broker_name: "Bigul",
            function_name: "Advanced Charting",
            function_description: "Access advanced charting tools",
            function_slug: "advanced_charting",
            function_enabled: true,
            is_premium: true,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
        
      return {
        data: mockFunctions,
        error: null
      };
    }
    
    if (functionName === 'get_all_broker_infocap_functions') {
      return {
        data: [
          // Zerodha functions
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
            broker_id: 1,
            broker_name: "Zerodha",
            function_name: "Order Modification",
            function_description: "Modify existing orders",
            function_slug: "order_modification",
            function_enabled: true,
            is_premium: false,
            function_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // ICICI Direct functions
          {
            id: "4",
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
          },
          {
            id: "5",
            broker_id: 2,
            broker_name: "ICICI Direct",
            function_name: "Market Data",
            function_description: "Access real-time market data",
            function_slug: "market_data",
            function_enabled: true,
            is_premium: true,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // Angel One functions
          {
            id: "6",
            broker_id: 3,
            broker_name: "Angel One",
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
            id: "7",
            broker_id: 3,
            broker_name: "Angel One",
            function_name: "Market Data",
            function_description: "Access real-time market data",
            function_slug: "market_data",
            function_enabled: true,
            is_premium: false,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "8",
            broker_id: 3,
            broker_name: "Angel One",
            function_name: "Order Modification",
            function_description: "Modify existing orders",
            function_slug: "order_modification",
            function_enabled: true,
            is_premium: false,
            function_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // HDFC Securities functions
          {
            id: "9",
            broker_id: 4,
            broker_name: "HDFC Securities",
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
            id: "10",
            broker_id: 4,
            broker_name: "HDFC Securities",
            function_name: "Market Data",
            function_description: "Access real-time market data",
            function_slug: "market_data",
            function_enabled: true,
            is_premium: true,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // Upstox functions
          {
            id: "11",
            broker_id: 5,
            broker_name: "Upstox",
            function_name: "Order Placement",
            function_description: "Place new orders with the broker",
            function_slug: "order_placement",
            function_enabled: true,
            is_premium: false,
            function_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // Groww functions
          {
            id: "12",
            broker_id: 6,
            broker_name: "Groww",
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
            id: "13",
            broker_id: 6,
            broker_name: "Groww",
            function_name: "Portfolio Import",
            function_description: "Import existing portfolio",
            function_slug: "portfolio_import",
            function_enabled: true,
            is_premium: false,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // 5 Paisa functions
          {
            id: "14",
            broker_id: 7,
            broker_name: "5 Paisa",
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
            id: "15",
            broker_id: 7,
            broker_name: "5 Paisa",
            function_name: "Instant Fund Transfer",
            function_description: "Transfer funds instantly",
            function_slug: "fund_transfer",
            function_enabled: true,
            is_premium: true,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // Bigul functions
          {
            id: "16",
            broker_id: 8,
            broker_name: "Bigul",
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
            id: "17",
            broker_id: 8,
            broker_name: "Bigul",
            function_name: "Advanced Charting",
            function_description: "Access advanced charting tools",
            function_slug: "advanced_charting",
            function_enabled: true,
            is_premium: true,
            function_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        error: null
      };
    }
    
    if (functionName === 'save_broker_infocap_function') {
      // Ensure params have proper type safety
      if (typeof params !== 'object' || params === null) {
        return {
          data: null,
          error: { message: "Invalid parameters" }
        };
      }
      
      const mockParams = {
        p_broker_id: 'p_broker_id' in params ? params.p_broker_id : 0,
        p_broker_name: 'p_broker_name' in params ? params.p_broker_name : '',
        p_function_name: 'p_function_name' in params ? params.p_function_name : '',
        p_function_description: 'p_function_description' in params ? params.p_function_description : '',
        p_function_slug: 'p_function_slug' in params ? params.p_function_slug : '',
        p_function_order: 'p_function_order' in params ? params.p_function_order : 0,
        p_function_enabled: 'p_function_enabled' in params ? params.p_function_enabled : true,
        p_is_premium: 'p_is_premium' in params ? params.p_is_premium : false
      };
      
      return {
        data: Math.floor(Math.random() * 1000) + 1, // Random ID for the saved function
        error: null
      };
    }
    
    if (functionName === 'execute_sql') {
      const query = params && typeof params === 'object' && 'query' in params ? String(params.query) : '';
      if (query && typeof query === 'string' && query.includes('EXISTS')) {
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
