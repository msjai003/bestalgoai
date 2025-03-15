
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
      const { data, error } = await supabase
        .from('strategy_selections')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Map database data to Strategy type
        const dbStrategies: Strategy[] = data.map(item => ({
          id: item.strategy_id,
          name: item.strategy_name,
          description: item.strategy_description || "",
          isWishlisted: true,
          isLive: Boolean(item.quantity > 0 && item.selected_broker),
          quantity: item.quantity || 0,
          selectedBroker: item.selected_broker || "",
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
  brokerId: string | null
): Promise<void> => {
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
    
  if (error) throw error;
};

/**
 * Fetches broker details by ID
 */
export const fetchBrokerById = async (brokerId: string): Promise<{ broker_name: string } | null> => {
  const { data, error } = await supabase
    .from('broker_credentials')
    .select('broker_name')
    .eq('id', brokerId)
    .single();
    
  if (error) throw error;
  return data;
};
