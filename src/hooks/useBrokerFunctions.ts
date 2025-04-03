
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BrokerFunction } from "./strategy/types";
import { supabase } from "@/integrations/supabase/client";

export const useBrokerFunctions = (brokerId?: number) => {
  const [functions, setFunctions] = useState<BrokerFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokerName, setBrokerName] = useState<string | null>(null);

  const fetchBrokerFunctions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('brokers_functions')
        .select('*') // This will now include the broker_image column
        .order('function_name');
      
      // If a broker ID is provided, filter by it
      if (brokerId) {
        query = query.eq('broker_id', brokerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Cast the data to match our BrokerFunction type
      setFunctions(data as unknown as BrokerFunction[]);

      // Extract broker name from the first function record
      if (data && data.length > 0 && data[0].broker_name) {
        setBrokerName(data[0].broker_name);
      }
    } catch (err: any) {
      console.error("Error fetching broker functions:", err);
      setError(err.message);
      toast.error("Failed to load broker functions");
    } finally {
      setIsLoading(false);
    }
  }, [brokerId]);

  useEffect(() => {
    fetchBrokerFunctions();
  }, [fetchBrokerFunctions]);

  return {
    functions,
    brokerName,
    isLoading,
    error,
    refresh: fetchBrokerFunctions
  };
};
