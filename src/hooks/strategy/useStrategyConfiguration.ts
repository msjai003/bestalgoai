
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  tradeType: string = "live trade" // Keep default for this function as "live trade"
): Promise<void> => {
  // First check if a record already exists
  const { data, error: checkError } = await supabase
    .from('strategy_selections')
    .select('id, trade_type')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId)
    .maybeSingle();
    
  if (checkError) throw checkError;
  
  // If record exists, update it but preserve existing trade_type if it was "paper trade"
  if (data) {
    // Preserve "paper trade" setting if it was already set to that
    const preservedTradeType = data.trade_type === "paper trade" ? "paper trade" : tradeType;
    
    const { error } = await supabase
      .from('strategy_selections')
      .update({
        strategy_name: strategyName,
        strategy_description: strategyDescription,
        quantity: quantity,
        selected_broker: brokerName,
        trade_type: preservedTradeType
      })
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('strategy_selections')
      .insert({
        user_id: userId,
        strategy_id: strategyId,
        strategy_name: strategyName,
        strategy_description: strategyDescription,
        quantity: quantity,
        selected_broker: brokerName,
        trade_type: tradeType
      });
      
    if (error) throw error;
  }
};
