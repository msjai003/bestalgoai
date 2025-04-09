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
    
    try {
      // Fetch functions from the database
      const fetchFunctions = async () => {
        try {
          let query = supabase
            .from('brokers_functions')
            .select('*');
            
          if (brokerId) {
            query = query.eq('broker_id', brokerId);
          }
          
          const { data, error } = await query;
          
          if (error) {
            console.error("Error fetching broker functions:", error);
            setError(error.message);
            
            // Fall back to static data in case of error
            setFunctionsFromStaticData();
            return;
          }
          
          if (!data || data.length === 0) {
            // If no data in the database, fallback to static data
            setFunctionsFromStaticData();
            return;
          }
          
          // Process database functions
          setFunctions(data as unknown as BrokerFunction[]);
          
          // Extract broker name from the functions or broker list
          if (brokerId) {
            const broker = brokers.find(b => b.id === brokerId);
            setBrokerName(broker?.name || null);
          } else if (data.length > 0) {
            setBrokerName(data[0].broker_name);
          }
        } catch (err) {
          console.error("Database error fetching broker functions:", err);
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
    // Filter functions from static data based on broker ID
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

// Static broker functions data as fallback
const staticBrokerFunctions: BrokerFunction[] = [
  // Zerodha functions
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
  // ICICI Direct functions
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
  },
  {
    id: "2-portfolio_view",
    broker_id: 2,
    broker_name: "ICICI Direct",
    function_name: "Portfolio View",
    function_description: "View current holdings and positions",
    function_slug: "portfolio_view",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
  },
  // Angel One functions
  {
    id: "3-order_placement",
    broker_id: 3,
    broker_name: "Angel One",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  },
  {
    id: "3-order_cancellation",
    broker_id: 3,
    broker_name: "Angel One",
    function_name: "Order Cancellation",
    function_description: "Cancel pending orders",
    function_slug: "order_cancellation",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  },
  // 5 Paisa functions
  {
    id: "7-order_placement",
    broker_id: 7,
    broker_name: "5 Paisa",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
  },
  {
    id: "7-market_data",
    broker_id: 7,
    broker_name: "5 Paisa",
    function_name: "Market Data",
    function_description: "Access real-time market data",
    function_slug: "market_data",
    function_enabled: true,
    is_premium: true,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
  },
  // Bigul functions
  {
    id: "8-order_placement",
    broker_id: 8,
    broker_name: "Bigul",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
  },
  {
    id: "8-portfolio_view",
    broker_id: 8,
    broker_name: "Bigul",
    function_name: "Portfolio View",
    function_description: "View current holdings and positions",
    function_slug: "portfolio_view",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
  }
];
