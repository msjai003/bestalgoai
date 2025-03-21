
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  brokerUsername: string = "", 
  tradeType: string = "live trade"
): Promise<void> => {
  // Always create a new row instead of checking for existing strategy
  // This allows the same strategy to be used with multiple brokers
  const { error } = await supabase
    .from('strategy_selections')
    .insert({
      user_id: userId,
      strategy_id: strategyId,
      strategy_name: strategyName,
      strategy_description: strategyDescription,
      quantity: quantity,
      selected_broker: brokerName,
      broker_username: brokerUsername,
      trade_type: tradeType,
      is_wishlisted: false // Default to not wishlisted for new configurations
    });
    
  if (error) throw error;
};
