
import { supabase } from "@/integrations/supabase/client";

// Helper function to save strategy configuration to database
export const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string,
  tradeType: string = "live trade", // Default for most configurations
  paidStatus: string = "free" // Default paid status is "free" unless specified
): Promise<void> => {
  console.log("Saving strategy configuration with paid status:", paidStatus);
  
  try {
    // First try direct upsert for maximum reliability
    const { error: upsertError } = await supabase
      .from('strategy_selections')
      .upsert({
        user_id: userId,
        strategy_id: strategyId,
        strategy_name: strategyName,
        strategy_description: strategyDescription || "",
        quantity: quantity || 0,
        selected_broker: brokerName || "",
        trade_type: tradeType,
        paid_status: paidStatus
      }, { onConflict: 'user_id,strategy_id' });
      
    if (upsertError) {
      console.error("Initial upsert failed:", upsertError);
      throw upsertError;
    }
    
    console.log("Strategy configuration saved successfully via upsert");
    
    // Verify the update was successful
    const { data: verifyData, error: verifyError } = await supabase
      .from('strategy_selections')
      .select('paid_status, trade_type')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
      
    if (verifyError) {
      console.error("Verification failed:", verifyError);
      throw verifyError;
    }
    
    if (!verifyData) {
      console.error("Verification returned no data");
      throw new Error("Strategy configuration not found after saving");
    }
    
    console.log("Verification succeeded:", verifyData);
    
    // If we're trying to set paid status but it's not set properly, try one more time
    if (paidStatus === 'paid' && verifyData.paid_status !== 'paid') {
      console.log("Paid status not correctly set, forcing update...");
      
      const { error: updateError } = await supabase
        .from('strategy_selections')
        .update({ paid_status: 'paid' })
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);
        
      if (updateError) {
        console.error("Forced update failed:", updateError);
        throw updateError;
      }
      
      console.log("Forced update succeeded");
    }
    
    console.log("Strategy configuration save process completed");
  } catch (error) {
    console.error("Error in saveStrategyConfiguration:", error);
    
    // Emergency fallback attempt if we have an exception
    try {
      console.log("Making emergency fallback insert attempt...");
      
      await supabase
        .from('strategy_selections')
        .upsert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription || "",
          paid_status: paidStatus,
          trade_type: "paper trade", // Safer default
          quantity: 0,
          selected_broker: ""
        }, { onConflict: 'user_id,strategy_id' });
        
      console.log("Emergency fallback completed");
    } catch (fallbackError) {
      console.error("Emergency fallback also failed:", fallbackError);
    }
    
    throw error;
  }
};
