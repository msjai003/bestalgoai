
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BrokerFunction } from "@/types/broker";
import { supabase } from "@/integrations/supabase/client";
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
          // If no broker ID provided, return all functions (for now just static)
          setFunctionsFromStaticData();
          return;
        }
        
        try {
          // Use our updated function that now fetches from broker_infocap
          const brokerFunctions = await getFunctionsForBroker(brokerId);
          setFunctions(brokerFunctions);
          
          // Extract broker name from the broker list
          const broker = brokers.find(b => b.id === brokerId);
          setBrokerName(broker?.name || null);
        } catch (err: any) {
          console.error("Error fetching broker functions:", err);
          setError(err.message);
          
          // Fall back to static data
          setFunctionsFromStaticData();
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
      
      // Fall back to static data
      setFunctionsFromStaticData();
    }
  }, [brokerId]);
  
  // Helper function to set functions from static data as fallback
  const setFunctionsFromStaticData = () => {
    // Static broker functions for fallback - now we'll directly query the broker_infocap table
    const fetchStaticFunctionsFromTable = async () => {
      try {
        const { data, error } = await supabase
          .from('broker_infocap')
          .select('*')
          .order('function_order', { ascending: true });
        
        if (error || !data) {
          console.error("Error fetching from broker_infocap:", error);
          useDefaultStaticData();
          return;
        }
        
        const mappedFunctions: BrokerFunction[] = data.map((item: any) => ({
          id: item.id.toString(),
          broker_id: item.broker_id,
          broker_name: item.broker_name,
          function_name: item.function_name,
          function_description: item.function_description,
          function_slug: item.function_slug,
          function_enabled: item.function_enabled,
          is_premium: item.is_premium,
          broker_image: null // We'll fetch this elsewhere if needed
        }));
        
        const filteredFunctions = brokerId
          ? mappedFunctions.filter(func => func.broker_id === brokerId)
          : mappedFunctions;
        
        setFunctions(filteredFunctions);
        
        // Extract broker name
        if (brokerId) {
          const broker = brokers.find(b => b.id === brokerId);
          setBrokerName(broker?.name || null);
        } else if (filteredFunctions.length > 0) {
          setBrokerName(filteredFunctions[0].broker_name);
        }
      } catch (err) {
        console.error("Error fetching static data from table:", err);
        useDefaultStaticData();
      }
    };
    
    const useDefaultStaticData = () => {
      // These were the original static functions used as fallback
      const staticBrokerFunctions: BrokerFunction[] = [
        {
          id: "1-order_placement",
          broker_id: 1,
          broker_name: "Zerodha",
          function_name: "Order Placement",
          function_description: "Place new orders with the broker",
          function_slug: "order_placement",
          function_enabled: true,
          is_premium: false,
          broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
        },
        {
          id: "1-order_modification",
          broker_id: 1,
          broker_name: "Zerodha",
          function_name: "Order Modification",
          function_description: "Modify existing orders",
          function_slug: "order_modification",
          function_enabled: true,
          is_premium: false,
          broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
        },
        {
          id: "1-market_data",
          broker_id: 1,
          broker_name: "Zerodha",
          function_name: "Market Data",
          function_description: "Access real-time market data",
          function_slug: "market_data",
          function_enabled: true,
          is_premium: true,
          broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
        },
        {
          id: "2-order_placement",
          broker_id: 2,
          broker_name: "ICICI Direct",
          function_name: "Order Placement",
          function_description: "Place new orders with the broker",
          function_slug: "order_placement",
          function_enabled: true,
          is_premium: false,
          broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
        }
      ];
      
      const filteredFunctions = brokerId
        ? staticBrokerFunctions.filter(func => func.broker_id === brokerId)
        : staticBrokerFunctions;
      
      setFunctions(filteredFunctions);
      
      // Extract broker name
      if (brokerId) {
        const broker = brokers.find(b => b.id === brokerId);
        setBrokerName(broker?.name || null);
      } else if (filteredFunctions.length > 0) {
        setBrokerName(filteredFunctions[0].broker_name);
      }
    };
    
    // Try to fetch from table first, fall back to hardcoded data if that fails
    fetchStaticFunctionsFromTable();
  };

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
