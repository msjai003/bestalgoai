
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
  console.log(`Saving strategy configuration for user ${userId}, strategy ${strategyId} with paid status: ${paidStatus}`);
  
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
    
    // Double verification step for paid strategies - critical to ensure paid status is set
    if (paidStatus === 'paid') {
      console.log("Starting additional verification for paid strategy");
      
      // Verify the update was successful with explicit select
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
        console.error("Verification returned no data - unexpected");
        throw new Error("Strategy configuration not found after saving");
      }
      
      console.log("Verification data:", verifyData);
      
      // Force a direct update if 'paid' status is not correctly set
      if (verifyData.paid_status !== 'paid') {
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
      }
      
      // Use the database function as an additional guarantee for critical paid status
      try {
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
      } catch (rpcException) {
        console.error("Exception in RPC call:", rpcException);
        // Continue execution even if RPC fails - we already tried direct methods
      }
      
      // Final verification to confirm the strategy is marked as paid
      try {
        const { data: finalCheck } = await supabase
          .from('strategy_selections')
          .select('paid_status')
          .eq('user_id', userId)
          .eq('strategy_id', strategyId)
          .maybeSingle();
          
        console.log("Final verification result:", finalCheck);
      } catch (error) {
        console.error("Final verification failed:", error);
        // Just log the error, don't throw
      }
    }
    
    console.log("Strategy configuration save process completed successfully");
  } catch (error) {
    console.error("Error in saveStrategyConfiguration:", error);
    
    // Emergency fallback attempt if all other methods failed
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
          trade_type: tradeType,
          quantity: quantity || 0,
          selected_broker: brokerName || ""
        }, { onConflict: 'user_id,strategy_id' });
        
      console.log("Emergency fallback completed");
      
      // For critical paid status, one more try with the database function
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
    
    throw new Error(`Failed to save strategy configuration: ${error}`);
  }
};
