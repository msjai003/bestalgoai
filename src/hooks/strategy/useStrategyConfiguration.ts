
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  brokerId?: string, // Add broker ID parameter
  tradeType: string = "live trade" // Keep default for this function as "live trade"
): Promise<void> => {
  console.log("Saving strategy configuration:", {
    userId,
    strategyId,
    brokerName,
    brokerId,
    tradeType
  });
  
  // When we have a brokerId, we don't need to check for existing records by strategy_id alone
  // Instead we'll use the combination of strategy_id and broker_id as the unique identifier
  if (brokerId) {
    // Look for an existing record with this specific broker for this strategy
    const { data, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id, trade_type')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('broker_id', brokerId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If this specific strategy-broker combination exists, update it
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
          broker_id: brokerId,
          trade_type: preservedTradeType
        })
        .eq('id', data.id);
        
      if (error) throw error;
    } else {
      // Insert a new record for this broker
      const { error } = await supabase
        .from('strategy_selections')
        .insert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          quantity: quantity,
          selected_broker: brokerName,
          broker_id: brokerId,
          trade_type: tradeType
        });
        
      if (error) throw error;
    }
  } else {
    // Fallback to original behavior if no broker_id provided (backward compatibility)
    const { data, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id, trade_type')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (data) {
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
          trade_type: preservedTradeType
        })
        .eq('id', data.id);
        
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
  }
};
