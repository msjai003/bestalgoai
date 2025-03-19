
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
      }, { 
        onConflict: 'user_id,strategy_id',
        ignoreDuplicates: false // Ensure an update happens if conflict
      });
      
    if (upsertError) {
      console.error("Initial upsert failed:", upsertError);
      throw upsertError;
    }
    
    console.log("Strategy configuration saved successfully via upsert");
    
    // Verify the update was successful, especially important for paid status
    const { data: verifyData, error: verifyError } = await supabase
      .from('strategy_selections')
      .select('paid_status, trade_type, strategy_id')
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
    
    // If we're trying to set paid status but it's not set properly, try a direct update
    if (paidStatus === 'paid' && verifyData.paid_status !== 'paid') {
      console.log("Paid status not correctly set, forcing direct update...");
      
      const { error: updateError } = await supabase
        .from('strategy_selections')
        .update({ paid_status: 'paid' })
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);
        
      if (updateError) {
        console.error("Forced update failed:", updateError);
        throw updateError;
      }
      
      console.log("Forced direct update succeeded");
      
      // Double-check the update took effect
      const { data: recheckData, error: recheckError } = await supabase
        .from('strategy_selections')
        .select('paid_status')
        .eq('user_id', userId)
        .eq('strategy_id', strategyId)
        .single();
        
      if (recheckError || !recheckData || recheckData.paid_status !== 'paid') {
        console.error("Strategy still not marked as paid after direct update");
        // Will try database function as last resort below
      } else {
        console.log("Strategy successfully marked as paid after recheck");
      }
    }
    
    // If we're dealing with a paid strategy, use the database function as an additional guarantee
    if (paidStatus === 'paid') {
      console.log("Using database function to enforce paid status...");
      const { error: rpcError } = await supabase
        .rpc('force_strategy_paid_status', {
          p_user_id: userId,
          p_strategy_id: strategyId,
          p_strategy_name: strategyName,
          p_strategy_description: strategyDescription
        });
      
      if (rpcError) {
        console.error("Database function error:", rpcError);
      } else {
        console.log("Database function executed successfully");
      }
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
      
      // For critical paid status, try one more time with the database function
      if (paidStatus === 'paid') {
        await supabase
          .rpc('force_strategy_paid_status', {
            p_user_id: userId,
            p_strategy_id: strategyId,
            p_strategy_name: strategyName,
            p_strategy_description: strategyDescription
          });
        console.log("Emergency database function call completed");
      }
    } catch (fallbackError) {
      console.error("Emergency fallback also failed:", fallbackError);
    }
    
    throw error;
  }
};
