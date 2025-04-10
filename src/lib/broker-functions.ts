
import { BrokerFunction } from '@/types/broker';
import { brokers } from '@/components/broker-integration/BrokerData';
import { supabase } from '@/lib/supabase/client';

/**
 * Fetches all functions for a specific broker
 * Using the broker_functionality table
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  try {
    // Fetch functions from database
    const { data: functions, error } = await supabase
      .from('broker_functionality')
      .select('*')
      .eq('broker_id', brokerId);
      
    if (error) {
      console.error("Error fetching broker functionalities:", error);
      throw error;
    }
    
    if (functions && functions.length > 0) {
      // Use Promise.all to handle multiple async operations
      return await Promise.all(functions.map(async func => ({
        ...func,
        broker_image: func.broker_image || await getBrokerImage(func.broker_id)
      }))) as BrokerFunction[];
    }
    
    // If no functions found in database, check if the broker exists and create defaults
    const broker = await getBrokerInfo(brokerId);
    
    if (!broker) return [];
    
    // Create standard functions for this broker
    return createAndStoreDefaultFunctions(broker);
  } catch (error) {
    console.error("Error fetching broker functionalities:", error);
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
      .from('broker_functionality')
      .select('function_enabled')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking broker functionality:", error);
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
    console.error("Error checking broker functionality:", error);
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
      .from('broker_functionality')
      .select('is_premium')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking if broker functionality is premium:", error);
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
    console.error("Error checking if broker functionality is premium:", error);
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
    const { data: adminData, error: adminError } = await supabase
      .from('brokers_admin')
      .select('image_url')
      .eq('id', brokerId)
      .maybeSingle();
      
    if (!adminError && adminData && adminData.image_url) {
      return adminData.image_url;
    }
    
    // Get from broker_details table as fallback
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
    const { data: adminData, error: adminError } = await supabase
      .from('brokers_admin')
      .select('*')
      .eq('id', brokerId)
      .maybeSingle();
      
    if (!adminError && adminData) {
      return {
        id: adminData.id,
        name: adminData.broker_name,
        logo: adminData.image_url || "/placeholder.svg"
      };
    }
    
    // Check broker_details table
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
 * Helper function to create default functions for a broker and store them in the database
 */
const createAndStoreDefaultFunctions = async (broker: { id: number; name: string; logo?: string }) => {
  const defaultFunctions = [
    {
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Order Placement",
      function_description: "Place new orders with the broker",
      function_slug: "order_placement",
      function_enabled: true,
      is_premium: false
    },
    {
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Order Modification",
      function_description: "Modify existing orders",
      function_slug: "order_modification",
      function_enabled: true,
      is_premium: false
    },
    {
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Order Cancellation",
      function_description: "Cancel pending orders",
      function_slug: "order_cancellation",
      function_enabled: true,
      is_premium: false
    },
    {
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Portfolio View",
      function_description: "View current holdings and positions",
      function_slug: "portfolio_view",
      function_enabled: true,
      is_premium: false
    },
    {
      broker_id: broker.id,
      broker_name: broker.name,
      function_name: "Market Data",
      function_description: "Access real-time market data",
      function_slug: "market_data",
      function_enabled: true,
      is_premium: true
    }
  ];
  
  // Insert functions into the database individually
  for (const func of defaultFunctions) {
    try {
      // Check if function already exists
      const { data: existingFunc, error: checkError } = await supabase
        .from('broker_functionality')
        .select('id')
        .eq('broker_id', func.broker_id)
        .eq('function_slug', func.function_slug)
        .maybeSingle();
        
      if (!checkError && existingFunc) {
        // Update existing function
        await supabase
          .from('broker_functionality')
          .update(func)
          .eq('id', existingFunc.id);
      } else {
        // Insert new function
        await supabase
          .from('broker_functionality')
          .insert(func);
      }
    } catch (error) {
      console.error("Error storing broker function:", error);
    }
  }
  
  // Return the functions with IDs and broker image
  return defaultFunctions.map(func => ({
    ...func,
    id: `${broker.id}-${func.function_slug}`, // Fallback ID if not returned from database
    broker_image: broker.logo
  }));
};

/**
 * Gets function configuration for a broker
 */
export const getBrokerFunctionConfig = async (
  brokerId: number, 
  functionSlug: string
): Promise<any | null> => {
  try {
    // Try to get config from the new brokers_function_configs table
    const { data, error } = await supabase
      .from('brokers_function_configs')
      .select('config_data')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .single();
    
    if (!error && data) {
      return data.config_data;
    }
    
    // Return hardcoded default configs as fallback
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
    // First check if broker exists in brokers_admin table
    const { data: adminData, error: adminError } = await supabase
      .from('brokers_admin')
      .select('required_inputs')
      .eq('id', brokerId)
      .single();
    
    if (!adminError && adminData && adminData.required_inputs) {
      // Parse required inputs from admin table
      let requiredInputs: string[] = [];
      const adminBroker = adminData;
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
    
    // Check broker_details table
    const { data, error } = await supabase
      .from('broker_details')
      .select('required_inputs')
      .eq('id', brokerId)
      .single();
      
    if (!error && data && data.required_inputs) {
      // Parse required inputs from broker_details
      let requiredInputs: string[] = [];
      const brokerDetails = data;
      if (Array.isArray(brokerDetails.required_inputs)) {
        requiredInputs = brokerDetails.required_inputs;
      } else if (typeof brokerDetails.required_inputs === 'string') {
        try {
          requiredInputs = JSON.parse(brokerDetails.required_inputs);
        } catch (e) {
          console.error("Error parsing required_inputs JSON:", e);
        }
      } else if (typeof brokerDetails.required_inputs === 'object') {
        requiredInputs = Object.keys(brokerDetails.required_inputs);
      }
      
      if (requiredInputs.length > 0) {
        return requiredInputs;
      }
    }
    
    // Find the broker from static data as fallback
    const broker = brokers.find(b => b.id === brokerId);
    if (!broker) return [];
    
    // Return broker required inputs
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

/**
 * Synchronizes broker data from broker_details to broker_functionality
 * Call this when broker_details table is updated
 */
export const syncBrokerFunctionsFromDetails = async (): Promise<boolean> => {
  try {
    // Get all brokers from broker_details
    const { data: brokerDetails, error: brokerError } = await supabase
      .from('broker_details')
      .select('*');
      
    if (brokerError || !brokerDetails || brokerDetails.length === 0) {
      console.error("Error fetching broker details:", brokerError);
      return false;
    }
    
    // Also try to get brokers from brokers_admin table
    const { data: adminBrokers, error: adminError } = await supabase
      .from('brokers_admin')
      .select('*');
    
    const allBrokers = [
      ...(brokerDetails || []),
      ...(!adminError && adminBrokers ? adminBrokers : [])
    ];
    
    // Update broker functions for each broker
    for (const broker of allBrokers) {
      const brokerData = {
        id: broker.id,
        name: broker.broker_name,
        logo: broker.image_url
      };
      
      await createAndStoreDefaultFunctions(brokerData);
    }
    
    return true;
  } catch (error) {
    console.error("Error synchronizing broker functionalities:", error);
    return false;
  }
};

/**
 * Synchronizes broker data from broker_details to brokers_admin
 * Call this when broker_details table is updated
 */
export const syncBrokersToAdmin = async (): Promise<boolean> => {
  try {
    // Get all brokers from broker_details
    const { data: brokerDetails, error: brokerError } = await supabase
      .from('broker_details')
      .select('*');
      
    if (brokerError || !brokerDetails || brokerDetails.length === 0) {
      console.error("Error fetching broker details:", brokerError);
      return false;
    }
    
    // For each broker in broker_details, add or update in brokers_admin
    for (const broker of brokerDetails) {
      // Check if broker already exists in brokers_admin
      const { data: existingBroker, error: existingError } = await supabase
        .from('brokers_admin')
        .select('id')
        .eq('id', broker.id);
        
      if (existingError) {
        console.error(`Error checking if broker ${broker.id} exists in admin:`, existingError);
        continue;
      }
      
      if (existingBroker && existingBroker.length > 0) {
        // Update existing broker
        const { error: updateError } = await supabase
          .from('brokers_admin')
          .update({
            broker_name: broker.broker_name,
            description: broker.description,
            image_url: broker.image_url,
            is_active: broker.is_active,
            required_inputs: broker.required_inputs,
            updated_at: new Date().toISOString()
          })
          .eq('id', broker.id);
          
        if (updateError) {
          console.error(`Error updating broker ${broker.id} in admin:`, updateError);
        }
      } else {
        // Insert new broker
        const { error: insertError } = await supabase
          .from('brokers_admin')
          .insert({
            id: broker.id,
            broker_name: broker.broker_name,
            description: broker.description,
            image_url: broker.image_url,
            is_active: broker.is_active,
            required_inputs: broker.required_inputs,
            display_order: broker.id
          });
          
        if (insertError) {
          console.error(`Error inserting broker ${broker.id} into admin:`, insertError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error synchronizing brokers to admin:", error);
    return false;
  }
};
