
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BrokerFunction } from "@/types/broker";
import { supabase } from "@/lib/supabase/client";
import { brokers } from "@/components/broker-integration/BrokerData";
import { syncBrokerFunctionsFromDetails } from "@/lib/broker-functions";

export const useBrokerFunctions = (brokerId?: number) => {
  const [functions, setFunctions] = useState<BrokerFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokerName, setBrokerName] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchBrokerFunctions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, sync broker functions from broker_details to ensure we have the latest data
      await syncBrokerFunctionsFromDetails();
      
      let functionsData: BrokerFunction[] = [];
      
      if (brokerId) {
        // Fetch functions for a specific broker from the brokers_functions table
        const { data: dbFunctions, error: functionsError } = await supabase
          .from('brokers_functions')
          .select('*')
          .eq('broker_id', brokerId);
          
        if (functionsError) {
          console.error("Error fetching broker functions:", functionsError);
          throw new Error("Failed to load broker functions from database");
        }
        
        if (dbFunctions && dbFunctions.length > 0) {
          // Set broker name from the first function
          setBrokerName(dbFunctions[0].broker_name);
          
          // Map database functions to BrokerFunction type
          functionsData = dbFunctions.map(f => ({
            id: f.id,
            broker_id: f.broker_id,
            broker_name: f.broker_name,
            function_name: f.function_name,
            function_description: f.function_description || "",
            function_slug: f.function_slug,
            function_enabled: f.function_enabled,
            is_premium: f.is_premium,
            broker_image: f.broker_image
          }));
        } else {
          // No functions found in database for this broker, fetch broker info to create defaults
          const broker = await fetchBrokerInfo(brokerId);
          
          if (broker) {
            setBrokerName(broker.name);
            functionsData = createDefaultFunctions(broker);
          }
        }
      } else {
        // Fetch all functions for all brokers from the brokers_functions table
        const { data: allFunctions, error: allFunctionsError } = await supabase
          .from('brokers_functions')
          .select('*');
          
        if (allFunctionsError) {
          console.error("Error fetching all broker functions:", allFunctionsError);
          throw new Error("Failed to load broker functions from database");
        }
        
        if (allFunctions && allFunctions.length > 0) {
          // Sort functions by broker_id and function_name
          const sortedFunctions = [...allFunctions].sort((a, b) => {
            if (a.broker_id !== b.broker_id) {
              return a.broker_id - b.broker_id;
            }
            return a.function_name.localeCompare(b.function_name);
          });
          
          // Map database functions to BrokerFunction type
          functionsData = sortedFunctions.map(f => ({
            id: f.id,
            broker_id: f.broker_id,
            broker_name: f.broker_name,
            function_name: f.function_name,
            function_description: f.function_description || "",
            function_slug: f.function_slug,
            function_enabled: f.function_enabled,
            is_premium: f.is_premium,
            broker_image: f.broker_image
          }));
        } else {
          // No functions found in database, fall back to creating some defaults
          // Fetch all broker info to create defaults
          const brokersList = await fetchAllBrokers();
          
          for (const broker of brokersList) {
            const defaultFunctions = createDefaultFunctions(broker);
            functionsData = [...functionsData, ...defaultFunctions];
          }
        }
      }
      
      setFunctions(functionsData);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error fetching broker functions:", err);
      setError("Failed to load broker functions");
      
      // Fallback to empty array
      setFunctions([]);
    } finally {
      setIsLoading(false);
    }
  }, [brokerId]);

  // Enhanced real-time subscription: 
  // 1. Listen for changes in the broker_details table
  useEffect(() => {
    const brokerDetailsChannel = supabase
      .channel('broker_details_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'broker_details' }, 
        (payload) => {
          console.log('Broker details changed:', payload);
          // Refresh functions when broker details change
          fetchBrokerFunctions();
          toast.info("Broker information updated");
        }
      )
      .subscribe();
    
    // 2. Listen for changes in the brokers_functions table
    const brokerFunctionsChannel = supabase
      .channel('broker_functions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'brokers_functions' }, 
        (payload) => {
          console.log('Broker functions changed:', payload);
          // Refresh functions when broker functions change
          fetchBrokerFunctions();
          toast.info("Broker functions updated");
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(brokerDetailsChannel);
      supabase.removeChannel(brokerFunctionsChannel);
    };
  }, [fetchBrokerFunctions]);

  // Helper function to fetch broker info
  const fetchBrokerInfo = async (id: number) => {
    try {
      // Try to get broker info from brokers_admin table first
      const { data: adminBroker, error: adminError } = await supabase
        .from('brokers_admin')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (!adminError && adminBroker) {
        return {
          id: adminBroker.id,
          name: adminBroker.broker_name,
          logo: adminBroker.image_url || "/placeholder.svg"
        };
      }
      
      // Try broker_details table
      const { data: brokerDetails, error: detailsError } = await supabase
        .from('broker_details')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (!detailsError && brokerDetails) {
        return {
          id: brokerDetails.id,
          name: brokerDetails.broker_name,
          logo: brokerDetails.image_url || "/placeholder.svg"
        };
      }
      
      // Fall back to static data
      return brokers.find(b => b.id === id);
    } catch (error) {
      console.error("Error fetching broker info:", error);
      return brokers.find(b => b.id === id);
    }
  };
  
  // Helper function to fetch all brokers
  const fetchAllBrokers = async () => {
    try {
      // Try to get broker info from brokers_admin table
      const { data: adminBrokers, error: adminError } = await supabase
        .from('brokers_admin')
        .select('*');
        
      if (!adminError && adminBrokers && adminBrokers.length > 0) {
        return adminBrokers.map(b => ({
          id: b.id,
          name: b.broker_name,
          logo: b.image_url || "/placeholder.svg"
        }));
      }
      
      // Try broker_details table
      const { data: brokersDetails, error: detailsError } = await supabase
        .from('broker_details')
        .select('*');
        
      if (!detailsError && brokersDetails && brokersDetails.length > 0) {
        return brokersDetails.map(b => ({
          id: b.id,
          name: b.broker_name,
          logo: b.image_url || "/placeholder.svg"
        }));
      }
      
      // Fall back to static data
      return brokers;
    } catch (error) {
      console.error("Error fetching all brokers:", error);
      return brokers;
    }
  };

  // Helper function to create default functions for a broker
  const createDefaultFunctions = (broker: { id: number; name: string; logo?: string }) => {
    return [
      {
        id: `${broker.id}-order_placement`,
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Order Placement",
        function_description: "Place new orders with the broker",
        function_slug: "order_placement",
        function_enabled: true,
        is_premium: false,
        broker_image: broker.logo
      },
      {
        id: `${broker.id}-order_modification`,
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Order Modification",
        function_description: "Modify existing orders",
        function_slug: "order_modification",
        function_enabled: true,
        is_premium: false,
        broker_image: broker.logo
      },
      {
        id: `${broker.id}-order_cancellation`,
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Order Cancellation",
        function_description: "Cancel pending orders",
        function_slug: "order_cancellation",
        function_enabled: true,
        is_premium: false,
        broker_image: broker.logo
      },
      {
        id: `${broker.id}-portfolio_view`,
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Portfolio View",
        function_description: "View current holdings and positions",
        function_slug: "portfolio_view",
        function_enabled: true,
        is_premium: false,
        broker_image: broker.logo
      },
      {
        id: `${broker.id}-market_data`,
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Market Data",
        function_description: "Access real-time market data",
        function_slug: "market_data",
        function_enabled: true,
        is_premium: true,
        broker_image: broker.logo
      }
    ];
  };

  useEffect(() => {
    fetchBrokerFunctions();
    
    // Set up an interval to refresh data periodically (reduced from 60s to 15s)
    const refreshInterval = setInterval(() => {
      fetchBrokerFunctions();
    }, 15000); // Refresh every 15 seconds
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetchBrokerFunctions]);

  return {
    functions,
    brokerName,
    isLoading,
    error,
    lastRefreshed,
    refresh: fetchBrokerFunctions
  };
};
