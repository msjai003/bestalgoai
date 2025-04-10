
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
    
    // Since the brokers_sections table was removed, we'll use the static data
    // from BrokerData.ts instead
    const fetchData = async () => {
      try {
        // Create default function patterns that most brokers will have
        const defaultFunctions: BrokerFunction[] = [];
        
        // Find the broker if brokerId is provided
        const broker = brokerId ? brokers.find(b => b.id === brokerId) : null;
        
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
        } else {
          // If no broker ID specified, add functions for all brokers
          brokers.forEach(b => {
            defaultFunctions.push({
              id: `${b.id}-order_placement`,
              broker_id: b.id,
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
