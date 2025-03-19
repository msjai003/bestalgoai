
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
      // Continue to try other methods
    } else {
      console.log("Strategy configuration saved successfully via upsert");
      // Continue with verification to be sure
    }
    
    // Check if a record already exists to determine the right approach
    const { data, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id, trade_type, paid_status')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing strategy:", checkError);
      // Since we already attempted an upsert, continue
    }
    
    // If a record exists, update it while preserving certain values
    if (data) {
      // Preserve paper trade setting if it was previously set
      const preservedTradeType = data.trade_type === "paper trade" || tradeType === "paper trade" 
        ? "paper trade" 
        : tradeType;
      
      // Critical: Preserve paid status - never downgrade from paid to free
      const preservedPaidStatus = paidStatus === "paid" 
        ? "paid" // Always use paid if that's what we're setting
        : (data.paid_status === "paid" ? "paid" : paidStatus); // Otherwise keep paid if it was already paid
      
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
      
      // Try direct insert
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
        
        // If we're trying to set paid status but it's not set properly, try one more time
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
