
import { supabase } from "@/lib/supabase/client";
import { Broker, BrokerDetail } from "@/types/broker";
import { brokers as staticBrokers } from "@/components/broker-integration/BrokerData";
import { uploadBrokerImage } from "@/utils/brokerImageUtils";
import { syncBrokersToAdmin } from "@/lib/broker-functions";

/**
 * Fetch all broker details from the database, with NO CACHING to ensure latest data
 */
export const fetchBrokerDetails = async (timestamp?: number): Promise<Broker[]> => {
  try {
    // Generate a unique timestamp to prevent caching at all levels if not provided
    const cacheKey = timestamp || new Date().getTime();
    
    console.log(`Fetching broker details from database with force refresh (cache key: ${cacheKey})`);
    
    // First try to fetch from brokers_admin table
    const { data: adminData, error: adminError } = await supabase
      .from('brokers_admin')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (!adminError && adminData && adminData.length > 0) {
      console.log(`Found ${adminData.length} broker details in brokers_admin table at ${new Date().toLocaleTimeString()}:`, adminData);
      // Map broker_admin data to Broker type
      return adminData.map((item: any) => {
        let requiredInputs: string[] = [];
        
        if (item.required_inputs) {
          if (Array.isArray(item.required_inputs)) {
            requiredInputs = item.required_inputs;
          } else if (typeof item.required_inputs === 'string') {
            try {
              requiredInputs = JSON.parse(item.required_inputs);
            } catch (e) {
              console.error("Error parsing required_inputs JSON:", e);
            }
          } else if (typeof item.required_inputs === 'object') {
            requiredInputs = Object.keys(item.required_inputs);
          }
        }

        return {
          id: item.id,
          name: item.broker_name,
          description: item.description || "Broker integration",
          logo: `${item.image_url || "/placeholder.svg"}?t=${cacheKey}`, // Add cache-busting parameter
          supportedAssets: item.supported_assets || [],
          fees: item.fees || "",
          apiRequired: requiredInputs.includes('api_key'),
          requiresSecretKey: requiredInputs.includes('secret_key'),
          requiredInputs: requiredInputs
        };
      });
    }
    
    // Fallback to broker_details table
    const { data, error } = await supabase
      .from('broker_details')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });
    
    if (error) {
      console.error("Error fetching broker details:", error);
      // Fall back to static broker data if database query fails
      return staticBrokers;
    }
    
    if (!data || data.length === 0) {
      console.log("No broker details found in database, using static data");
      return staticBrokers;
    }
    
    // Sync broker data to admin table in the background
    syncBrokersToAdmin().catch(err => console.error("Error syncing brokers to admin:", err));
    
    // Map database broker details to Broker type
    return data.map((item: any) => {
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
        logo: `${item.image_url || "/placeholder.svg"}?t=${cacheKey}`, // Add cache-busting parameter
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
 * Fetch a single broker's details by ID with no caching
 */
export const fetchBrokerById = async (brokerId: number): Promise<Broker | null> => {
  try {
    // Add cache-busting timestamp
    const cacheKey = new Date().getTime();
    console.log(`Fetching broker with ID ${brokerId} (cache key: ${cacheKey})`);
    
    // First try to fetch from brokers_admin table
    const { data: adminData, error: adminError } = await supabase
      .from('brokers_admin')
      .select('*')
      .eq('id', brokerId)
      .maybeSingle();
    
    if (!adminError && adminData) {
      console.log("Found broker in brokers_admin table:", adminData);
      
      // Handle the required_inputs field
      let requiredInputs: string[] = [];
      
      if (adminData.required_inputs) {
        if (Array.isArray(adminData.required_inputs)) {
          requiredInputs = adminData.required_inputs;
        } else if (typeof adminData.required_inputs === 'string' && adminData.required_inputs.startsWith('[')) {
          try {
            requiredInputs = JSON.parse(adminData.required_inputs);
          } catch (e) {
            console.error("Error parsing required_inputs JSON:", e);
          }
        } else if (typeof adminData.required_inputs === 'object') {
          requiredInputs = Object.keys(adminData.required_inputs);
        }
      }
      
      return {
        id: adminData.id,
        name: adminData.broker_name,
        description: adminData.description || "Broker integration",
        logo: `${adminData.image_url || "/placeholder.svg"}?t=${cacheKey}`, // Add cache-busting parameter
        supportedAssets: adminData.supported_assets || [],
        fees: adminData.fees || "",
        apiRequired: requiredInputs.includes('api_key'),
        requiresSecretKey: requiredInputs.includes('secret_key'),
        requiredInputs: requiredInputs
      };
    }

    // Fallback to broker_details table
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
        requiredInputs = Object.keys(data.required_inputs);
      }
    }
    
    // Map database broker details to Broker type
    return {
      id: data.id,
      name: data.broker_name,
      description: data.description || "Broker integration",
      logo: `${data.image_url || "/placeholder.svg"}?t=${cacheKey}`, // Add cache-busting parameter
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
    // First try to save to brokers_admin table
    let tableTarget = 'brokers_admin';
    
    // Convert required inputs to proper format
    const requiredInputs = broker.requiredInputs || [];
    
    const result = await supabase
      .from(tableTarget)
      .insert({
        broker_name: broker.name,
        description: broker.description,
        image_url: broker.logo,
        required_inputs: requiredInputs,
        supported_assets: broker.supportedAssets,
        fees: broker.fees
      });
      
    const selectResult = await result.select('id');
    
    if (selectResult.error || !selectResult.data || selectResult.data.length === 0) {
      console.error(`Error inserting broker to ${tableTarget}:`, selectResult.error);
      
      // Fallback to broker_details table
      tableTarget = 'broker_details';
      const fallbackResponse = await supabase
        .from(tableTarget)
        .insert({
          broker_name: broker.name,
          description: broker.description,
          image_url: broker.logo,
          required_inputs: requiredInputs
        });
        
      const fallbackSelect = await fallbackResponse.select('id');
        
      if (fallbackSelect.error || !fallbackSelect.data || fallbackSelect.data.length === 0) {
        console.error(`Error inserting broker to ${tableTarget}:`, fallbackSelect.error);
        return null;
      }
      
      return fallbackSelect.data[0]?.id || null;
    }
    
    return selectResult.data[0]?.id || null;
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
    // First try to update in brokers_admin table
    let tableTarget = 'brokers_admin';
    
    // Convert required inputs to proper format
    const requiredInputs = broker.requiredInputs || [];
    
    const response = await supabase
      .from(tableTarget)
      .update({
        broker_name: broker.name,
        description: broker.description,
        image_url: broker.logo,
        required_inputs: requiredInputs,
        supported_assets: broker.supportedAssets,
        fees: broker.fees
      });
      
    const { error } = await response.eq('id', brokerId);
    
    if (error) {
      console.error(`Error updating broker in ${tableTarget}:`, error);
      
      // Fallback to broker_details table
      tableTarget = 'broker_details';
      const fallbackResponse = await supabase
        .from(tableTarget)
        .update({
          broker_name: broker.name,
          description: broker.description,
          image_url: broker.logo,
          required_inputs: requiredInputs
        });
        
      const fallbackResult = await fallbackResponse.eq('id', brokerId);
        
      if (fallbackResult.error) {
        console.error(`Error updating broker in ${tableTarget}:`, fallbackResult.error);
        return false;
      }
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
    // First try to delete from brokers_admin table
    let tableTarget = 'brokers_admin';
    
    const response = await supabase
      .from(tableTarget)
      .delete();
      
    const deleteResult = await response.eq('id', brokerId);
    
    if (deleteResult.error) {
      console.error(`Error deleting broker from ${tableTarget}:`, deleteResult.error);
      
      // Fallback to broker_details table
      tableTarget = 'broker_details';
      const fallbackResponse = await supabase
        .from(tableTarget)
        .delete();
        
      const fallbackResult = await fallbackResponse.eq('id', brokerId);
        
      if (fallbackResult.error) {
        console.error(`Error deleting broker from ${tableTarget}:`, fallbackResult.error);
        return false;
      }
    }
    
    // Also delete from brokers_functions table
    const { error: funcError } = await supabase
      .from('brokers_functions')
      .delete()
      .eq('broker_id', brokerId);
      
    if (funcError) {
      console.error(`Error deleting broker functions for broker ${brokerId}:`, funcError);
    }
    
    // Also delete from brokers_function_configs table
    const { error: configError } = await supabase
      .from('brokers_function_configs')
      .delete()
      .eq('broker_id', brokerId);
      
    if (configError) {
      console.error(`Error deleting broker function configs for broker ${brokerId}:`, configError);
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting broker:", error);
    return false;
  }
};

/**
 * Delete all brokers from the database
 */
export const deleteAllBrokers = async (): Promise<boolean> => {
  try {
    // First try to delete from brokers_admin table
    let tableTarget = 'brokers_admin';
    
    const response = await supabase
      .from(tableTarget)
      .delete();
      
    const deleteResult = await response.gte('id', 0);
    
    if (deleteResult.error) {
      console.error(`Error deleting all brokers from ${tableTarget}:`, deleteResult.error);
      
      // Fallback to broker_details table
      tableTarget = 'broker_details';
      const fallbackResponse = await supabase
        .from(tableTarget)
        .delete();
        
      const fallbackResult = await fallbackResponse.gte('id', 0);
        
      if (fallbackResult.error) {
        console.error(`Error deleting all brokers from ${tableTarget}:`, fallbackResult.error);
        return false;
      }
    }
    
    // Also delete from brokers_functions and brokers_function_configs tables
    await supabase.from('brokers_functions').delete().gte('broker_id', 0);
    await supabase.from('brokers_function_configs').delete().gte('broker_id', 0);
    
    console.log(`All broker details have been deleted successfully from ${tableTarget}`);
    return true;
  } catch (error) {
    console.error("Exception deleting all brokers:", error);
    return false;
  }
};

/**
 * Fetch all broker details from the database
 */
export const fetchBrokerDetailsOld = async (): Promise<BrokerDetail[]> => {
  try {
    const { data, error } = await supabase
      .from('broker_details')
      .select('*');
    
    if (error) {
      console.error("Error fetching broker details:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception fetching broker details:", error);
    return [];
  }
};
