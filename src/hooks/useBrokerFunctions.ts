
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

  const fetchBrokerFunctions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Try to fetch from the brokers_admin table first, then fall back to static data
    try {
      // Create default function patterns that most brokers will have
      const defaultFunctions: BrokerFunction[] = [];
      
      // First try to get broker info from brokers_admin table
      let broker = null;
      
      if (brokerId) {
        // We use any type here to avoid type errors with table names
        const { data: adminData, error: adminError } = await supabase
          .from('brokers_admin')
          .select('*')
          .eq('id', brokerId)
          .maybeSingle() as any;
          
        if (!adminError && adminData) {
          broker = {
            id: adminData.id,
            name: adminData.broker_name,
            logo: adminData.image_url || "/placeholder.svg"
          };
        } else {
          // Fall back to static data
          broker = brokers.find(b => b.id === brokerId);
        }
      }
      
      if (broker) {
        setBrokerName(broker.name);
        
        // Add standard functions for this broker
        defaultFunctions.push(
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
        );
      } else if (!brokerId) {
        // If no broker ID specified, add functions for all brokers from either admin table or static data
        
        // First try to get all brokers from admin table
        const { data: allBrokers, error: brokersError } = await supabase
          .from('brokers_admin')
          .select('*') as any;
          
        const brokersList = !brokersError && allBrokers && allBrokers.length > 0 
          ? allBrokers.map((b: any) => ({ 
              id: b.id, 
              name: b.broker_name, 
              logo: b.image_url || "/placeholder.svg" 
            }))
          : brokers; // Fall back to static data
          
        brokersList.forEach(b => {
          defaultFunctions.push({
            id: `${b.id}-order_placement`,
            broker_id: typeof b.id === 'number' ? b.id : Number(b.id),
            broker_name: b.name,
            function_name: "Order Placement",
            function_description: "Place new orders with the broker",
            function_slug: "order_placement",
            function_enabled: true,
            is_premium: false,
            broker_image: b.logo
          });
        });
      }
      
      setFunctions(defaultFunctions);
    } catch (err) {
      console.error("Error creating broker functions:", err);
      setError("Failed to load broker functions");
      
      // Fallback to empty array
      setFunctions([]);
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
