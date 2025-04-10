
import { BrokerFunction } from '@/hooks/strategy/types';
import { brokers } from '@/components/broker-integration/BrokerData';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches all functions for a specific broker from the brokers_sections table
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  try {
    const { data, error } = await supabase
      .from('brokers_sections')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('function_enabled', true);
    
    if (error || !data) {
      console.error("Error fetching broker functions:", error);
      return [];
    }
    
    return data.map(item => ({
      id: `${item.broker_id}-${item.function_slug}`,
      broker_id: item.broker_id,
      broker_name: item.broker_name,
      function_name: item.function_name,
      function_description: item.function_description || '',
      function_slug: item.function_slug,
      function_enabled: item.function_enabled,
      is_premium: item.is_premium,
      broker_image: item.broker_image,
      configuration: item.configuration
    }));
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
    const { data, error } = await supabase
      .from('brokers_sections')
      .select('id')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .eq('function_enabled', true);
    
    if (error) {
      console.error("Error checking broker function:", error);
      return false;
    }
    
    return data && data.length > 0;
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
    const { data, error } = await supabase
      .from('brokers_sections')
      .select('is_premium')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .eq('function_enabled', true)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error checking if broker function is premium:", error);
      return false;
    }
    
    return !!data.is_premium;
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
    // Try to fetch from database using the broker_details table directly
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
 * Gets function configuration for a broker
 */
export const getBrokerFunctionConfig = async (
  brokerId: number, 
  functionSlug: string
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('brokers_sections')
      .select('configuration')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .eq('function_enabled', true)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error getting broker function config:", error);
      return null;
    }
    
    return data.configuration;
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
    const { data, error } = await supabase
      .from('brokers_sections')
      .select('required_inputs')
      .eq('broker_id', brokerId)
      .eq('function_slug', functionSlug)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error getting broker function required inputs:", error);
      return [];
    }
    
    return data.required_inputs as string[] || [];
  } catch (error) {
    console.error("Error getting broker function required inputs:", error);
    return [];
  }
};
