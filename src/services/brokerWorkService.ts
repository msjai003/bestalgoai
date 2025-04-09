
import { supabase } from "@/lib/supabase/client";

/**
 * Interface for the BrokerWork type that matches the database schema
 */
export interface BrokerWork {
  id: number;
  broker_id: number;
  broker_name: string;
  username?: string;
  password?: string;
  api_key?: string;
  secret_key?: string;
  session_id?: string;
  two_factor_secret?: string;
  two_factor_code?: string;
  access_token?: string;
  product_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

/**
 * Fetch all broker work records
 */
export const fetchAllBrokerWork = async (): Promise<BrokerWork[]> => {
  try {
    const { data, error } = await supabase
      .from('broker_work')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error("Error fetching broker work:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception fetching broker work:", error);
    return [];
  }
};

/**
 * Fetch broker work records by broker ID
 */
export const fetchBrokerWorkByBrokerId = async (brokerId: number): Promise<BrokerWork[]> => {
  try {
    const { data, error } = await supabase
      .from('broker_work')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('is_active', true);
    
    if (error) {
      console.error("Error fetching broker work by broker ID:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception fetching broker work by broker ID:", error);
    return [];
  }
};

/**
 * Fetch a broker work record by ID
 */
export const fetchBrokerWorkById = async (id: number): Promise<BrokerWork | null> => {
  try {
    const { data, error } = await supabase
      .from('broker_work')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching broker work by ID:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching broker work by ID:", error);
    return null;
  }
};

/**
 * Create a new broker work record
 */
export const createBrokerWork = async (brokerWork: Omit<BrokerWork, 'id' | 'created_at' | 'updated_at'>): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('broker_work')
      .insert(brokerWork)
      .select('id')
      .single();
    
    if (error) {
      console.error("Error creating broker work:", error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error("Exception creating broker work:", error);
    return null;
  }
};

/**
 * Update an existing broker work record
 */
export const updateBrokerWork = async (id: number, brokerWork: Partial<BrokerWork>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_work')
      .update(brokerWork)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating broker work:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating broker work:", error);
    return false;
  }
};

/**
 * Delete a broker work record
 */
export const deleteBrokerWork = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_work')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting broker work:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting broker work:", error);
    return false;
  }
};

/**
 * Soft delete a broker work record (set is_active to false)
 */
export const softDeleteBrokerWork = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_work')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      console.error("Error soft deleting broker work:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception soft deleting broker work:", error);
    return false;
  }
};

/**
 * Update broker work status
 */
export const updateBrokerWorkStatus = async (id: number, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_work')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating broker work status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating broker work status:", error);
    return false;
  }
};

/**
 * Fetch broker work records by user credentials
 */
export const fetchBrokerWorkByCredentials = async (username: string, password: string): Promise<BrokerWork | null> => {
  try {
    const { data, error } = await supabase
      .from('broker_work')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching broker work by credentials:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching broker work by credentials:", error);
    return null;
  }
};

/**
 * Update broker work credentials
 */
export const updateBrokerWorkCredentials = async (
  id: number, 
  credentials: { 
    username?: string; 
    password?: string; 
    api_key?: string; 
    secret_key?: string;
    session_id?: string;
    two_factor_secret?: string;
    access_token?: string;
    product_type?: string;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_work')
      .update(credentials)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating broker work credentials:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating broker work credentials:", error);
    return false;
  }
};

/**
 * Batch update broker work status by broker ID
 */
export const updateBrokerWorkStatusByBrokerId = async (brokerId: number, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('broker_work')
      .update({ status })
      .eq('broker_id', brokerId);
    
    if (error) {
      console.error("Error batch updating broker work status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception batch updating broker work status:", error);
    return false;
  }
};
