import { BrokerFunction, BrokerFunctionConfig, BrokerInfocapFunction, BrokerInfocapResponse } from '@/types/broker';
import { brokers } from '@/components/broker-integration/BrokerData';
import { supabase } from '@/integrations/supabase/client';

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
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
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
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
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
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
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
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
  },
  // More static data entries...
];

/**
 * Fetches all functions for a specific broker from the broker_infocap table
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  try {
    // Use the RPC function to get broker functions from broker_infocap
    const { data, error } = await supabase.rpc('get_broker_infocap_functions', {
      p_broker_id: brokerId
    });
      
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      console.log("No broker functions found in database, using static data");
      // Fall back to static data if database query fails or returns no results
      return getStaticBrokerFunctions(brokerId);
    }
    
    // Convert BrokerInfocapFunction to BrokerFunction format
    if (Array.isArray(data)) {
      return data.map((func: BrokerInfocapFunction) => ({
        id: func.id,
        broker_id: func.broker_id,
        broker_name: func.broker_name,
        function_name: func.function_name,
        function_description: func.function_description,
        function_slug: func.function_slug,
        function_enabled: func.function_enabled,
        is_premium: func.is_premium,
        broker_image: getBrokerImageFromCache(func.broker_id),
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
 * Checks if a broker has a specific function enabled from broker_infocap
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
 * Checks if a broker function is premium from broker_infocap
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
  
  const broker = brokers.find(b => b.id === brokerId);
  const image = broker?.logo || null;
  brokerImageCache[brokerId] = image;
  return image || undefined;
};

/**
 * Gets broker image for a broker function
 */
export const getBrokerImage = async (
  brokerId: number
): Promise<string | null> => {
  // First check cache
  if (brokerId in brokerImageCache) {
    return brokerImageCache[brokerId];
  }
  
  try {
    // Try to fetch from database 
    const { data, error } = await supabase
      .from('broker_details')
      .select('image_url')
      .eq('id', brokerId)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error fetching broker image:", error);
      // Fall back to static broker data
      const broker = brokers.find(b => b.id === brokerId);
      const image = broker?.logo || null;
      brokerImageCache[brokerId] = image;
      return image;
    }
    
    // We need to handle different property names between tables
    const image = data.image_url || null;
    brokerImageCache[brokerId] = image;
    return image;
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

// Gets function configuration for a broker
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
    return func ? { description: func.function_description } : null;
  } catch (error) {
    console.error("Error getting broker function config:", error);
    return null;
  }
};

/**
 * Save a function to the broker_infocap table
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
  try {
    const { data, error } = await supabase.rpc('save_broker_infocap_function', {
      p_broker_id: brokerId,
      p_broker_name: brokerName,
      p_function_name: functionName,
      p_function_description: functionDescription,
      p_function_slug: functionSlug,
      p_function_order: functionOrder,
      p_function_enabled: functionEnabled,
      p_is_premium: isPremium
    });
    
    if (error) {
      console.error("Error saving broker function:", error);
      return null;
    }
    
    return typeof data === 'number' ? data : null;
  } catch (error) {
    console.error("Error saving broker function:", error);
    return null;
  }
};

/**
 * Get all functions from the broker_infocap table
 */
export const getAllBrokerInfocapFunctions = async (): Promise<BrokerInfocapFunction[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_broker_infocap_functions');
    
    if (error || !data) {
      console.error("Error fetching all broker functions:", error);
      return [];
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching all broker functions:", error);
    return [];
  }
};
