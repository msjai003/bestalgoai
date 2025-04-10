
import { supabase } from "@/integrations/supabase/client";
import { Broker, BrokerDetail, BrokerFunction, BrokerInfocapFunction } from "@/types/broker";
import { brokers as staticBrokers } from "@/components/broker-integration/BrokerData";
import { uploadBrokerImage } from "@/utils/brokerImageUtils";

/**
 * Fetch all broker details from the database
 */
export const fetchBrokerDetails = async (): Promise<Broker[]> => {
  try {
    const { data, error } = await supabase
      .from('broker_details')
      .select('*')
      .eq('is_active', true);
    
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
    if (Array.isArray(data)) {
      return data.map((item: BrokerDetail) => {
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
            requiredInputs = Object.keys(item.required_inputs as object);
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
    const { data, error } = await supabase
      .from('broker_details')
      .select('*')
      .eq('id', brokerId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching broker details:", error);
      // Try to find in static data
      return staticBrokers.find(b => b.id === brokerId) || null;
    }
    
    if (!data) {
      return staticBrokers.find(b => b.id === brokerId) || null;
    }
    
    // Handle the required_inputs field which can be JSON or an array
    let requiredInputs: string[] = [];
    
    if (data.required_inputs) {
      // If it's already an array, use it directly
      if (Array.isArray(data.required_inputs)) {
        requiredInputs = data.required_inputs;
      } 
      // If it's a JSON string, parse it
      else if (typeof data.required_inputs === 'string' && data.required_inputs.startsWith('[')) {
        try {
          requiredInputs = JSON.parse(data.required_inputs);
        } catch (e) {
          console.error("Error parsing required_inputs JSON:", e);
        }
      }
      // If it's an object with key-value pairs, extract the keys
      else if (typeof data.required_inputs === 'object') {
        requiredInputs = Object.keys(data.required_inputs as object);
      }
    }
    
    // Map database broker details to Broker type
    return {
      id: data.id,
      name: data.broker_name,
      description: data.description || "Broker integration",
      logo: data.image_url || "/placeholder.svg",
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
      .select('id')
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error saving broker:", error);
      return null;
    }
    
    return data.id;
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
      0, // Default order
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
      created_at: func.created_at,
      updated_at: func.updated_at
    }));
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
    
    return typeof data === 'number' ? data : null;
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

/**
 * Get functions for a specific broker from the broker_infocap table
 */
export const getBrokerInfocapFunctions = async (brokerId: number): Promise<BrokerInfocapFunction[]> => {
  try {
    const { data, error } = await supabase.rpc('get_broker_infocap_functions', {
      p_broker_id: brokerId
    });
    
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
    const { error } = await supabase
      .from('broker_infocap')
      .delete()
      .eq('id', functionId);
    
    if (error) {
      console.error("Error deleting broker function:", error);
      return false;
    }
    
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
    const { error } = await supabase
      .from('broker_infocap')
      .update({ function_order: newOrder, updated_at: new Date() })
      .eq('id', functionId);
    
    if (error) {
      console.error("Error updating broker function order:", error);
      return false;
    }
    
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
