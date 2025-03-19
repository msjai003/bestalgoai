
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  tradeType: string = "live trade", // Keep default for this function as "live trade"
  paidStatus: string = "free" // Default paid status is "free"
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
  // or if the incoming trade_type is "paper trade"
  if (data) {
    // If either the existing trade_type is "paper trade" or the requested trade_type is "paper trade",
    // set to "paper trade". This ensures that once paper trade is selected, it remains set.
    const preservedTradeType = data.trade_type === "paper trade" || tradeType === "paper trade" 
      ? "paper trade" 
      : tradeType;
    
    const { error } = await supabase
      .from('strategy_selections')
      .update({
        strategy_name: strategyName,
        strategy_description: strategyDescription,
        quantity: quantity,
        selected_broker: brokerName,
        trade_type: preservedTradeType,
        paid_status: paidStatus
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
        trade_type: tradeType,
        paid_status: paidStatus
      });
      
    if (error) throw error;
  }
};
