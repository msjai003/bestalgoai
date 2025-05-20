
import { supabase } from '@/integrations/supabase/client';

/**
 * Syncs the wishlist status for a strategy in the wishlist_maintain table
 * @param userId The user's ID
 * @param strategyId The strategy ID
 * @param strategyName The name of the strategy
 * @param strategyDescription The description of the strategy
 * @param isWishlisted Whether the strategy should be wishlisted or not
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
    
    // Check if a valid subscription exists - only Premium, Pro, or Elite plans grant universal access
    const hasPremium = planData && 
                      planData.length > 0 && 
                      (planData[0].plan_name === 'Premium' || 
                       planData[0].plan_name === 'Pro' || 
                       planData[0].plan_name === 'Elite');
    
    console.log('Premium status check result:', {
      hasPlanData: !!planData?.length,
      planName: planData?.[0]?.plan_name,
      hasPremium
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
      // Only mark the specific strategy as paid, not applying full premium access
      const { error: updateError } = await supabase
        .from('strategy_selections')
        .update({ paid_status: 'paid' })
        .eq('user_id', userId)
        .eq('strategy_id', specificStrategyId);
        
      if (updateError) {
        console.error(`Error updating paid status for strategy ${specificStrategyId}:`, updateError);
        return false;
      }
      
      console.log(`Successfully updated paid status for strategy ${specificStrategyId}`);
      return true;
    }
    
    // Standard premium subscription logic (unchanged)
    // First, determine which strategies were previously paid for
    const { data: paidStrategies, error: queryError } = await supabase
      .from('strategy_selections')
      .select('strategy_id, strategy_name, strategy_description')
      .eq('user_id', userId)
      .eq('paid_status', 'paid');

    if (queryError) {
      console.error('Error querying paid strategies:', queryError);
      throw queryError;
    }
    
    // If we're upgrading to premium, we don't need to do anything with individual
    // strategy payments since premium access covers all strategies
    if (premiumStatus) {
      console.log('User upgraded to premium, no need to modify individual strategy payments');
      return true;
    }

    // If we're downgrading from premium, we need to ensure previously individually
    // paid strategies remain accessible
    if (paidStrategies && paidStrategies.length > 0) {
      console.log(`Found ${paidStrategies.length} individually paid strategies to preserve`);
      
      // For each previously paid strategy, ensure it remains marked as paid
      for (const strategy of paidStrategies) {
        const { error: updateError } = await supabase
          .from('strategy_selections')
          .update({ paid_status: 'paid' })
          .eq('user_id', userId)
          .eq('strategy_id', strategy.strategy_id);
          
        if (updateError) {
          console.error(`Error preserving paid status for strategy ${strategy.strategy_id}:`, updateError);
          // Continue with other strategies even if one fails
        }
      }
    }
    
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
    
    // Check if the user has specifically paid for this strategy
    const { data: strategyData, error: strategyError } = await supabase
      .from('strategy_selections')
      .select('paid_status')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
      
    if (strategyError) {
      console.error('Error checking strategy access:', strategyError);
      return false;
    }
    
    // If the user has specifically paid for this strategy, grant access
    if (strategyData && strategyData.paid_status === 'paid') {
      console.log(`User ${userId} has individual access to strategy ${strategyId}`);
      return true;
    }
    
    // Check if the user has premium status, which grants access to all premium strategies
    const hasPremium = await checkUserPremiumStatus(userId);
    console.log(`User ${userId} premium status: ${hasPremium}`);
    
    return hasPremium;
  } catch (error) {
    console.error('Error checking strategy access:', error);
    return false;
  }
};
