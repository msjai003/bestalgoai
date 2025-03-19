
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
  console.log("Saving strategy configuration with paid status:", paidStatus);
  
  try {
    // First check if a record already exists
    const { data, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id, trade_type, paid_status')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing strategy:", checkError);
      throw checkError;
    }
    
    // IMPORTANT: If a record exists, determine the correct paid status to use
    if (data) {
      // If either the existing trade_type is "paper trade" or the requested trade_type is "paper trade",
      // set to "paper trade". This ensures that once paper trade is selected, it remains set.
      const preservedTradeType = data.trade_type === "paper trade" || tradeType === "paper trade" 
        ? "paper trade" 
        : tradeType;
      
      // For paid status:
      // 1. If incoming status is 'paid', always use that
      // 2. If existing status is 'paid', preserve it
      // 3. Otherwise use the incoming status
      const preservedPaidStatus = paidStatus === "paid" 
        ? "paid" 
        : (data.paid_status === "paid" ? "paid" : paidStatus);
      
      console.log("Updating existing strategy with:", {
        preservedTradeType,
        preservedPaidStatus
      });
      
      const { error, data: updateData } = await supabase
        .from('strategy_selections')
        .update({
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          quantity: quantity,
          selected_broker: brokerName,
          trade_type: preservedTradeType,
          paid_status: preservedPaidStatus
        })
        .eq('user_id', userId)
        .eq('strategy_id', strategyId)
        .select();
        
      if (error) {
        console.error("Error updating strategy:", error);
        
        // Fallback to upsert if update fails
        const { error: upsertError } = await supabase
          .from('strategy_selections')
          .upsert({
            user_id: userId,
            strategy_id: strategyId,
            strategy_name: strategyName,
            strategy_description: strategyDescription,
            quantity: quantity || 0,
            selected_broker: brokerName || "",
            trade_type: preservedTradeType,
            paid_status: preservedPaidStatus
          }, { onConflict: 'user_id,strategy_id' });
          
        if (upsertError) throw upsertError;
      }
      
      console.log("Strategy update result:", updateData);
    } else {
      // If no record exists, create a new one with the provided values
      console.log("Inserting new strategy with paid status:", paidStatus);
      
      const { error, data: insertData } = await supabase
        .from('strategy_selections')
        .insert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          quantity: quantity || 0,
          selected_broker: brokerName || "",
          trade_type: tradeType,
          paid_status: paidStatus
        })
        .select();
        
      if (error) {
        console.error("Error inserting strategy:", error);
        
        // Fallback to upsert if insert fails
        const { error: upsertError } = await supabase
          .from('strategy_selections')
          .upsert({
            user_id: userId,
            strategy_id: strategyId,
            strategy_name: strategyName,
            strategy_description: strategyDescription,
            quantity: quantity || 0,
            selected_broker: brokerName || "",
            trade_type: tradeType,
            paid_status: paidStatus
          }, { onConflict: 'user_id,strategy_id' });
          
        if (upsertError) throw upsertError;
      }
      
      console.log("Strategy insert result:", insertData);
    }
    
    // Verify the update was successful
    const { data: verifyData, error: verifyError } = await supabase
      .from('strategy_selections')
      .select('paid_status, trade_type')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .single();
      
    if (verifyError) {
      console.error("Error verifying strategy update:", verifyError);
      
      // Try one more verification with maybeSingle
      const { data: verifyData2, error: verifyError2 } = await supabase
        .from('strategy_selections')
        .select('paid_status, trade_type')
        .eq('user_id', userId)
        .eq('strategy_id', strategyId)
        .maybeSingle();
        
      if (!verifyError2 && verifyData2) {
        console.log("Verified strategy configuration on second attempt:", verifyData2);
      } else {
        console.error("Second verification attempt also failed:", verifyError2);
      }
    } else {
      console.log("Verified strategy configuration:", verifyData);
    }
    
    console.log("Strategy configuration saved successfully");
  } catch (error) {
    console.error("Error saving strategy configuration:", error);
    throw error;
  }
};
