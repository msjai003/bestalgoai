
import { supabase } from "@/integrations/supabase/client";
import { Strategy, BrokerConfig } from "./types";

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
        // Create a dictionary to track unique strategies
        const strategiesMap = new Map<number, BrokerConfig[]>();
        
        // Process each strategy selection and organize by strategy_id
        data.forEach(item => {
          const brokerConfig: BrokerConfig = {
            brokerId: item.broker_id || "",
            brokerName: item.selected_broker || "",
            quantity: item.quantity || 0,
            tradeType: item.trade_type || "paper trade",
            isLive: item.trade_type === "live trade"
          };
          
          // Add to our map of strategies
          if (!strategiesMap.has(item.strategy_id)) {
            strategiesMap.set(item.strategy_id, []);
          }
          
          strategiesMap.get(item.strategy_id)?.push(brokerConfig);
        });
        
        // Convert the map to an array of strategies
        const dbStrategies = Array.from(strategiesMap.entries()).map(([strategyId, brokerConfigs]) => {
          // Use the first broker configuration as a base for the strategy
          const firstConfig = brokerConfigs[0];
          const strategyData = data.find(item => item.strategy_id === strategyId);
          
          const strategy: Strategy = {
            id: strategyId,
            name: strategyData?.strategy_name || `Strategy ${strategyId}`,
            description: strategyData?.strategy_description || "",
            isWishlisted: true,
            isLive: firstConfig.isLive,
            quantity: firstConfig.quantity,
            selectedBroker: firstConfig.brokerName,
            brokerId: firstConfig.brokerId,
            tradeType: firstConfig.tradeType,
            performance: {
              winRate: "N/A",
              avgProfit: "N/A",
              drawdown: "N/A"
            }
          };
          
          // If we have multiple configurations for this strategy, add them
          if (brokerConfigs.length > 1) {
            return {
              ...strategy,
              hasMultipleBrokers: true,
              brokerConfigs: brokerConfigs
            };
          }
          
          return strategy;
        });
        
        // Merge with strategies from localStorage, ensuring no duplicates
        strategies = [...dbStrategies];
        
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
  tradeType: string = "paper trade"
): Promise<void> => {
  console.log("Updating strategy config:", {
    userId,
    strategyId,
    quantity,
    brokerName,
    brokerId,
    tradeType
  });
  
  if (brokerId) {
    // First check if a record already exists for this user, strategy, and broker combination
    const { data, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('broker_id', brokerId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing strategy:", checkError);
      throw checkError;
    }
    
    // If record exists, update it. Otherwise, insert a new one
    let updateResult;
    
    if (data) {
      // Update existing record
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
        .eq('id', data.id);
    } else {
      // Insert new record
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
  } else {
    // Fallback to original behavior if no broker_id is provided
    const { data, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing strategy:", checkError);
      throw checkError;
    }
    
    // If record exists, update it. Otherwise, insert a new one
    let updateResult;
    
    if (data) {
      // Update existing record
      updateResult = await supabase
        .from('strategy_selections')
        .update({
          quantity: quantity || 0,
          selected_broker: brokerName,
          trade_type: tradeType,
          strategy_name: strategyName,
          strategy_description: strategyDescription
        })
        .eq('id', data.id);
    } else {
      // Insert new record
      updateResult = await supabase
        .from('strategy_selections')
        .insert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          quantity: quantity || 0,
          selected_broker: brokerName,
          trade_type: tradeType
        });
    }
    
    if (updateResult.error) {
      console.error("Error updating strategy config:", updateResult.error);
      throw updateResult.error;
    }
  }
};

/**
 * Fetches broker details by ID
 */
export const fetchBrokerById = async (brokerId: string): Promise<{ broker_name: string; id: string } | null> => {
  console.log("Fetching broker details for ID:", brokerId);
  
  const { data, error } = await supabase
    .from('broker_credentials')
    .select('broker_name, id')
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
