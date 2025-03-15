
import { supabase } from "@/integrations/supabase/client";
import { Strategy } from "./types";

/**
 * Loads strategies from database and localStorage
 */
export const loadUserStrategies = async (userId: string | undefined): Promise<Strategy[]> => {
  // First try to get from localStorage for immediate display
  const storedStrategies = localStorage.getItem('wishlistedStrategies');
  let strategies: Strategy[] = [];
  
  if (storedStrategies) {
    try {
      strategies = JSON.parse(storedStrategies);
    } catch (error) {
      console.error("Error parsing wishlisted strategies:", error);
    }
  }
  
  // If user is logged in, fetch strategies from database
  if (userId) {
    try {
      // Fetch strategy selections
      const { data, error } = await supabase
        .from('strategy_selections')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // For each strategy with a broker, fetch the broker name
        const dbStrategies = await Promise.all(data.map(async (item) => {
          let brokerName = "";
          
          // If there's a selected broker, fetch its name
          if (item.selected_broker) {
            try {
              const brokerData = await fetchBrokerById(item.selected_broker);
              brokerName = brokerData?.broker_name || "Unknown Broker";
            } catch (err) {
              console.error("Error fetching broker name:", err);
              brokerName = "Unknown Broker";
            }
          }
          
          return {
            id: item.strategy_id,
            name: item.strategy_name,
            description: item.strategy_description || "",
            isWishlisted: true,
            isLive: Boolean(item.quantity > 0 && item.selected_broker),
            quantity: item.quantity || 0,
            selectedBroker: brokerName,
            performance: {
              winRate: "N/A",
              avgProfit: "N/A",
              drawdown: "N/A"
            }
          };
        }));
        
        strategies = dbStrategies;
        localStorage.setItem('wishlistedStrategies', JSON.stringify(dbStrategies));
      }
    } catch (error) {
      console.error("Error fetching strategies from database:", error);
    }
  }
  
  return strategies;
};

/**
 * Updates a strategy's live trading configuration in the database
 */
export const updateStrategyLiveConfig = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerId: string | null
): Promise<void> => {
  console.log("Updating strategy config:", {
    userId,
    strategyId,
    quantity,
    brokerId
  });
  
  const { error } = await supabase
    .from('strategy_selections')
    .upsert({
      user_id: userId,
      strategy_id: strategyId,
      strategy_name: strategyName,
      strategy_description: strategyDescription,
      quantity: quantity || 0,
      selected_broker: brokerId
    });
    
  if (error) {
    console.error("Error updating strategy config:", error);
    throw error;
  }
};

/**
 * Fetches broker details by ID
 */
export const fetchBrokerById = async (brokerId: string): Promise<{ broker_name: string } | null> => {
  console.log("Fetching broker details for ID:", brokerId);
  
  const { data, error } = await supabase
    .from('broker_credentials')
    .select('broker_name')
    .eq('id', brokerId)
    .single();
    
  if (error) {
    console.error("Error fetching broker details:", error);
    throw error;
  }
  
  console.log("Fetched broker details:", data);
  return data;
};

/**
 * Fetches all available brokers for a user
 */
export const fetchUserBrokers = async (userId: string): Promise<Array<{id: string, broker_name: string}>> => {
  console.log("Fetching connected brokers for user:", userId);
  
  const { data, error } = await supabase
    .from('broker_credentials')
    .select('id, broker_name')
    .eq('user_id', userId)
    .eq('status', 'connected');
    
  if (error) {
    console.error("Error fetching user brokers:", error);
    throw error;
  }
  
  console.log("Fetched connected brokers:", data);
  return data || [];
};
