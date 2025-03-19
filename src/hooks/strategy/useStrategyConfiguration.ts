
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
    
    // If a record exists, determine the correct paid status to use
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
      
      // Try the update operation
      const { error } = await supabase
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
        .eq('strategy_id', strategyId);
        
      if (error) {
        console.error("Error updating strategy:", error);
        
        // Fallback to direct upsert if update fails
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
          });
          
        if (upsertError) {
          console.error("Upsert fallback also failed:", upsertError);
          throw upsertError;
        } else {
          console.log("Successfully used upsert fallback");
        }
      }
    } else {
      // If no record exists, create a new one with the provided values
      console.log("Inserting new strategy with paid status:", paidStatus);
      
      // Try direct insert first
      const { error } = await supabase
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
        });
        
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
          });
          
        if (upsertError) {
          console.error("Upsert fallback also failed:", upsertError);
          throw upsertError;
        } else {
          console.log("Successfully used upsert fallback");
        }
      }
    }
    
    // Verify the update was successful with multiple attempts
    let verificationSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!verificationSuccess && attempts < maxAttempts) {
      attempts++;
      console.log(`Verification attempt ${attempts}...`);
      
      const { data: verifyData, error: verifyError } = await supabase
        .from('strategy_selections')
        .select('paid_status, trade_type')
        .eq('user_id', userId)
        .eq('strategy_id', strategyId)
        .maybeSingle();
        
      if (verifyError) {
        console.error(`Verification attempt ${attempts} failed:`, verifyError);
      } else if (verifyData) {
        console.log(`Verification attempt ${attempts} succeeded:`, verifyData);
        verificationSuccess = true;
        
        // If the paid status is not what we expected, try one more time to fix it
        if (paidStatus === 'paid' && verifyData.paid_status !== 'paid') {
          console.log("Paid status not correctly set, forcing update...");
          
          await supabase
            .from('strategy_selections')
            .update({ paid_status: 'paid' })
            .eq('user_id', userId)
            .eq('strategy_id', strategyId);
        }
      } else {
        console.log(`Verification attempt ${attempts} returned no data`);
      }
      
      // Small delay between attempts
      if (!verificationSuccess && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    if (!verificationSuccess) {
      console.warn("All verification attempts failed, making one last direct insert attempt");
      
      // Last resort: Try a completely new insert with minimal data
      try {
        await supabase
          .from('strategy_selections')
          .insert({
            user_id: userId,
            strategy_id: strategyId,
            strategy_name: strategyName,
            strategy_description: strategyDescription || "",
            paid_status: paidStatus,
            trade_type: tradeType,
            quantity: 0,
            selected_broker: ""
          });
          
        console.log("Final direct insert attempt completed");
      } catch (finalError) {
        console.error("Final direct insert attempt failed:", finalError);
      }
    }
    
    console.log("Strategy configuration save process completed");
  } catch (error) {
    console.error("Error in saveStrategyConfiguration:", error);
    
    // One final fallback attempt if we have an exception
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
