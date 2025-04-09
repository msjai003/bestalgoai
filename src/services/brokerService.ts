import { supabase } from "@/lib/supabase/client";
import { Broker, BrokerDetail } from "@/types/broker";
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
    
    if (!data || data.length === 0) {
      console.log("No broker details found in database, using static data");
      return staticBrokers;
    }
    
    // Map database broker details to Broker type
    return data.map((item) => {
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
    // Insert the new broker
    const insertResponse = await supabase
      .from('broker_details')
      .insert({
        broker_name: broker.name,
        description: broker.description,
        image_url: broker.logo,
        required_inputs: broker.requiredInputs || []
      });
    
    if (insertResponse.error) {
      console.error("Error inserting broker:", insertResponse.error);
      return null;
    }
    
    // Get the ID of the newly inserted broker
    const response = await supabase
      .from('broker_details')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    if (response.error || !response.data || response.data.length === 0) {
      console.error("Error retrieving broker ID:", response.error);
      return null;
    }
    
    return response.data[0].id;
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
    const updateResponse = await supabase
      .from('broker_details')
      .update({
        broker_name: broker.name,
        description: broker.description,
        image_url: broker.logo,
        required_inputs: broker.requiredInputs || []
      });
    
    if (updateResponse.error) {
      console.error("Error updating broker:", updateResponse.error);
      return false;
    }
    
    // Need to add the filter after the update
    const filterResponse = await supabase
      .from('broker_details')
      .update({}) // Empty update as we just need to filter
      .eq('id', brokerId);
    
    if (filterResponse.error) {
      console.error("Error applying filter after update:", filterResponse.error);
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
    const deleteResponse = await supabase
      .from('broker_details')
      .delete();
    
    if (deleteResponse.error) {
      console.error("Error in delete operation:", deleteResponse.error);
      return false;
    }
    
    // Apply the filter after the delete operation
    const filterResponse = await supabase
      .from('broker_details')
      .delete()
      .eq('id', brokerId);
    
    if (filterResponse.error) {
      console.error("Error deleting broker:", filterResponse.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting broker:", error);
    return false;
  }
};
