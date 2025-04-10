
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BrokerFunction } from "@/types/broker";
import { brokers } from "@/components/broker-integration/BrokerData";
import { getFunctionsForBroker } from "@/lib/broker-functions";

export const useBrokerFunctions = (brokerId?: number) => {
  const [functions, setFunctions] = useState<BrokerFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokerName, setBrokerName] = useState<string | null>(null);

  const fetchBrokerFunctions = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch functions from the database
      const fetchFunctions = async () => {
        if (!brokerId) {
          // If no broker ID provided, return empty array
          setFunctions([]);
          setBrokerName(null);
          return;
        }
        
        try {
          // Use our updated function that now fetches from broker_infocap
          const brokerFunctions = await getFunctionsForBroker(brokerId);
          setFunctions(brokerFunctions);
          
          // Extract broker name from functions or broker list
          if (brokerFunctions.length > 0) {
            setBrokerName(brokerFunctions[0].broker_name);
          } else {
            const broker = brokers.find(b => b.id === brokerId);
            setBrokerName(broker?.name || null);
          }
        } catch (err: any) {
          console.error("Error fetching broker functions:", err);
          setError(err.message);
          setFunctions([]);
        }
      };
      
      fetchFunctions().finally(() => {
        setIsLoading(false);
      });
    } catch (err: any) {
      console.error("Exception in fetching broker functions:", err);
      setError(err.message);
      toast.error("Failed to load broker functions");
      setIsLoading(false);
      setFunctions([]);
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
