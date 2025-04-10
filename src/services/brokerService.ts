
import { supabase } from "@/lib/supabase/client";
import { Broker, BrokerDetail, BrokerFunction, BrokerInfocapFunction } from "@/types/broker";
import { brokers as staticBrokers } from "@/components/broker-integration/BrokerData";
import { uploadBrokerImage } from "@/utils/brokerImageUtils";

/**
 * Fetch all broker details from the database
 */
export const fetchBrokerDetails = async (): Promise<Broker[]> => {
  try {
    // Use RPC function to get broker details
    const { data, error } = await supabase.rpc('get_all_broker_details');
    
    if (error) {
      console.error("Error fetching broker details:", error);
      // Fall back to static broker data if database query fails
      return staticBrokers;
    }
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log("No broker details found in database, using static data");
      return staticBrokers;
    }
    
    // Map database broker details to Broker type
    return (data as any[]).map((item) => {
      // Handle the required_inputs field which can be JSON or an array
      let requiredInputs: string[] = [];
      
      if (item.required_inputs) {
        // If it's already an array, use it directly
        if (Array.isArray(item.required_inputs)) {
          requiredInputs = item.required_inputs;
        } 
        // If it's a JSON string, parse it
        else if (typeof item.required_inputs === 'string' && item.required_inputs.startsWith('[')) {
          try {
            requiredInputs = JSON.parse(item.required_inputs);
          } catch (e) {
            console.error("Error parsing required_inputs JSON:", e);
          }
        }
        // If it's an object with key-value pairs, extract the keys
        else if (typeof item.required_inputs === 'object') {
          requiredInputs = Object.keys(item.required_inputs);
        }
      }

      return {
        id: item.id,
        name: item.broker_name,
        description: item.description || "Broker integration",
        logo: item.image_url || "/placeholder.svg",
        apiRequired: requiredInputs.includes('api_key'),
        requiresSecretKey: requiredInputs.includes('secret_key'),
        requiredInputs: requiredInputs
      };
    });
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
    // Use RPC function to get broker details by ID
    const { data, error } = await supabase.rpc('get_broker_details', {
      p_broker_id: brokerId
    });
    
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      console.error("Error fetching broker details:", error);
      // Try to find in static data
      return staticBrokers.find(b => b.id === brokerId) || null;
    }
    
    const item = Array.isArray(data) ? data[0] : data;
    
    // Handle the required_inputs field which can be JSON or an array
    let requiredInputs: string[] = [];
    
    if (item.required_inputs) {
      // If it's already an array, use it directly
      if (Array.isArray(item.required_inputs)) {
        requiredInputs = item.required_inputs;
      } 
      // If it's a JSON string, parse it
      else if (typeof item.required_inputs === 'string' && item.required_inputs.startsWith('[')) {
        try {
          requiredInputs = JSON.parse(item.required_inputs);
        } catch (e) {
          console.error("Error parsing required_inputs JSON:", e);
        }
      }
      // If it's an object with key-value pairs, extract the keys
      else if (typeof item.required_inputs === 'object') {
        requiredInputs = Object.keys(item.required_inputs);
      }
    }
    
    // Map database broker details to Broker type
    return {
      id: item.id,
      name: item.broker_name,
      description: item.description || "Broker integration",
      logo: item.image_url || "/placeholder.svg",
      apiRequired: requiredInputs.includes('api_key'),
      requiresSecretKey: requiredInputs.includes('secret_key'),
      requiredInputs: requiredInputs
    };
  } catch (error) {
    console.error("Exception fetching broker by ID:", error);
    // Fall back to static broker data if there's an exception
    return staticBrokers.find(b => b.id === brokerId) || null;
  }
};

/**
 * Save a broker to the database
 */
export const saveBroker = async (broker: Partial<Broker>): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('broker_details')
      .insert({
        broker_name: broker.name,
        description: broker.description,
        image_url: broker.logo,
        required_inputs: broker.requiredInputs || []
      })
      .select();
    
    if (error) {
      console.error("Error saving broker:", error);
      return null;
    }
    
    const result = Array.isArray(data) ? data[0] : data;
    return result?.id || null;
  } catch (error) {
    console.error("Exception saving broker:", error);
    return null;
  }
};

/**
 * Update an existing broker
 */
export const updateBroker = async (brokerId: number, broker: Partial<Broker>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_details')
      .update({
        broker_name: broker.name,
        description: broker.description,
        image_url: broker.logo,
        required_inputs: broker.requiredInputs || []
      })
      .eq('id', brokerId);
    
    if (error) {
      console.error("Error updating broker:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating broker:", error);
    return false;
  }
};

/**
 * Delete a broker
 */
export const deleteBroker = async (brokerId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_details')
      .delete()
      .eq('id', brokerId);
    
    if (error) {
      console.error("Error deleting broker:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting broker:", error);
    return false;
  }
};

/**
 * Save a broker function to the database
 */
export const saveBrokerFunction = async (brokerFunction: Partial<BrokerFunction>): Promise<string | null> => {
  try {
    // Use RPC function instead of direct table access
    const { data, error } = await supabase.rpc('save_broker_function', {
      p_broker_id: brokerFunction.broker_id,
      p_broker_name: brokerFunction.broker_name,
      p_function_name: brokerFunction.function_name,
      p_function_description: brokerFunction.function_description || '',
      p_function_slug: brokerFunction.function_slug,
      p_function_enabled: brokerFunction.function_enabled || true,
      p_is_premium: brokerFunction.is_premium || false,
      p_broker_image: brokerFunction.broker_image || ''
    });
    
    if (error) {
      console.error("Error saving broker function:", error);
      return null;
    }
    
    return data as string;
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
    // Use RPC function instead of direct table access
    const { data, error } = await supabase.rpc('get_all_broker_functions');
    
    if (error) {
      console.error("Error fetching broker functions:", error);
      return [];
    }
    
    return data as BrokerFunction[];
  } catch (error) {
    console.error("Exception fetching broker functions:", error);
    return [];
  }
};

/**
 * Save a broker function to the broker_infocap table
 */
export const saveBrokerInfocapFunction = async (
  brokerId: number,
  brokerName: string,
  functionName: string,
  functionDescription: string | null,
  functionSlug: string,
  functionOrder: number,
  isEnabled: boolean = true,
  isPremium: boolean = false
): Promise<number | null> => {
  try {
    const { data, error } = await supabase.rpc('save_broker_infocap_function', {
      p_broker_id: brokerId,
      p_broker_name: brokerName,
      p_function_name: functionName,
      p_function_description: functionDescription || '',
      p_function_slug: functionSlug,
      p_function_order: functionOrder,
      p_function_enabled: isEnabled,
      p_is_premium: isPremium
    });
    
    if (error) {
      console.error("Error saving broker function:", error);
      return null;
    }
    
    return data as number;
  } catch (error) {
    console.error("Exception saving broker function:", error);
    return null;
  }
};

/**
 * Get all functions from the broker_infocap table
 */
export const getAllBrokerInfocapFunctions = async (): Promise<BrokerInfocapFunction[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_broker_infocap_functions');
    
    if (error) {
      console.error("Error fetching all broker functions:", error);
      return [];
    }
    
    return data as BrokerInfocapFunction[];
  } catch (error) {
    console.error("Exception fetching all broker functions:", error);
    return [];
  }
};

/**
 * Get functions for a specific broker from the broker_infocap table
 */
export const getBrokerInfocapFunctions = async (brokerId: number): Promise<BrokerInfocapFunction[]> => {
  try {
    const { data, error } = await supabase.rpc('get_broker_infocap_functions', {
      p_broker_id: brokerId
    });
    
    if (error) {
      console.error("Error fetching broker functions:", error);
      return [];
    }
    
    return data as BrokerInfocapFunction[];
  } catch (error) {
    console.error("Exception fetching broker functions:", error);
    return [];
  }
};

/**
 * Delete a function from the broker_infocap table
 */
export const deleteBrokerInfocapFunction = async (functionId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('delete_broker_infocap_function', {
      p_function_id: functionId
    });
    
    if (error) {
      console.error("Error deleting broker function:", error);
      return false;
    }
    
    return data as boolean;
  } catch (error) {
    console.error("Exception deleting broker function:", error);
    return false;
  }
};

/**
 * Update function order in the broker_infocap table
 */
export const updateBrokerInfocapFunctionOrder = async (
  functionId: number,
  newOrder: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('update_broker_infocap_function_order', {
      p_function_id: functionId,
      p_new_order: newOrder
    });
    
    if (error) {
      console.error("Error updating broker function order:", error);
      return false;
    }
    
    return data as boolean;
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
        func.function_description || null,
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
