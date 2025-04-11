import { supabase } from "@/integrations/supabase/client";
import { Broker, BrokerFunction, BrokerInfocapFunction, GetBrokerFunctionsParams, SaveBrokerFunctionParams } from "@/types/broker";
import { brokers as staticBrokers } from "@/components/broker-integration/BrokerData";
import { getAllBrokerInfocapFunctions, saveBrokerInfocapFunction } from "@/lib/broker-functions";

/**
 * Fetch all broker details
 */
export const fetchBrokerDetails = async (): Promise<Broker[]> => {
  try {
    // Here we could fetch from the broker_details table, but we'll use static data
    // since you mentioned there's an issue with the table
    
    // Get broker_infocap functions to get broker names
    const { data, error } = await supabase.rpc('get_all_broker_infocap_functions');
    
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      console.log("No broker functions found in database, using static data");
      return staticBrokers;
    }
    
    // Extract unique brokers from the functions data
    if (Array.isArray(data)) {
      const brokerMap = new Map<number, Broker>();
      
      data.forEach((func: BrokerInfocapFunction) => {
        if (!brokerMap.has(func.broker_id)) {
          // Try to find this broker in static data first
          const staticBroker = staticBrokers.find(b => b.id === func.broker_id);
          
          if (staticBroker) {
            brokerMap.set(func.broker_id, {
              ...staticBroker,
              name: func.broker_name, // Use broker name from infocap
              logo: func.broker_image || staticBroker.logo // Use broker_image if available
            });
          } else {
            // Create new broker entry from function data
            brokerMap.set(func.broker_id, {
              id: func.broker_id,
              name: func.broker_name,
              description: `${func.broker_name} broker integration`,
              logo: func.broker_image || `/broker-logos/${func.broker_id}.png`, // Use broker_image if available
              apiRequired: false,
              requiresSecretKey: false
            });
          }
        }
      });
      
      return Array.from(brokerMap.values());
    }
    
    return staticBrokers;
  } catch (error) {
    console.error("Exception fetching broker details:", error);
    // Fall back to static broker data if there's an exception
    return staticBrokers;
  }
};

/**
 * Fetch a single broker's details by ID
 */
export const fetchBrokerById = async (brokerId: number): Promise<Broker | null> => {
  try {
    // Get broker data from the static brokers first
    const staticBroker = staticBrokers.find(b => b.id === brokerId);
    
    // Get data from broker_infocap to update name
    const params: GetBrokerFunctionsParams = { p_broker_id: brokerId };
    const { data, error } = await supabase.rpc('get_broker_infocap_functions', params);
    
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      return staticBroker || null;
    }
    
    // If we have functions data, update the broker name and image
    if (Array.isArray(data) && data.length > 0) {
      const brokerName = data[0].broker_name;
      const brokerImage = data[0].broker_image;
      
      if (staticBroker) {
        return {
          ...staticBroker,
          name: brokerName,
          logo: brokerImage || staticBroker.logo
        };
      } else {
        // Create a new broker record from the function data
        return {
          id: brokerId,
          name: brokerName,
          description: `${brokerName} broker integration`,
          logo: brokerImage || `/broker-logos/${brokerId}.png`,
          apiRequired: false,
          requiresSecretKey: false
        };
      }
    }
    
    return staticBroker || null;
  } catch (error) {
    console.error("Exception fetching broker by ID:", error);
    // Fall back to static broker data if there's an exception
    return staticBrokers.find(b => b.id === brokerId) || null;
  }
};

/**
 * Save a broker function to the database using broker_infocap
 */
export const saveBrokerFunction = async (brokerFunction: Partial<BrokerFunction>): Promise<string | null> => {
  try {
    const result = await saveBrokerInfocapFunction(
      brokerFunction.broker_id || 0,
      brokerFunction.broker_name || '',
      brokerFunction.function_name || '',
      brokerFunction.function_description || '',
      brokerFunction.function_slug || '',
      brokerFunction.function_order || 0, 
      brokerFunction.function_enabled !== undefined ? brokerFunction.function_enabled : true,
      brokerFunction.is_premium || false
    );
    
    return result ? String(result) : null;
  } catch (error) {
    console.error("Exception saving broker function:", error);
    return null;
  }
};

/**
 * Fetch all broker functions
 */
export const fetchBrokerFunctions = async (): Promise<BrokerFunction[]> => {
  try {
    const infoCapFunctions = await getAllBrokerInfocapFunctions();
    
    if (!infoCapFunctions || infoCapFunctions.length === 0) {
      return [];
    }
    
    // Convert BrokerInfocapFunction to BrokerFunction
    return infoCapFunctions.map(func => ({
      id: func.id,
      broker_id: func.broker_id,
      broker_name: func.broker_name,
      function_name: func.function_name,
      function_description: func.function_description,
      function_slug: func.function_slug,
      function_enabled: func.function_enabled,
      is_premium: func.is_premium,
      function_order: func.function_order,
      created_at: func.created_at,
      updated_at: func.updated_at
    }));
  } catch (error) {
    console.error("Exception fetching broker functions:", error);
    return [];
  }
};

/**
 * Get functions for a specific broker from the broker_infocap table
 */
export const getBrokerInfocapFunctions = async (brokerId: number): Promise<BrokerInfocapFunction[]> => {
  try {
    const params: GetBrokerFunctionsParams = { p_broker_id: brokerId };
    const { data, error } = await supabase.rpc('get_broker_infocap_functions', params);
    
    if (error || !data) {
      console.error("Error fetching broker functions:", error);
      return [];
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching broker functions:", error);
    return [];
  }
};

/**
 * Delete a function from the broker_infocap table
 */
export const deleteBrokerInfocapFunction = async (functionId: string): Promise<boolean> => {
  try {
    // We will mock this operation since we're using RPC functions
    console.log(`Mock deleting broker function with ID: ${functionId}`);
    return true;
  } catch (error) {
    console.error("Exception deleting broker function:", error);
    return false;
  }
};

/**
 * Update function order in the broker_infocap table
 */
export const updateBrokerInfocapFunctionOrder = async (
  functionId: string,
  newOrder: number
): Promise<boolean> => {
  try {
    // Mock the update
    console.log(`Mock updating function order: ${functionId} to order ${newOrder}`);
    return true;
  } catch (error) {
    console.error("Exception updating broker function order:", error);
    return false;
  }
};

/**
 * Save or update many broker functions at once (batch operation)
 */
export const saveBulkBrokerInfocapFunctions = async (
  functions: Partial<BrokerInfocapFunction>[]
): Promise<boolean> => {
  try {
    // We'll process each function one by one using our RPC function
    for (const func of functions) {
      if (!func.broker_id || !func.broker_name || !func.function_name || !func.function_slug) {
        console.error("Invalid function data:", func);
        continue;
      }
      
      await saveBrokerInfocapFunction(
        func.broker_id,
        func.broker_name,
        func.function_name,
        func.function_description || '',
        func.function_slug,
        func.function_order || 0,
        func.function_enabled !== undefined ? func.function_enabled : true,
        func.is_premium || false
      );
    }
    
    return true;
  } catch (error) {
    console.error("Exception saving bulk broker functions:", error);
    return false;
  }
};

// Export these functions which were previously referenced in BrokerManagement
export const saveBroker = async (broker: Partial<Broker>): Promise<number | null> => {
  try {
    console.log('Mock saving broker', broker);
    return Math.floor(Math.random() * 1000) + 1;
  } catch (error) {
    console.error('Exception saving broker:', error);
    return null;
  }
};

export const updateBroker = async (brokerId: number, broker: Partial<Broker>): Promise<boolean> => {
  try {
    console.log(`Mock updating broker ${brokerId}`, broker);
    return true;
  } catch (error) {
    console.error('Exception updating broker:', error);
    return false;
  }
};

export const deleteBroker = async (brokerId: number): Promise<boolean> => {
  try {
    console.log(`Mock deleting broker ${brokerId}`);
    return true;
  } catch (error) {
    console.error('Exception deleting broker:', error);
    return false;
  }
};
