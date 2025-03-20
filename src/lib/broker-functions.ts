
import { supabase } from '@/integrations/supabase/client';
import { BrokerFunction } from '@/hooks/strategy/types';

/**
 * Fetches all functions for a specific broker
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  const { data, error } = await supabase
    .from('brokers_functions')
    .select('*')
    .eq('broker_id', brokerId)
    .eq('function_enabled', true)
    .order('function_name');
    
  if (error) {
    console.error('Error fetching broker functions:', error);
    throw error;
  }
  
  return data;
};

/**
 * Checks if a broker has a specific function enabled
 */
export const hasBrokerFunction = async (
  brokerId: number, 
  functionSlug: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('brokers_functions')
    .select('*')
    .eq('broker_id', brokerId)
    .eq('function_slug', functionSlug)
    .eq('function_enabled', true)
    .maybeSingle();
    
  if (error) {
    console.error('Error checking broker function:', error);
    return false;
  }
  
  return !!data;
};

/**
 * Checks if a broker function is premium
 */
export const isBrokerFunctionPremium = async (
  brokerId: number, 
  functionSlug: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('brokers_functions')
    .select('is_premium')
    .eq('broker_id', brokerId)
    .eq('function_slug', functionSlug)
    .eq('function_enabled', true)
    .maybeSingle();
    
  if (error || !data) {
    console.error('Error checking if broker function is premium:', error);
    return false;
  }
  
  return !!data.is_premium;
};

/**
 * Gets function configuration for a broker
 */
export const getBrokerFunctionConfig = async (
  brokerId: number, 
  functionSlug: string
): Promise<Record<string, any> | null> => {
  const { data, error } = await supabase
    .from('brokers_functions')
    .select('configuration')
    .eq('broker_id', brokerId)
    .eq('function_slug', functionSlug)
    .eq('function_enabled', true)
    .maybeSingle();
    
  if (error || !data) {
    console.error('Error fetching broker function configuration:', error);
    return null;
  }
  
  return data.configuration;
};
