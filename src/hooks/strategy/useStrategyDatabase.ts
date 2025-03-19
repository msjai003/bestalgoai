
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
        // Group by strategy_id to handle multiple brokers
        const strategyMap = new Map<number, any>();
        
        for (const item of data) {
          if (!strategyMap.has(item.strategy_id)) {
            strategyMap.set(item.strategy_id, {
              id: item.strategy_id,
              name: item.strategy_name,
              description: item.strategy_description || "",
              isWishlisted: true,
              isLive: item.trade_type === "live trade",
              quantity: item.quantity || 0,
              selectedBroker: item.selected_broker || "",
              tradeType: item.trade_type || "paper trade",
              selectedBrokers: [{
                brokerId: item.broker_id || "",
                brokerName: item.selected_broker || "",
                quantity: item.quantity || 0
              }],
              performance: {
                winRate: "N/A",
                avgProfit: "N/A",
                drawdown: "N/A"
              }
            });
          } else {
            const strategy = strategyMap.get(item.strategy_id);
            
            // Add additional broker
            if (!strategy.selectedBrokers.some((b: any) => b.brokerName === item.selected_broker)) {
              strategy.selectedBrokers.push({
                brokerId: item.broker_id || "",
                brokerName: item.selected_broker || "",
                quantity: item.quantity || 0
              });
            }
            
            // Set as live if any configuration is live
            if (item.trade_type === "live trade") {
              strategy.isLive = true;
            }
          }
        }
        
        strategies = Array.from(strategyMap.values());
        localStorage.setItem('wishlistedStrategies', JSON.stringify(strategies));
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
  brokerName: string | null,
  brokerId?: string,
  tradeType: string = "paper trade" // Updated default to "paper trade"
): Promise<void> => {
  console.log("Updating strategy config:", {
    userId,
    strategyId,
    quantity,
    brokerName,
    brokerId,
    tradeType
  });
  
  // This function will now add a new entry for each broker selection
  // First check if a record already exists for this user, strategy, and broker
  const { data, error: checkError } = await supabase
    .from('strategy_selections')
    .select('id')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId)
    .eq('selected_broker', brokerName)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking existing strategy:", checkError);
    throw checkError;
  }
  
  // If record exists for this broker, update it. Otherwise, insert a new one
  let updateResult;
  
  if (data) {
    // Update existing record for this broker
    updateResult = await supabase
      .from('strategy_selections')
      .update({
        quantity: quantity || 0,
        selected_broker: brokerName,
        broker_id: brokerId,
        trade_type: tradeType,
        strategy_name: strategyName,
        strategy_description: strategyDescription
      })
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('selected_broker', brokerName);
  } else {
    // Insert new record for this broker
    updateResult = await supabase
      .from('strategy_selections')
      .insert({
        user_id: userId,
        strategy_id: strategyId,
        strategy_name: strategyName,
        strategy_description: strategyDescription,
        quantity: quantity || 0,
        selected_broker: brokerName,
        broker_id: brokerId,
        trade_type: tradeType
      });
  }
  
  if (updateResult.error) {
    console.error("Error updating strategy config:", updateResult.error);
    throw updateResult.error;
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
