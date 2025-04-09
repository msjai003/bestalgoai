
import { supabase } from "@/integrations/supabase/client";
import { Broker, BrokerDetail } from "@/types/broker";
import { toast } from "sonner";

/**
 * Get all broker details from the database
 */
export const getAllBrokerDetails = async (): Promise<BrokerDetail[]> => {
  try {
    const { data, error } = await supabase
      .from('broker_details')
      .select('*');
    
    if (error) {
      console.error("Error fetching broker details:", error);
      toast.error("Failed to load broker details");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception fetching broker details:", error);
    toast.error("An error occurred while loading broker details");
    return [];
  }
};

/**
 * Get a specific broker detail by ID
 */
export const getBrokerDetailById = async (brokerId: number): Promise<BrokerDetail | null> => {
  try {
    const { data, error } = await supabase
      .from('broker_details')
      .select('*')
      .eq('id', brokerId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching broker detail:", error);
      toast.error("Failed to load broker detail");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching broker detail:", error);
    toast.error("An error occurred while loading broker detail");
    return null;
  }
};
