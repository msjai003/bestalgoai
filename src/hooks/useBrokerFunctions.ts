
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BrokerFunction } from "@/types/broker";
import { supabase } from "@/lib/supabase/client";
import { brokers } from "@/components/broker-integration/BrokerData";

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
      let functionsData: BrokerFunction[] = [];
      
      if (brokerId) {
        // Fetch functions for a specific broker from the brokers_functionality table first
        const { data: newFunctions, error: newFunctionsError } = await supabase
          .from('brokers_functionality')
          .select('*')
          .eq('broker_id', brokerId);
          
        if (!newFunctionsError && newFunctions && newFunctions.length > 0) {
          // Set broker name from the first function
          setBrokerName(newFunctions[0].broker_name);
          
          // Map database functions to BrokerFunction type
          functionsData = await Promise.all(newFunctions.map(async f => {
            const brokerImage = await getBrokerImage(f.broker_id);
            return {
              id: f.id,
              broker_id: f.broker_id,
              broker_name: f.broker_name,
              function_name: f.function_name,
              function_description: f.function_description || "",
              function_slug: f.function_slug,
              function_enabled: f.function_enabled,
              is_premium: f.is_premium,
              broker_image: brokerImage
            };
          }));
        } else {
          // Fallback to the broker_functionality table if no data in the new table
          const { data: dbFunctions, error: functionsError } = await supabase
            .from('broker_functionality')
            .select('*')
            .eq('broker_id', brokerId);
            
          if (functionsError) {
            console.error("Error fetching broker functionalities:", functionsError);
            throw new Error("Failed to load broker functionalities from database");
          }
          
          if (dbFunctions && dbFunctions.length > 0) {
            // Set broker name from the first function
            setBrokerName(dbFunctions[0].broker_name);
            
            // Map database functions to BrokerFunction type
            functionsData = await Promise.all(dbFunctions.map(async f => {
              const brokerImage = await getBrokerImage(f.broker_id);
              return {
                id: f.id,
                broker_id: f.broker_id,
                broker_name: f.broker_name,
                function_name: f.function_name,
                function_description: f.function_description || "",
                function_slug: f.function_slug,
                function_enabled: f.function_enabled,
                is_premium: f.is_premium,
                broker_image: brokerImage
              };
            }));
          } else {
            // No functions found in database for this broker, fetch broker info to create defaults
            const broker = await fetchBrokerInfo(brokerId);
            
            if (broker) {
              setBrokerName(broker.name);
              functionsData = await createAndStoreFunctions(broker);
            }
          }
        }
      } else {
        // Fetch all functions for all brokers from the brokers_functionality table
        const { data: allNewFunctions, error: allNewFunctionsError } = await supabase
          .from('brokers_functionality')
          .select('*');
          
        if (!allNewFunctionsError && allNewFunctions && allNewFunctions.length > 0) {
          // Map database functions to BrokerFunction type with broker images
          for (const func of allNewFunctions) {
            const imageUrl = await getBrokerImage(func.broker_id);
            functionsData.push({
              id: func.id,
              broker_id: func.broker_id,
              broker_name: func.broker_name,
              function_name: func.function_name,
              function_description: func.function_description || "",
              function_slug: func.function_slug,
              function_enabled: func.function_enabled,
              is_premium: func.is_premium,
              broker_image: imageUrl
            });
          }
        } else {
          // Fallback to broker_functionality table
          const { data: allFunctions, error: allFunctionsError } = await supabase
            .from('broker_functionality')
            .select('*');
            
          if (allFunctionsError) {
            console.error("Error fetching all broker functionalities:", allFunctionsError);
            throw new Error("Failed to load broker functionalities from database");
          }
          
          if (allFunctions && allFunctions.length > 0) {
            // Map database functions to BrokerFunction type with broker images
            for (const func of allFunctions) {
              const imageUrl = await getBrokerImage(func.broker_id);
              functionsData.push({
                id: func.id,
                broker_id: func.broker_id,
                broker_name: func.broker_name,
                function_name: func.function_name,
                function_description: func.function_description || "",
                function_slug: func.function_slug,
                function_enabled: func.function_enabled,
                is_premium: func.is_premium,
                broker_image: imageUrl
              });
            }
          } else {
            // No functions found in database, fall back to creating some defaults
            // Fetch all broker info to create defaults
            const brokersList = await fetchAllBrokers();
            
            for (const broker of brokersList) {
              const defaultFunctions = await createAndStoreFunctions(broker);
              functionsData = [...functionsData, ...defaultFunctions];
            }
          }
        }
      }
      
      setFunctions(functionsData);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error fetching broker functionalities:", err);
      setError("Failed to load broker functionalities");
      
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
    
    // 2. Listen for changes in the broker_functionality and brokers_functionality tables
    const brokerFunctionalityChannel = supabase
      .channel('broker_functionality_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'broker_functionality' }, 
        (payload) => {
          console.log('Broker functionalities changed:', payload);
          // Refresh functions when broker functions change
          fetchBrokerFunctions();
          toast.info("Broker functionalities updated");
        }
      )
      .subscribe();
      
    const brokersFunctionalityChannel = supabase
      .channel('brokers_functionality_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'brokers_functionality' }, 
        (payload) => {
          console.log('Brokers functionalities changed:', payload);
          // Refresh functions when broker functions change
          fetchBrokerFunctions();
          toast.info("Broker functionalities updated");
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(brokerDetailsChannel);
      supabase.removeChannel(brokerFunctionalityChannel);
      supabase.removeChannel(brokersFunctionalityChannel);
    };
  }, [fetchBrokerFunctions]);

  // Helper function to fetch broker info
  const fetchBrokerInfo = async (id: number) => {
    try {
      // Try to get broker info from brokers_admin table first
      const { data: adminBroker, error: adminError } = await supabase
        .from('brokers_admin')
        .select('*')
        .eq('id', id);
        
      if (!adminError && adminBroker && adminBroker.length > 0) {
        return {
          id: adminBroker[0].id,
          name: adminBroker[0].broker_name,
          logo: adminBroker[0].image_url || "/placeholder.svg"
        };
      }
      
      // Try broker_details table
      const { data: brokerDetails, error: detailsError } = await supabase
        .from('broker_details')
        .select('*')
        .eq('id', id);
        
      if (!detailsError && brokerDetails && brokerDetails.length > 0) {
        return {
          id: brokerDetails[0].id,
          name: brokerDetails[0].broker_name,
          logo: brokerDetails[0].image_url || "/placeholder.svg"
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

  // Helper function to get broker image
  const getBrokerImage = async (brokerId: number): Promise<string | undefined> => {
    try {
      // First check if the broker exists in brokers_admin table
      const { data: adminBroker, error: adminError } = await supabase
        .from('brokers_admin')
        .select('image_url')
        .eq('id', brokerId);
        
      if (!adminError && adminBroker && adminBroker.length > 0 && adminBroker[0].image_url) {
        return adminBroker[0].image_url;
      }
      
      // Try broker_details table
      const { data: brokerDetails, error: detailsError } = await supabase
        .from('broker_details')
        .select('image_url')
        .eq('id', brokerId);
        
      if (!detailsError && brokerDetails && brokerDetails.length > 0 && brokerDetails[0].image_url) {
        return brokerDetails[0].image_url;
      }
      
      // Fall back to static data
      const broker = brokers.find(b => b.id === brokerId);
      return broker?.logo;
    } catch (error) {
      console.error("Error fetching broker image:", error);
      const broker = brokers.find(b => b.id === brokerId);
      return broker?.logo;
    }
  };

  // Helper function to create default functions for a broker and store them in the database
  const createAndStoreFunctions = async (broker: { id: number; name: string; logo?: string }) => {
    const defaultFunctions = [
      {
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Order Placement",
        function_description: "Place new orders with the broker",
        function_slug: "order_placement",
        function_enabled: true,
        is_premium: false
      },
      {
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Order Modification",
        function_description: "Modify existing orders",
        function_slug: "order_modification",
        function_enabled: true,
        is_premium: false
      },
      {
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Order Cancellation",
        function_description: "Cancel pending orders",
        function_slug: "order_cancellation",
        function_enabled: true,
        is_premium: false
      },
      {
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Portfolio View",
        function_description: "View current holdings and positions",
        function_slug: "portfolio_view",
        function_enabled: true,
        is_premium: false
      },
      {
        broker_id: broker.id,
        broker_name: broker.name,
        function_name: "Market Data",
        function_description: "Access real-time market data",
        function_slug: "market_data",
        function_enabled: true,
        is_premium: true
      }
    ];
    
    // Try to insert into brokers_functionality table first
    let successCount = 0;
    for (const func of defaultFunctions) {
      try {
        // First check if function exists
        const { data: existingFuncs, error: checkError } = await supabase
          .from('brokers_functionality')
          .select('id')
          .eq('broker_id', func.broker_id)
          .eq('function_slug', func.function_slug);
          
        if (!checkError && existingFuncs && existingFuncs.length > 0) {
          // Update existing function
          await supabase
            .from('brokers_functionality')
            .update(func)
            .eq('id', existingFuncs[0].id);
          successCount++;
        } else {
          // Insert new function
          const { error: insertError } = await supabase
            .from('brokers_functionality')
            .insert(func);
            
          if (!insertError) {
            successCount++;
          } else {
            console.error("Error inserting function into brokers_functionality:", insertError);
          }
        }
      } catch (error) {
        console.error("Error storing broker function in brokers_functionality:", error);
      }
    }
    
    // If some inserts failed, try the original table as fallback
    if (successCount < defaultFunctions.length) {
      for (const func of defaultFunctions) {
        try {
          // First check if function exists
          const { data: existingFuncs, error: checkError } = await supabase
            .from('broker_functionality')
            .select('id')
            .eq('broker_id', func.broker_id)
            .eq('function_slug', func.function_slug);
            
          if (!checkError && existingFuncs && existingFuncs.length > 0) {
            // Update existing function
            await supabase
              .from('broker_functionality')
              .update(func)
              .eq('id', existingFuncs[0].id);
          } else {
            // Insert new function
            await supabase
              .from('broker_functionality')
              .insert(func);
          }
        } catch (error) {
          console.error("Error storing broker function in fallback table:", error);
        }
      }
    }
    
    // Return the functions with IDs and broker image
    return defaultFunctions.map(func => ({
      ...func,
      id: `${broker.id}-${func.function_slug}`, // Fallback ID if not returned from database
      broker_image: broker.logo
    }));
  };

  useEffect(() => {
    fetchBrokerFunctions();
    
    // Set up an interval to refresh data periodically
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
