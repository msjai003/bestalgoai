
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BrokerFunction } from "@/types/broker";
import { supabase } from "@/integrations/supabase/client";
import { brokers } from "@/components/broker-integration/BrokerData";

export const useBrokerFunctions = (brokerId?: number) => {
  const [functions, setFunctions] = useState<BrokerFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokerName, setBrokerName] = useState<string | null>(null);

  const fetchBrokerFunctions = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchData = async () => {
      try {
        // Query the new brokers_sections table
        const { data, error } = await supabase
          .from('brokers_sections')
          .select('*')
          .eq('function_enabled', true);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          console.log("No broker functions found in database");
          setFunctions([]);
          setIsLoading(false);
          return;
        }
        
        // Filter by broker ID if provided
        const filteredData = brokerId 
          ? data.filter(item => item.broker_id === brokerId)
          : data;
        
        // Map data to BrokerFunction type
        const mappedFunctions: BrokerFunction[] = filteredData.map(item => ({
          id: `${item.broker_id}-${item.function_slug}`,
          broker_id: item.broker_id,
          broker_name: item.broker_name,
          function_name: item.function_name,
          function_description: item.function_description || '',
          function_slug: item.function_slug,
          function_enabled: item.function_enabled,
          is_premium: item.is_premium,
          broker_image: item.broker_image
        }));
        
        setFunctions(mappedFunctions);
        
        // Extract broker name if brokerId is provided and we have matching functions
        if (brokerId && mappedFunctions.length > 0) {
          setBrokerName(mappedFunctions[0].broker_name);
        } else if (brokerId) {
          // Try to get broker name from broker_details
          const { data: brokerData } = await supabase
            .from('broker_details')
            .select('broker_name')
            .eq('id', brokerId)
            .maybeSingle();
          
          if (brokerData) {
            setBrokerName(brokerData.broker_name);
          } else {
            // Fall back to static data
            const broker = brokers.find(b => b.id === brokerId);
            setBrokerName(broker?.name || null);
          }
        }
      } catch (err) {
        console.error("Error fetching broker functions:", err);
        setError("Failed to load broker functions");
        
        // Fallback to empty array
        setFunctions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
