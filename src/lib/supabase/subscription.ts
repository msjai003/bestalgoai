
import { supabase } from '@/integrations/supabase/client';

/**
 * Syncs the wishlist status for a strategy in the wishlist_maintain table
 * @param userId The user's ID
 * @param strategyId The strategy ID
 * @param strategyName The name of the strategy
 * @param strategyDescription The description of the strategy
 * @returns Promise<void>
 */
export const syncWishlistMaintain = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  isWishlisted: boolean
): Promise<void> => {
  try {
    if (isWishlisted) {
      // Add to wishlist_maintain table
      const { error } = await supabase
        .from('wishlist_maintain')
        .upsert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription
        }, {
          onConflict: 'user_id,strategy_id'
        });
        
      if (error) {
        console.error('Error adding to wishlist_maintain:', error);
        throw error;
      }
    } else {
      // Remove from wishlist_maintain table
      const { error } = await supabase
        .from('wishlist_maintain')
        .delete()
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);
        
      if (error) {
        console.error('Error removing from wishlist_maintain:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in syncWishlistMaintain:', error);
    throw error;
  }
};

/**
 * Check if a user has premium access
 * @param userId The user's ID to check subscription status for
 * @returns boolean indicating if the user has an active premium subscription
 */
export const checkUserPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking premium status for user:', userId);
    
    // Query the plan_details table for the most recent subscription
    const { data: planData, error: planError } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', true)  // Make sure we only look at paid subscriptions
      .order('selected_at', { ascending: false })
      .limit(1);
      
    if (planError) {
      console.error('Error fetching plan details:', planError);
      return false;
    }
    
    // Check if a valid premium subscription exists
    // Premium, Pro, or Elite plans grant universal access to all premium strategies
    const hasPremium = planData && 
                      planData.length > 0 && 
                      (planData[0].plan_name === 'Premium' || 
                       planData[0].plan_name === 'Pro' || 
                       planData[0].plan_name === 'Elite') &&
                      planData[0].is_paid === true; // Explicitly verify is_paid is true
    
    console.log('Premium status check result:', {
      hasPlanData: !!planData?.length,
      planName: planData?.[0]?.plan_name,
      hasPremium,
      isPaid: planData?.[0]?.is_paid,
    });
    
    return !!hasPremium;
  } catch (error) {
    console.error('Exception checking premium status:', error);
    return false;
  }
};

/**
 * Checks if a user has access to a specific strategy, either through individual purchase or premium status
 * @param userId The user's ID
 * @param strategyId The strategy ID to check access for
 * @returns Promise<boolean> indicating if the user has access to the strategy
 */
export const checkStrategyAccess = async (
  userId: string,
  strategyId: number
): Promise<boolean> => {
  try {
    console.log(`Checking strategy access for user ${userId}, strategy ${strategyId}`);
    
    // Check if the user has premium status, which grants access to all premium strategies
    const hasPremium = await checkUserPremiumStatus(userId);
    
    if (hasPremium) {
      console.log(`User ${userId} has premium access to strategy ${strategyId}`);
      return true;
    }
    
    // Convert strategyId to string for comparisons
    const strategyIdStr = String(strategyId);
    
    // If the user doesn't have premium access, check if they specifically purchased this strategy
    // by looking at the plan_details table with this specific strategy
    const { data: planData, error: planError } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', true)
      .order('selected_at', { ascending: false });
      
    if (planError) {
      console.error('Error checking specific strategy access:', planError);
      return false;
    }
    
    // If any plan entry references this strategy, grant access
    const hasSpecificAccess = planData && planData.some(plan => {
      // Check if plan name explicitly includes this specific strategy ID
      const hasStrategyIdInPlan = 
        plan.plan_name.includes(`- Strategy ${strategyIdStr}`) || 
        plan.plan_name.includes(`Strategy ${strategyIdStr}`);
      
      console.log(`Plan check for ${plan.plan_name}:`, {
        strategyIdStr,
        hasStrategyIdInPlan
      });
      
      return hasStrategyIdInPlan;
    });
    
    // Also check strategy_selections table for paid status
    const { data: strategyData, error: strategyError } = await supabase
      .from('strategy_selections')
      .select('*')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('paid_status', 'paid')
      .maybeSingle();
      
    if (strategyError) {
      console.error('Error checking strategy_selections:', strategyError);
    }
    
    const hasStrategyAccess = !!strategyData;
    
    console.log(`User ${userId} access to strategy ${strategyId}:`, {
      hasSpecificAccess,
      hasStrategyAccess,
      finalAccess: hasSpecificAccess || hasStrategyAccess
    });
    
    return hasSpecificAccess || hasStrategyAccess;
  } catch (error) {
    console.error('Error checking strategy access:', error);
    return false;
  }
};

/**
 * Updates a user's premium access in both strategy_selections and wishlist tables
 * @param userId The user's ID
 * @param premiumStatus The premium status to set
 * @param specificStrategyId The specific strategy ID to update (optional)
 * @returns Promise<boolean> indicating if the operation was successful
 */
export const syncPremiumAccess = async (
  userId: string,
  premiumStatus: boolean,
  specificStrategyId?: number
): Promise<boolean> => {
  try {
    if (specificStrategyId) {
      console.log(`Syncing access for user ${userId} to specific strategy ${specificStrategyId}, premiumStatus=${premiumStatus}`);
    } else {
      console.log(`Syncing premium access for user ${userId} to ${premiumStatus}`);
    }

    // If we're dealing with a specific strategy unlock
    if (specificStrategyId) {
      // We don't need to do anything with the strategy_selections table anymore
      // The plan_details entry is sufficient to grant access
      console.log(`Strategy ${specificStrategyId} access is now managed through plan_details`);
      return true;
    }
    
    // If the user has premium status, we need to update all premium strategies 
    // to mark them as accessible by adding entries to strategy_selections
    if (premiumStatus) {
      console.log(`Setting premium access to TRUE for user ${userId}`);
      
      // Get all premium strategies from predefined_strategies
      const { data: premiumStrategies, error: strategiesError } = await supabase
        .from('predefined_strategies')
        .select('*')
        .eq('package', 'premium');
      
      if (strategiesError) {
        console.error('Error fetching premium strategies:', strategiesError);
        return false;
      }
      
      // For each premium strategy, ensure the user has an entry in strategy_selections
      // This is only for visibility in the UI, as we now check premium status directly
      if (premiumStrategies && premiumStrategies.length > 0) {
        console.log(`Found ${premiumStrategies.length} premium strategies to sync`);
        
        for (const strategy of premiumStrategies) {
          const { data: existingSelection, error: selectionError } = await supabase
            .from('strategy_selections')
            .select('*')
            .eq('user_id', userId)
            .eq('strategy_id', strategy.id)
            .maybeSingle();
          
          if (selectionError) {
            console.error(`Error checking existing selection for strategy ${strategy.id}:`, selectionError);
            continue;
          }
          
          if (existingSelection) {
            // Update existing entry to mark it as paid
            const { error: updateError } = await supabase
              .from('strategy_selections')
              .update({ 
                paid_status: 'paid' 
              })
              .eq('user_id', userId)
              .eq('strategy_id', strategy.id);
              
            if (updateError) {
              console.error(`Error updating strategy selection for strategy ${strategy.id}:`, updateError);
            } else {
              console.log(`Updated strategy selection for strategy ${strategy.id}`);
            }
          } else {
            // Create new entry for this strategy
            const { error: insertError } = await supabase
              .from('strategy_selections')
              .insert({
                user_id: userId,
                strategy_id: strategy.id,
                strategy_name: strategy.name,
                strategy_description: strategy.description,
                paid_status: 'paid',
                is_wishlisted: false,
                trade_type: 'paper trade',
                quantity: 0
              });
              
            if (insertError) {
              console.error(`Error inserting strategy selection for strategy ${strategy.id}:`, insertError);
            } else {
              console.log(`Inserted strategy selection for strategy ${strategy.id}`);
            }
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in syncPremiumAccess:', error);
    return false;
  }
};
