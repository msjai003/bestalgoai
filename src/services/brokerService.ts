
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
    const { error } = await supabase
      .from('broker_details')
      .insert({
        broker_name: broker.name,
        description: broker.description,
        image_url: broker.logo,
        required_inputs: broker.requiredInputs || []
      });
    
    if (error) {
      console.error("Error inserting broker:", error);
      return null;
    }
    
    // Get the ID of the newly inserted broker
    const { data: queryData, error: selectError } = await supabase
      .from('broker_details')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    if (selectError || !queryData || queryData.length === 0) {
      console.error("Error retrieving broker ID:", selectError);
      return null;
    }
    
    return queryData[0].id;
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
    // Fix: Correcting the query chain structure
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
    // Fix: Correcting the query chain structure
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
 * Delete all brokers from the database
 */
export const deleteAllBrokers = async (): Promise<boolean> => {
  try {
    // Fix: Correcting the query chain structure
    const { error } = await supabase
      .from('broker_details')
      .delete()
      .gte('id', 0); // Delete all rows with ID >= 0 (which should be all of them)
    
    if (error) {
      console.error("Error deleting all brokers:", error);
      return false;
    }
    
    console.log("All broker details have been deleted successfully");
    return true;
  } catch (error) {
    console.error("Exception deleting all brokers:", error);
    return false;
  }
};
