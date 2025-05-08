import { BrokerFunction, BrokerFunctionConfig, BrokerInfocapFunction, BrokerInfocapResponse, GetBrokerFunctionsParams, SaveBrokerFunctionParams } from '@/types/broker';
import { brokers } from '@/components/broker-integration/BrokerData';
import { supabase } from '@/integrations/supabase/client';
import { getBrokerImageUrl, getDefaultBrokerImage } from '@/utils/brokerImageUtils';

// Static broker functions data as fallback
const staticBrokerFunctions: BrokerFunction[] = [
  // Zerodha functions
  {
    id: "1-order_placement",
    broker_id: 1,
    broker_name: "Zerodha",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "/lovable-uploads/9de2890f-d6a8-443f-9e22-64a47566a9fa.png"
  },
  {
    id: "1-order_modification",
    broker_id: 1,
    broker_name: "Zerodha",
    function_name: "Order Modification",
    function_description: "Modify existing orders",
    function_slug: "order_modification",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  },
  {
    id: "1-market_data",
    broker_id: 1,
    broker_name: "Zerodha",
    function_name: "Market Data",
    function_description: "Access real-time market data",
    function_slug: "market_data",
    function_enabled: true,
    is_premium: true,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  },
  // ICICI Direct functions
  {
    id: "2-order_placement",
    broker_id: 2,
    broker_name: "ICICI Direct",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
  },
  {
    id: "2-market_data",
    broker_id: 2,
    broker_name: "ICICI Direct",
    function_name: "Market Data",
    function_description: "Access real-time market data",
    function_slug: "market_data",
    function_enabled: true,
    is_premium: true,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
  },
  // Angel One functions
  {
    id: "3-order_placement",
    broker_id: 3,
    broker_name: "Angel One",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  },
  {
    id: "3-market_data",
    broker_id: 3,
    broker_name: "Angel One",
    function_name: "Market Data",
    function_description: "Access real-time market data",
    function_slug: "market_data",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  },
  {
    id: "3-order_modification",
    broker_id: 3,
    broker_name: "Angel One",
    function_name: "Order Modification",
    function_description: "Modify existing orders",
    function_slug: "order_modification",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  },
  // HDFC Securities functions
  {
    id: "4-order_placement",
    broker_id: 4,
    broker_name: "HDFC Securities",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
  },
  {
    id: "4-market_data",
    broker_id: 4,
    broker_name: "HDFC Securities",
    function_name: "Market Data",
    function_description: "Access real-time market data",
    function_slug: "market_data",
    function_enabled: true,
    is_premium: true,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
  },
  // Upstox functions
  {
    id: "5-order_placement",
    broker_id: 5,
    broker_name: "Upstox",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
  },
  // Groww functions
  {
    id: "6-order_placement",
    broker_id: 6,
    broker_name: "Groww",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
  },
  {
    id: "6-portfolio_import",
    broker_id: 6,
    broker_name: "Groww",
    function_name: "Portfolio Import",
    function_description: "Import existing portfolio",
    function_slug: "portfolio_import",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
  },
  // 5 Paisa functions
  {
    id: "7-order_placement",
    broker_id: 7,
    broker_name: "5 Paisa",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
  },
  {
    id: "7-fund_transfer",
    broker_id: 7,
    broker_name: "5 Paisa",
    function_name: "Instant Fund Transfer",
    function_description: "Transfer funds instantly",
    function_slug: "fund_transfer",
    function_enabled: true,
    is_premium: true,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
  },
  // Bigul functions
  {
    id: "8-order_placement",
    broker_id: 8,
    broker_name: "Bigul",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
  },
  {
    id: "8-advanced_charting",
    broker_id: 8,
    broker_name: "Bigul",
    function_name: "Advanced Charting",
    function_description: "Access advanced charting tools",
    function_slug: "advanced_charting",
    function_enabled: true,
    is_premium: true,
    image_url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
  },
  // AliceBlue functions
  {
    id: "9-order_placement",
    broker_id: 9,
    broker_name: "AliceBlue",
    function_name: "Order Placement",
    function_description: "Place and manage orders seamlessly",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    image_url: "/lovable-uploads/aliceblue_logo.png"
  },
  {
    id: "9-portfolio_tracking",
    broker_id: 9,
    broker_name: "AliceBlue",
    function_name: "Portfolio Tracking",
    function_description: "Track your investments in real-time",
    function_slug: "portfolio_tracking",
    function_enabled: true,
    is_premium: false,
    image_url: "/lovable-uploads/aliceblue_logo.png"
  },
  {
    id: "9-fund_management",
    broker_id: 9,
    broker_name: "AliceBlue",
    function_name: "Fund Management",
    function_description: "Manage your trading funds efficiently",
    function_slug: "fund_management",
    function_enabled: true,
    is_premium: false,
    image_url: "/lovable-uploads/aliceblue_logo.png"
  }
];

/**
 * Fetches all functions for a specific broker from the broker_infocap table
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  try {
    // Use the broker_infocap RPC function
    const { data, error } = await supabase.rpc('get_broker_infocap_functions', { p_broker_id: brokerId });
      
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      console.log("No broker functions found in database, using static data");
      // Fall back to static data if database query fails or returns no results
      return getStaticBrokerFunctions(brokerId);
    }
    
    // Convert the broker_infocap data to the BrokerFunction format
    if (Array.isArray(data)) {
      const brokerImage = await getBrokerImageUrl(brokerId);
      
      return data.map(func => ({
        id: func.id.toString(),
        broker_id: func.broker_id,
        broker_name: func.broker_name,
        function_name: func.function_name,
        function_description: func.function_description,
        function_slug: func.function_slug,
        function_enabled: func.function_enabled,
        is_premium: func.is_premium,
        function_order: func.function_order,
        image_url: brokerImage || undefined,
        created_at: func.created_at,
        updated_at: func.updated_at
      }));
    }
    
    return getStaticBrokerFunctions(brokerId);
  } catch (error) {
    console.error("Error fetching broker functions:", error);
    // Fall back to static data if there's an exception
    return getStaticBrokerFunctions(brokerId);
  }
};

/**
 * Checks if a broker has a specific function enabled
 */
export const hasBrokerFunction = async (
  brokerId: number, 
  functionSlug: string
): Promise<boolean> => {
  try {
    // Get all functions for this broker
    const functions = await getFunctionsForBroker(brokerId);
    
    // Check if the function exists and is enabled
    return functions.some(func => 
      func.broker_id === brokerId && 
      func.function_slug === functionSlug && 
      func.function_enabled
    );
  } catch (error) {
    console.error("Error checking broker function:", error);
    // Fall back to static data if there's an exception
    return checkStaticBrokerFunction(brokerId, functionSlug);
  }
};

/**
 * Checks if a broker function is premium
 */
export const isBrokerFunctionPremium = async (
  brokerId: number, 
  functionSlug: string
): Promise<boolean> => {
  try {
    // Get all functions for this broker
    const functions = await getFunctionsForBroker(brokerId);
    
    // Find the specific function
    const func = functions.find(f => 
      f.broker_id === brokerId && 
      f.function_slug === functionSlug && 
      f.function_enabled
    );
    
    // Return whether it's premium
    return func ? !!func.is_premium : false;
  } catch (error) {
    console.error("Error checking if broker function is premium:", error);
    // Fall back to static data if there's an exception
    return checkStaticBrokerFunctionPremium(brokerId, functionSlug);
  }
};

// Simple cache for broker images to avoid multiple lookups
const brokerImageCache: Record<number, string | null> = {};

/**
 * Gets broker image from cache or looks it up
 */
const getBrokerImageFromCache = (brokerId: number): string | undefined => {
  if (brokerId in brokerImageCache) {
    return brokerImageCache[brokerId] || undefined;
  }
  
  // Use the default image function
  const image = getDefaultBrokerImage(brokerId);
  brokerImageCache[brokerId] = image;
  return image || undefined;
};

/**
 * Gets broker image for a broker
 */
export const getBrokerImage = async (
  brokerId: number
): Promise<string | null> => {
  // Special case for Zerodha (broker ID 1)
  if (brokerId === 1) {
    const zerodhaImage = "/lovable-uploads/9de2890f-d6a8-443f-9e22-64a47566a9fa.png";
    brokerImageCache[brokerId] = zerodhaImage;
    return zerodhaImage;
  }
  
  // Special case for ICICI Direct (broker ID 2)
  if (brokerId === 2) {
    const iciciDirectImage = "/lovable-uploads/b6f29d4f-ea6d-46c7-bfdd-f79050fc22cb.png";
    brokerImageCache[brokerId] = iciciDirectImage;
    return iciciDirectImage;
  }
  
  // Special case for Angel One (broker ID 3)
  if (brokerId === 3) {
    const angelOneImage = "/lovable-uploads/e4eaf527-5b68-4f06-99e7-5969dcfa6810.png";
    brokerImageCache[brokerId] = angelOneImage;
    return angelOneImage;
  }
  
  // Special case for HDFC Securities (broker ID 4)
  if (brokerId === 4) {
    const hdfcSecuritiesImage = "/lovable-uploads/22134556-ddbb-46aa-b837-cc1b1e3a6260.png";
    brokerImageCache[brokerId] = hdfcSecuritiesImage;
    return hdfcSecuritiesImage;
  }
  
  // Special case for Groww (broker ID 6)
  if (brokerId === 6) {
    const growwImage = "/lovable-uploads/65c8e983-a72d-472b-9f46-caad015f5cf4.png";
    brokerImageCache[brokerId] = growwImage;
    return growwImage;
  }
  
  // Special case for 5 Paisa (broker ID 7)
  if (brokerId === 7) {
    const fivePaisaImage = "/lovable-uploads/e24c22b3-8f90-4b78-8f3f-b0100b2654bc.png";
    brokerImageCache[brokerId] = fivePaisaImage;
    return fivePaisaImage;
  }
  
  // Special case for Bigul (broker ID 8)
  if (brokerId === 8) {
    const bigulImage = "/lovable-uploads/74071c2d-1d0d-4ad9-bad9-ce821097cc5c.png";
    brokerImageCache[brokerId] = bigulImage;
    return bigulImage;
  }
  
  // Special case for AliceBlue (broker ID 9)
  if (brokerId === 9) {
    const aliceBlueImage = "/lovable-uploads/aliceblue_logo.png";
    brokerImageCache[brokerId] = aliceBlueImage;
    return aliceBlueImage;
  }
  
  // First check cache
  if (brokerId in brokerImageCache) {
    return brokerImageCache[brokerId];
  }
  
  try {
    // Get broker image from the broker_infocap table
    const { data, error } = await supabase
      .from('broker_infocap')
      .select('broker_image_url')
      .eq('broker_id', brokerId)
      .limit(1)
      .maybeSingle();
    
    if (!error && data?.broker_image_url) {
      brokerImageCache[brokerId] = data.broker_image_url;
      return data.broker_image_url;
    }
    
    // Fallback to broker_profile_images
    const imageUrl = await getBrokerImageUrl(brokerId);
    
    if (imageUrl) {
      brokerImageCache[brokerId] = imageUrl;
      return imageUrl;
    }
    
    // Try to get broker from static data if database query returns no results
    const broker = brokers.find(b => b.id === brokerId);
    if (broker) {
      const image = broker.logo || null;
      brokerImageCache[brokerId] = image;
      return image;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching broker image:", error);
    // Fall back to static broker data
    const broker = brokers.find(b => b.id === brokerId);
    const image = broker?.logo || null;
    brokerImageCache[brokerId] = image;
    return image;
  }
};

// Helper functions for static data
const getStaticBrokerFunctions = (brokerId: number): BrokerFunction[] => {
  return staticBrokerFunctions.filter(func => 
    func.broker_id === brokerId && func.function_enabled
  );
};

const checkStaticBrokerFunction = (brokerId: number, functionSlug: string): boolean => {
  const functions = staticBrokerFunctions.filter(func => 
    func.broker_id === brokerId && 
    func.function_slug === functionSlug && 
    func.function_enabled
  );
  
  return functions.length > 0;
};

const checkStaticBrokerFunctionPremium = (brokerId: number, functionSlug: string): boolean => {
  const functions = staticBrokerFunctions.filter(func => 
    func.broker_id === brokerId && 
    func.function_slug === functionSlug && 
    func.function_enabled
  );
  
  if (functions.length === 0) return false;
  
  return !!functions[0].is_premium;
};

/**
 * Gets function configuration for a broker
 */
export const getBrokerFunctionConfig = async (
  brokerId: number, 
  functionSlug: string
): Promise<any | null> => {
  try {
    // Get all functions for this broker
    const functions = await getFunctionsForBroker(brokerId);
    
    // Find the specific function
    const func = functions.find(f => 
      f.broker_id === brokerId && 
      f.function_slug === functionSlug && 
      f.function_enabled
    );
    
    // Return the function description as configuration (or extend this in the future)
    return func ? { 
      description: func.function_description,
      required_inputs: func.required_inputs
    } : null;
  } catch (error) {
    console.error("Error getting broker function config:", error);
    return null;
  }
};

/**
 * Save a function to the broker_infocap table
 */
export const saveBrokerFunction = async (
  brokerId: number,
  brokerName: string,
  functionName: string,
  functionDescription: string,
  functionSlug: string,
  requiredInputs: string[] = [],
  imageUrl: string | null = null,
  functionOrder: number = 0,
  functionEnabled: boolean = true,
  isPremium: boolean = false
): Promise<string | null> => {
  try {
    // Save to broker_infocap table instead
    const { data, error } = await supabase.rpc(
      'save_broker_infocap_function',
      {
        p_broker_id: brokerId,
        p_broker_name: brokerName,
        p_function_name: functionName,
        p_function_description: functionDescription,
        p_function_slug: functionSlug,
        p_function_order: functionOrder,
        p_function_enabled: functionEnabled,
        p_is_premium: isPremium
      }
    );
    
    if (error) {
      console.error("Error saving broker function:", error);
      return null;
    }
    
    // If an image URL was provided, update the broker image
    if (imageUrl) {
      await supabase.rpc('upsert_broker_image', {
        p_broker_id: brokerId,
        p_image_url: imageUrl
      });
    }
    
    return data ? data.toString() : null;
  } catch (error) {
    console.error("Error saving broker function:", error);
    return null;
  }
};

/**
 * Get all functions from the broker_infocap table
 */
export const getAllBrokerFunctions = async (): Promise<BrokerFunction[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_broker_infocap_functions');
    
    if (error || !data) {
      console.error("Error fetching all broker functions:", error);
      return [];
    }
    
    // Convert to BrokerFunction format
    if (Array.isArray(data)) {
      const result: BrokerFunction[] = [];
      
      for (const func of data) {
        // Get the broker image
        const brokerImage = await getBrokerImageUrl(func.broker_id);
        
        result.push({
          id: func.id.toString(),
          broker_id: func.broker_id,
          broker_name: func.broker_name,
          function_name: func.function_name,
          function_description: func.function_description,
          function_slug: func.function_slug,
          function_enabled: func.function_enabled,
          is_premium: func.is_premium,
          function_order: func.function_order,
          image_url: brokerImage || undefined,
          created_at: func.created_at,
          updated_at: func.updated_at
        });
      }
      
      return result;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching all broker functions:", error);
    return [];
  }
};

/**
 * Legacy function to maintain compatibility with old code
 */
export const getAllBrokerInfocapFunctions = async (): Promise<BrokerInfocapFunction[]> => {
  try {
    const functions = await getAllBrokerFunctions();
    
    // Convert from new format to old format for compatibility
    return functions.map(func => ({
      id: func.id,
      broker_id: func.broker_id,
      broker_name: func.broker_name,
      function_name: func.function_name,
      function_description: func.function_description,
      function_slug: func.function_slug,
      function_order: func.function_order || 0,
      function_enabled: func.function_enabled,
      is_premium: func.is_premium,
      broker_image: func.image_url,
      created_at: func.created_at,
      updated_at: func.updated_at
    }));
  } catch (error) {
    console.error("Error fetching all broker functions:", error);
    return [];
  }
};

/**
 * Legacy function to maintain compatibility with old code
 */
export const saveBrokerInfocapFunction = async (
  brokerId: number,
  brokerName: string,
  functionName: string,
  functionDescription: string,
  functionSlug: string,
  functionOrder: number,
  functionEnabled: boolean = true,
  isPremium: boolean = false
): Promise<number | null> => {
  const result = await saveBrokerFunction(
    brokerId,
    brokerName,
    functionName,
    functionDescription,
    functionSlug,
    [], // No required inputs
    null, // No image URL
    functionOrder,
    functionEnabled,
    isPremium
  );
  
  return result ? parseInt(result) : null;
};
