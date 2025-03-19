
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  brokerId: string, // Changed to string to match database schema
  tradeType: string = "live trade" // Keep default for this function as "live trade"
): Promise<void> => {
  console.log("Saving strategy configuration:", {
    userId,
    strategyId,
    strategyName,
    brokerName,
    brokerId,
    tradeType,
    quantity
  });
  
  // Look for an existing record with this specific broker for this strategy
  const { data, error: checkError } = await supabase
    .from('strategy_selections')
    .select('id, trade_type')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId)
    .eq('broker_id', brokerId)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking for existing record:", checkError);
    throw checkError;
  }
  
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
      
    if (error) {
      console.error("Error updating existing record:", error);
      throw error;
    }
    
    console.log("Updated existing strategy-broker configuration");
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
      
    if (error) {
      console.error("Error inserting new record:", error);
      throw error;
    }
    
    console.log("Inserted new strategy-broker configuration");
  }
};
