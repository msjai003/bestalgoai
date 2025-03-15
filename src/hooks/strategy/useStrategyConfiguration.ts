
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  tradeType: string = "live trade" // Add trade_type parameter with default value
): Promise<void> => {
  const { error } = await supabase
    .from('strategy_selections')
    .upsert({
      user_id: userId,
      strategy_id: strategyId,
      strategy_name: strategyName,
      strategy_description: strategyDescription,
      quantity: quantity,
      selected_broker: brokerName,
      trade_type: tradeType // Include trade_type in the upsert operation
    });

  if (error) throw error;
};
