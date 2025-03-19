
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  brokerId?: string,
  tradeType: string = "paper trade" // Default to paper trade
): Promise<void> => {
  try {
    console.log("Saving strategy configuration:", {
      userId, strategyId, strategyName, quantity, brokerName, brokerId, tradeType
    });
    
    // First check if a record already exists for this user, strategy, and broker
    const { data, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id, trade_type')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('selected_broker', brokerName)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking for existing record:", checkError);
      throw checkError;
    }
    
    // If record exists for this broker, update it but preserve existing trade_type if it was "paper trade"
    // or if the incoming trade_type is "paper trade"
    if (data) {
      // If either the existing trade_type is "paper trade" or the requested trade_type is "paper trade",
      // set to "paper trade". This ensures that once paper trade is selected, it remains set.
      const preservedTradeType = data.trade_type === "paper trade" || tradeType === "paper trade" 
        ? "paper trade" 
        : tradeType;
      
      console.log("Updating existing record with ID:", data.id);
      
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
        console.error("Error updating record:", error);
        throw error;
      }
    } else {
      // Insert a new record for this broker
      console.log("Creating new record for broker:", brokerName);
      
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
    }
    
    console.log("Strategy configuration saved successfully");
  } catch (error) {
    console.error("Error in saveStrategyConfiguration:", error);
    throw error;
  }
};
