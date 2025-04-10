
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
    const response = await supabase
      .from('broker_work')
      .select('*');
    
    const { data, error } = response;
    
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
    const response = await supabase
      .from('broker_work')
      .select('*');
    
    const { data, error } = response;
    
    if (error) {
      console.error("Error fetching broker work by broker ID:", error);
      return [];
    }
    
    // Filter by broker_id client-side
    return (data || []).filter(item => item.broker_id === brokerId && item.is_active === true);
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
    const response = await supabase
      .from('broker_work')
      .select('*');
    
    const { data, error } = response;
    
    if (error) {
      console.error("Error fetching broker work by ID:", error);
      return null;
    }
    
    // Find the record with matching ID
    return (data || []).find(item => item.id === id) || null;
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
    const response = await supabase
      .from('broker_work')
      .insert(brokerWork);
    
    const { data, error } = response;
    
    if (error) {
      console.error("Error creating broker work:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    return data[0].id;
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
    const response = await supabase
      .from('broker_work')
      .update(brokerWork);
    
    const { error } = response;
    
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
    const response = await supabase
      .from('broker_work')
      .delete();
    
    const { error } = response;
    
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
    const response = await supabase
      .from('broker_work')
      .update({ is_active: false });
    
    const { error } = response;
    
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
    const response = await supabase
      .from('broker_work')
      .update({ status });
    
    const { error } = response;
    
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
    const response = await supabase
      .from('broker_work')
      .select('*');
    
    const { data, error } = response;
    
    if (error) {
      console.error("Error fetching broker work by credentials:", error);
      return null;
    }
    
    // Filter by username and password client-side
    return (data || []).find(item => 
      item.username === username && 
      item.password === password && 
      item.is_active === true
    ) || null;
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
    const response = await supabase
      .from('broker_work')
      .update(credentials);
    
    const { error } = response;
    
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
    // First fetch all records for this broker
    const { data, error: fetchError } = await supabase
      .from('broker_work')
      .select('*');
    
    if (fetchError) {
      console.error("Error fetching broker work by broker ID:", fetchError);
      return false;
    }
    
    // Filter by broker_id client-side
    const brokerWorkItems = (data || []).filter(item => item.broker_id === brokerId);
    
    if (brokerWorkItems.length === 0) {
      return true; // No items to update
    }
    
    // Update each item one by one
    for (const item of brokerWorkItems) {
      const response = await supabase
        .from('broker_work')
        .update({ status });
      
      if (response.error) {
        console.error("Error updating broker work status:", response.error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Exception batch updating broker work status:", error);
    return false;
  }
};
