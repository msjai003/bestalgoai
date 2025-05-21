
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
                       planData[0].plan_name === 'Elite');
    
    console.log('Premium status check result:', {
      hasPlanData: !!planData?.length,
      planName: planData?.[0]?.plan_name,
      hasPremium,
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
      
      // Find the strategy details from predefined_strategies
      const { data: strategyData, error: strategyError } = await supabase
        .from('predefined_strategies')
        .select('name, description')
        .eq('id', specificStrategyId)
        .single();
        
      if (strategyError) {
        console.error('Error fetching strategy details:', strategyError);
        return false;
      }
      
      // Force set the strategy's paid status
      if (strategyData) {
        try {
          await supabase.rpc('force_strategy_paid_status', {
            p_user_id: userId,
            p_strategy_id: specificStrategyId,
            p_strategy_name: strategyData.name,
            p_strategy_description: strategyData.description || ''
          });
          console.log(`Successfully set paid status for strategy ${specificStrategyId}`);
          return true;
        } catch (rpcError) {
          console.error('Error in force_strategy_paid_status RPC:', rpcError);
          return false;
        }
      }
    }
    
    // If premium status is true and this is a general premium upgrade (not specific strategy)
    // Then unlock all premium strategies
    if (premiumStatus && !specificStrategyId) {
      console.log(`Premium status set to true for user ${userId}, unlocking all premium strategies`);
      
      // Get all premium strategies
      const { data: premiumStrategies, error: strategiesError } = await supabase
        .from('predefined_strategies')
        .select('id, name, description')
        .eq('package', 'premium');
        
      if (strategiesError) {
        console.error('Error fetching premium strategies:', strategiesError);
        return false;
      }
      
      // Unlock each premium strategy
      if (premiumStrategies && premiumStrategies.length > 0) {
        console.log(`Found ${premiumStrategies.length} premium strategies to unlock`);
        
        for (const strategy of premiumStrategies) {
          try {
            await supabase.rpc('force_strategy_paid_status', {
              p_user_id: userId,
              p_strategy_id: strategy.id,
              p_strategy_name: strategy.name,
              p_strategy_description: strategy.description || ''
            });
            console.log(`Successfully set paid status for premium strategy ${strategy.id}: ${strategy.name}`);
          } catch (rpcError) {
            console.error(`Error setting paid status for strategy ${strategy.id}:`, rpcError);
            // Continue with other strategies even if one fails
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
    
    // First check if the user has premium status, which grants access to all premium strategies
    const hasPremium = await checkUserPremiumStatus(userId);
    
    if (hasPremium) {
      console.log(`User ${userId} has premium access to strategy ${strategyId}`);
      return true;
    }
    
    // If the user doesn't have premium access, check if they specifically purchased this strategy
    // by looking at the strategy_selections table
    const { data: strategyData, error: strategyError } = await supabase
      .from('strategy_selections')
      .select('*')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('paid_status', 'paid')
      .maybeSingle();
      
    if (strategyError) {
      console.error('Error checking specific strategy access:', strategyError);
      return false;
    }
    
    const hasSpecificAccess = !!strategyData;
    console.log(`User ${userId} specific access to strategy ${strategyId}: ${hasSpecificAccess}`);
    
    return hasSpecificAccess;
  } catch (error) {
    console.error('Error checking strategy access:', error);
    return false;
  }
};
