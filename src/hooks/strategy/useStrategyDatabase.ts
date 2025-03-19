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
        // Map database strategies directly to our format
        const dbStrategies = data.map(item => ({
          id: item.strategy_id,
          name: item.strategy_name,
          description: item.strategy_description || "",
          isWishlisted: true,
          // Only set isLive to true if trade_type is explicitly "live trade"
          isLive: item.trade_type === "live trade",
          quantity: item.quantity || 0,
          selectedBroker: item.selected_broker || "",
          tradeType: item.trade_type || "paper trade",
          paidStatus: item.paid_status || "free",
          performance: {
            winRate: "N/A",
            avgProfit: "N/A",
            drawdown: "N/A"
          }
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
  brokerName: string | null,
  tradeType: string = "paper trade", // Updated default to "paper trade"
  paidStatus: string = "free" // Add paid status parameter with default "free"
): Promise<void> => {
  console.log("Updating strategy config:", {
    userId,
    strategyId,
    quantity,
    brokerName,
    tradeType,
    paidStatus
  });
  
  // First check if a record already exists for this user and strategy
  const { data, error: checkError } = await supabase
    .from('strategy_selections')
    .select('id, paid_status')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking existing strategy:", checkError);
    throw checkError;
  }
  
  // Preserve paid status if it's already set to "paid"
  const finalPaidStatus = data?.paid_status === "paid" ? "paid" : paidStatus;
  console.log("Final paid status to be set:", finalPaidStatus);
  
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
        strategy_description: strategyDescription,
        paid_status: finalPaidStatus
      })
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
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
        trade_type: tradeType,
        paid_status: finalPaidStatus
      });
  }
  
  if (updateResult.error) {
    console.error("Error updating strategy config:", updateResult.error);
    throw updateResult.error;
  }
  
  console.log("Strategy configuration updated successfully");
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
