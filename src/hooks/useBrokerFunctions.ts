
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BrokerFunction } from "./strategy/types";
import { supabase } from "@/integrations/supabase/client";

export const useBrokerFunctions = (brokerId?: number) => {
  const [functions, setFunctions] = useState<BrokerFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrokerFunctions = async () => {
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
      } catch (err: any) {
        console.error("Error fetching broker functions:", err);
        setError(err.message);
        toast.error("Failed to load broker functions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokerFunctions();
  }, [brokerId]);

  return {
    functions,
    isLoading,
    error,
    refresh: () => {
      setIsLoading(true);
      setFunctions([]);
      // The useEffect will trigger again and refetch the data
    }
  };
};
