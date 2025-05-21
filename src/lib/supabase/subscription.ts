
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
    // We specifically exclude plans that contain "Strategy" in the name as those are for specific strategies
    const hasPremium = planData && 
                      planData.length > 0 && 
                      (planData[0].plan_name === 'Premium' || 
                       planData[0].plan_name === 'Pro' || 
                       planData[0].plan_name === 'Elite') &&
                      !planData[0].plan_name.includes('Strategy') && 
                      planData[0].is_paid === true; // Added explicit check for is_paid being true
    
    console.log('Premium status check result:', {
      hasPlanData: !!planData?.length,
      planName: planData?.[0]?.plan_name,
      isPaid: planData?.[0]?.is_paid, // Log the is_paid status
      hasPremium,
      hasStrategyInName: planData?.[0]?.plan_name?.includes('Strategy')
    });
    
    return !!hasPremium;
  } catch (error) {
    console.error('Exception checking premium status:', error);
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
    
    // Standard premium subscription logic for plan-based premium access
    // We no longer need to query strategy_selections for paid strategies
    // as we're only using plan_details for access management
    return true;
  } catch (error) {
    console.error('Error in syncPremiumAccess:', error);
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
    
    console.log(`User ${userId} specific access to strategy ${strategyId}: ${hasSpecificAccess}`);
    
    return !!hasSpecificAccess;
  } catch (error) {
    console.error('Error checking strategy access:', error);
    return false;
  }
};
