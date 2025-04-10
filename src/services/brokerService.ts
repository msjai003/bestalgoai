
import { supabase } from "@/integrations/supabase/client";
import { Broker, BrokerDetail } from "@/types/broker";
import { brokers as staticBrokers } from "@/components/broker-integration/BrokerData";

/**
 * Fetches all broker details from Supabase database
 * @param cacheTimestamp Optional timestamp for cache busting
 * @returns Array of Broker objects
 */
export const fetchBrokerDetails = async (cacheTimestamp?: number): Promise<Broker[]> => {
  try {
    console.log(`Fetching broker details at ${new Date().toISOString()}`);
    
    // First try to get brokers from brokers_admin table (primary source)
    const { data: adminBrokers, error: adminError } = await supabase
      .from('brokers_admin')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!adminError && adminBrokers && adminBrokers.length > 0) {
      console.log(`Found ${adminBrokers.length} brokers in brokers_admin table`);
      
      // Map the database results to the Broker type
      return adminBrokers.map(broker => ({
        id: broker.id,
        name: broker.broker_name,
        description: broker.description || '',
        logo: broker.image_url || '/placeholder.svg',
        supportedAssets: broker.supported_assets || [],
        fees: broker.fees || '',
        apiRequired: broker.required_inputs ? 
          (Array.isArray(broker.required_inputs) && broker.required_inputs.includes('apiKey')) || 
          (typeof broker.required_inputs === 'object' && 'apiKey' in broker.required_inputs) : 
          false,
        requiredInputs: Array.isArray(broker.required_inputs) ? 
          broker.required_inputs.map(input => String(input)) : 
          (broker.required_inputs ? Object.keys(broker.required_inputs) : [])
      }));
    }
    
    // If no results from brokers_admin, try broker_details table (fallback)
    const { data: brokerDetails, error: detailsError } = await supabase
      .from('broker_details')
      .select('*');
      
    if (!detailsError && brokerDetails && brokerDetails.length > 0) {
      console.log(`Found ${brokerDetails.length} brokers in broker_details table`);
      
      // Map the database results to the Broker type
      return brokerDetails.map(broker => ({
        id: broker.id,
        name: broker.broker_name,
        description: broker.description || '',
        logo: broker.image_url || '/placeholder.svg',
        apiRequired: broker.required_inputs ? 
          (Array.isArray(broker.required_inputs) && broker.required_inputs.includes('apiKey')) || 
          (typeof broker.required_inputs === 'object' && 'apiKey' in broker.required_inputs) : 
          false,
        requiredInputs: Array.isArray(broker.required_inputs) ? 
          broker.required_inputs.map(input => String(input)) : 
          (broker.required_inputs ? Object.keys(broker.required_inputs) : [])
      }));
    }
    
    // Fall back to static data if no database results
    console.log('No broker data in database, using static data');
    return staticBrokers;
  } catch (error) {
    console.error('Error fetching broker details:', error);
    return staticBrokers;
  }
};

/**
 * Fetches a single broker by ID
 * @param brokerId The ID of the broker to fetch
 * @param cacheTimestamp Optional timestamp for cache busting
 * @returns A Broker object or null if not found
 */
export const fetchBrokerById = async (brokerId: number, cacheTimestamp?: number): Promise<Broker | null> => {
  try {
    console.log(`Fetching broker with ID ${brokerId}`);
    
    // First try to get broker from brokers_admin table (primary source)
    const { data: adminBroker, error: adminError } = await supabase
      .from('brokers_admin')
      .select('*')
      .eq('id', brokerId)
      .single();
      
    if (!adminError && adminBroker) {
      console.log(`Found broker in brokers_admin table: ${adminBroker.broker_name}`);
      
      // Map the database result to the Broker type
      return {
        id: adminBroker.id,
        name: adminBroker.broker_name,
        description: adminBroker.description || '',
        logo: adminBroker.image_url || '/placeholder.svg',
        supportedAssets: adminBroker.supported_assets || [],
        fees: adminBroker.fees || '',
        apiRequired: adminBroker.required_inputs ? 
          (Array.isArray(adminBroker.required_inputs) && adminBroker.required_inputs.includes('apiKey')) || 
          (typeof adminBroker.required_inputs === 'object' && 'apiKey' in adminBroker.required_inputs) : 
          false,
        requiredInputs: Array.isArray(adminBroker.required_inputs) ? 
          adminBroker.required_inputs.map(input => String(input)) : 
          (adminBroker.required_inputs ? Object.keys(adminBroker.required_inputs) : [])
      };
    }
    
    // If not found in brokers_admin, try broker_details table (fallback)
    const { data: brokerDetail, error: detailError } = await supabase
      .from('broker_details')
      .select('*')
      .eq('id', brokerId)
      .single();
      
    if (!detailError && brokerDetail) {
      console.log(`Found broker in broker_details table: ${brokerDetail.broker_name}`);
      
      // Map the database result to the Broker type
      return {
        id: brokerDetail.id,
        name: brokerDetail.broker_name,
        description: brokerDetail.description || '',
        logo: brokerDetail.image_url || '/placeholder.svg',
        apiRequired: brokerDetail.required_inputs ? 
          (Array.isArray(brokerDetail.required_inputs) && brokerDetail.required_inputs.includes('apiKey')) || 
          (typeof brokerDetail.required_inputs === 'object' && 'apiKey' in brokerDetail.required_inputs) : 
          false,
        requiredInputs: Array.isArray(brokerDetail.required_inputs) ? 
          brokerDetail.required_inputs.map(input => String(input)) : 
          (brokerDetail.required_inputs ? Object.keys(brokerDetail.required_inputs) : [])
      };
    }
    
    // Fall back to static data if not found in database
    console.log(`Broker not found in database, checking static data`);
    const staticBroker = staticBrokers.find(b => b.id === brokerId);
    
    if (staticBroker) {
      console.log(`Found broker in static data: ${staticBroker.name}`);
      return staticBroker;
    }
    
    // Return null if broker not found anywhere
    console.log(`Broker not found`);
    return null;
  } catch (error) {
    console.error(`Error fetching broker with ID ${brokerId}:`, error);
    
    // Fall back to static data if there's an error
    const staticBroker = staticBrokers.find(b => b.id === brokerId);
    return staticBroker || null;
  }
};

/**
 * Save a new broker to the database
 * @param brokerData The broker data to save
 * @returns The ID of the newly created broker, or null on failure
 */
export const saveBroker = async (brokerData: Partial<Broker>): Promise<number | null> => {
  try {
    // Prepare the data for insertion
    const brokerEntry = {
      broker_name: brokerData.name,
      description: brokerData.description,
      image_url: brokerData.logo,
      required_inputs: brokerData.requiredInputs,
      is_active: true
    };

    // Insert into broker_details table
    const { data, error } = await supabase
      .from('broker_details')
      .insert(brokerEntry)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving broker:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error saving broker:', error);
    return null;
  }
};

/**
 * Update an existing broker in the database
 * @param brokerId The ID of the broker to update
 * @param brokerData The updated broker data
 * @returns Boolean indicating success or failure
 */
export const updateBroker = async (brokerId: number, brokerData: Partial<Broker>): Promise<boolean> => {
  try {
    // Prepare the data for update
    const brokerEntry = {
      broker_name: brokerData.name,
      description: brokerData.description,
      image_url: brokerData.logo,
      required_inputs: brokerData.requiredInputs,
      updated_at: new Date().toISOString()
    };

    // First try to update in brokers_admin table
    const { error: adminError } = await supabase
      .from('brokers_admin')
      .update(brokerEntry)
      .eq('id', brokerId);

    if (!adminError) {
      console.log(`Updated broker in brokers_admin table`);
      return true;
    }

    // If not in admin table or error occurred, try broker_details table
    const { error } = await supabase
      .from('broker_details')
      .update(brokerEntry)
      .eq('id', brokerId);

    if (error) {
      console.error('Error updating broker:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating broker:', error);
    return false;
  }
};

/**
 * Delete a broker from the database
 * @param brokerId The ID of the broker to delete
 * @returns Boolean indicating success or failure
 */
export const deleteBroker = async (brokerId: number): Promise<boolean> => {
  try {
    // First try to delete from broker_functionality table to avoid foreign key constraints
    await supabase
      .from('broker_functionality')
      .delete()
      .eq('broker_id', brokerId);

    // Then try to delete from brokers_function_configs table
    await supabase
      .from('brokers_function_configs')
      .delete()
      .eq('broker_id', brokerId);
    
    // First try to delete from brokers_admin table
    const { error: adminError } = await supabase
      .from('brokers_admin')
      .delete()
      .eq('id', brokerId);
    
    if (!adminError) {
      console.log(`Deleted broker from brokers_admin table`);
    }

    // Also try to delete from broker_details table
    const { error } = await supabase
      .from('broker_details')
      .delete()
      .eq('id', brokerId);

    if (error && adminError) {
      console.error('Error deleting broker:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting broker:', error);
    return false;
  }
};
