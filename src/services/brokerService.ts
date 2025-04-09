
import { supabase } from "@/integrations/supabase/client";
import { Broker } from "@/types/broker";
import { brokers as staticBrokers } from "@/components/broker-integration/BrokerData";

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
    return data.map(item => ({
      id: item.id,
      name: item.broker_name,
      description: item.description || "Broker integration",
      logo: item.image_url || "/placeholder.svg",
      apiRequired: (item.required_inputs && item.required_inputs.includes('api_key')) || false,
      requiresSecretKey: (item.required_inputs && item.required_inputs.includes('secret_key')) || false,
      requiredInputs: item.required_inputs || []
    }));
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
      .single();
    
    if (error) {
      console.error("Error fetching broker details:", error);
      // Try to find in static data
      return staticBrokers.find(b => b.id === brokerId) || null;
    }
    
    if (!data) {
      return staticBrokers.find(b => b.id === brokerId) || null;
    }
    
    // Map database broker details to Broker type
    return {
      id: data.id,
      name: data.broker_name,
      description: data.description || "Broker integration",
      logo: data.image_url || "/placeholder.svg",
      apiRequired: (data.required_inputs && data.required_inputs.includes('api_key')) || false,
      requiresSecretKey: (data.required_inputs && data.required_inputs.includes('secret_key')) || false,
      requiredInputs: data.required_inputs || []
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
      .single();
    
    if (error) {
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
