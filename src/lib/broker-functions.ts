
import { BrokerFunction } from '@/types/broker';
import { brokers } from '@/components/broker-integration/BrokerData';
import { supabase } from '@/lib/supabase/client';

/**
 * Fetches all functions for a specific broker
 * Using the brokers_functions table
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  try {
    // Fetch functions from database
    const { data: functions, error } = await supabase
      .from('brokers_functions')
      .select('*')
      .eq('broker_id', brokerId);
      
    if (error) {
      console.error("Error fetching broker functions:", error);
      throw error;
    }
    
    if (functions && functions.length > 0) {
      return functions as BrokerFunction[];
    }
    
    // If no functions found in database, check if the broker exists and create defaults
    const broker = await getBrokerInfo(brokerId);
    
    if (!broker) return [];
    
    // Create standard functions for this broker
    return createDefaultFunctions(broker);
  } catch (error) {
    console.error("Error fetching broker functions:", error);
    return [];
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
    // Check if function exists in database
    const { data, error } = await supabase
      .from('brokers_functions')
      .select('function_enabled')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking broker function:", error);
      return false;
    }
    
    if (data) {
      return data.function_enabled;
    }
    
    // Default functions that all brokers are assumed to have
    const defaultFunctions = ["order_placement", "portfolio_view"];
    
    // Check if it's a default function
    return defaultFunctions.includes(functionSlug);
  } catch (error) {
    console.error("Error checking broker function:", error);
    return false;
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
    // Check if function exists in database
    const { data, error } = await supabase
      .from('brokers_functions')
      .select('is_premium')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking if broker function is premium:", error);
      return false;
    }
    
    if (data) {
      return data.is_premium;
    }
    
    // Premium functions
    const premiumFunctions = ["market_data"];
    
    // Check if it's in the premium functions list
    return premiumFunctions.includes(functionSlug);
  } catch (error) {
    console.error("Error checking if broker function is premium:", error);
    return false;
  }
};

/**
 * Gets broker image for a broker function
 */
export const getBrokerImage = async (
  brokerId: number
): Promise<string | null> => {
  try {
    // First check if the broker exists in brokers_admin table
    const { data: adminBroker, error: adminError } = await supabase
      .from('brokers_admin')
      .select('image_url')
      .eq('id', brokerId)
      .maybeSingle();
      
    if (!adminError && adminBroker && adminBroker.image_url) {
      return adminBroker.image_url;
    }
    
    // Try to fetch from database using the broker_details table as fallback
    const { data, error } = await supabase
      .from('broker_details')
      .select('image_url')
      .eq('id', brokerId)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error fetching broker image:", error);
      // Fall back to static broker data
      const broker = brokers.find(b => b.id === brokerId);
      return broker?.logo || null;
    }
    
    return data.image_url;
  } catch (error) {
    console.error("Error fetching broker image:", error);
    // Fall back to static broker data
    const broker = brokers.find(b => b.id === brokerId);
    return broker?.logo || null;
  }
};

/**
 * Helper function to get broker info
 */
const getBrokerInfo = async (brokerId: number) => {
  try {
    // First check if the broker exists in brokers_admin table
    const { data: adminBroker, error: adminError } = await supabase
      .from('brokers_admin')
      .select('*')
      .eq('id', brokerId)
      .maybeSingle();
      
    if (!adminError && adminBroker) {
      return {
        id: adminBroker.id,
        name: adminBroker.broker_name,
        logo: adminBroker.image_url || "/placeholder.svg"
      };
    }
    
    // Try to fetch from database using the broker_details table as fallback
    const { data, error } = await supabase
      .from('broker_details')
      .select('*')
      .eq('id', brokerId)
      .maybeSingle();
    
    if (error || !data) {
      // Fall back to static broker data
      return brokers.find(b => b.id === brokerId);
    }
    
    return {
      id: data.id,
      name: data.broker_name,
      logo: data.image_url || "/placeholder.svg"
    };
  } catch (error) {
    console.error("Error fetching broker info:", error);
    // Fall back to static broker data
    return brokers.find(b => b.id === brokerId);
  }
};

/**
 * Helper function to create default functions for a broker
 */
const createDefaultFunctions = (broker: { id: number; name: string; logo?: string }) => {
  return [
    {
      id: `${broker.id}-order_placement`,
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Order Placement",
      function_description: "Place new orders with the broker",
      function_slug: "order_placement",
      function_enabled: true,
      is_premium: false,
      broker_image: broker.logo
    },
    {
      id: `${broker.id}-order_modification`,
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Order Modification",
      function_description: "Modify existing orders",
      function_slug: "order_modification",
      function_enabled: true,
      is_premium: false,
      broker_image: broker.logo
    },
    {
      id: `${broker.id}-order_cancellation`,
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Order Cancellation",
      function_description: "Cancel pending orders",
      function_slug: "order_cancellation",
      function_enabled: true,
      is_premium: false,
      broker_image: broker.logo
    },
    {
      id: `${broker.id}-portfolio_view`,
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Portfolio View",
      function_description: "View current holdings and positions",
      function_slug: "portfolio_view",
      function_enabled: true,
      is_premium: false,
      broker_image: broker.logo
    },
    {
      id: `${broker.id}-market_data`,
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Market Data",
      function_description: "Access real-time market data",
      function_slug: "market_data",
      function_enabled: true,
      is_premium: true,
      broker_image: broker.logo
    }
  ];
};

/**
 * Gets function configuration for a broker
 */
export const getBrokerFunctionConfig = async (
  brokerId: number, 
  functionSlug: string
): Promise<any | null> => {
  try {
    // Since the database table is removed, we're returning hardcoded configs
    const defaultConfigs: Record<string, any> = {
      order_placement: {
        requires_2fa: false,
        default_order_type: "MARKET"
      },
      market_data: {
        refresh_interval: 5,
        premium_only: true
      }
    };
    
    return defaultConfigs[functionSlug] || null;
  } catch (error) {
    console.error("Error getting broker function config:", error);
    return null;
  }
};

/**
 * Gets required inputs for a broker function
 */
export const getBrokerFunctionRequiredInputs = async (
  brokerId: number,
  functionSlug: string
): Promise<string[]> => {
  try {
    // First check if the broker exists in brokers_admin table
    const { data: adminBroker, error: adminError } = await supabase
      .from('brokers_admin')
      .select('required_inputs')
      .eq('id', brokerId)
      .maybeSingle();
    
    if (!adminError && adminBroker && adminBroker.required_inputs) {
      // Parse required inputs from admin table
      let requiredInputs: string[] = [];
      if (Array.isArray(adminBroker.required_inputs)) {
        requiredInputs = adminBroker.required_inputs;
      } else if (typeof adminBroker.required_inputs === 'string') {
        try {
          requiredInputs = JSON.parse(adminBroker.required_inputs);
        } catch (e) {
          console.error("Error parsing required_inputs JSON:", e);
        }
      } else if (typeof adminBroker.required_inputs === 'object') {
        requiredInputs = Object.keys(adminBroker.required_inputs);
      }
      
      if (requiredInputs.length > 0) {
        return requiredInputs;
      }
    }
    
    // Find the broker from static data as fallback
    const broker = brokers.find(b => b.id === brokerId);
    if (!broker) return [];
    
    // Return broker required inputs based on the function
    if (broker.requiredInputs && broker.requiredInputs.length > 0) {
      return broker.requiredInputs;
    }
    
    // Default required inputs if broker doesn't specify
    return ["username", "password"];
  } catch (error) {
    console.error("Error getting broker function required inputs:", error);
    return [];
  }
};
