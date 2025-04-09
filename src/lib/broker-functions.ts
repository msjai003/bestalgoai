
import { BrokerFunction } from '@/types/broker';
import { brokers } from '@/components/broker-integration/BrokerData';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches all functions for a specific broker
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  try {
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('brokers_functions')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('function_enabled', true);
      
    if (error || !data || data.length === 0) {
      console.log("No broker functions found in database, using static data");
      // Fall back to static data if database query fails or returns no results
      return getStaticBrokerFunctions(brokerId);
    }
    
    return data as BrokerFunction[];
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
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('brokers_functions')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .eq('function_enabled', true);
      
    if (error) {
      console.error("Error checking broker function:", error);
      // Fall back to static data if database query fails
      return checkStaticBrokerFunction(brokerId, functionSlug);
    }
    
    return data && data.length > 0;
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
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('brokers_functions')
      .select('is_premium')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .eq('function_enabled', true)
      .maybeSingle();
      
    if (error || !data) {
      console.error("Error checking if broker function is premium:", error);
      // Fall back to static data if database query fails
      return checkStaticBrokerFunctionPremium(brokerId, functionSlug);
    }
    
    return data.is_premium === true;
  } catch (error) {
    console.error("Error checking if broker function is premium:", error);
    // Fall back to static data if there's an exception
    return checkStaticBrokerFunctionPremium(brokerId, functionSlug);
  }
};

/**
 * Gets broker image for a broker function
 */
export const getBrokerImage = async (
  brokerId: number
): Promise<string | null> => {
  try {
    // Try to fetch from database using the RPC function
    const { data, error } = await supabase.rpc('get_broker_image', {
      p_broker_id: brokerId
    });
    
    if (error || !data) {
      console.error("Error fetching broker image:", error);
      // Fall back to static broker data
      const broker = brokers.find(b => b.id === brokerId);
      return broker?.logo || null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching broker image:", error);
    // Fall back to static broker data
    const broker = brokers.find(b => b.id === brokerId);
    return broker?.logo || null;
  }
};

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
  // Add more broker functions as needed for other brokers
];

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

// Optional: Gets function configuration for a broker (if needed)
export const getBrokerFunctionConfig = async (
  brokerId: number, 
  functionSlug: string
): Promise<any | null> => {
  try {
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('brokers_functions')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .eq('function_enabled', true)
      .maybeSingle();
      
    if (error || !data) {
      // Fall back to static data if database query fails
      const staticFunction = staticBrokerFunctions.find(func => 
        func.broker_id === brokerId && 
        func.function_slug === functionSlug && 
        func.function_enabled
      );
      
      return staticFunction?.configuration || null;
    }
    
    // Return configuration if it exists
    return (data as any).configuration || null;
  } catch (error) {
    console.error("Error getting broker function config:", error);
    return null;
  }
};
