
import { supabase } from '@/integrations/supabase/client';

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
    
    // Check if a valid subscription exists
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
 * Check if a user has access to a specific strategy
 * @param userId The user's ID
 * @param strategyId The strategy ID to check access for
 * @returns boolean indicating if the user can access this strategy
 */
export const checkStrategyAccess = async (userId: string, strategyId: number): Promise<boolean> => {
  try {
    // First, check if the user has general premium access
    const hasPremium = await checkUserPremiumStatus(userId);
    if (hasPremium) {
      return true;
    }
    
    // If not, check if this specific strategy has been individually purchased/unlocked
    const { data, error } = await supabase
      .from('strategy_selections')
      .select('id, paid_status')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (error) {
      console.error('Error checking strategy access:', error);
      return false;
    }
    
    // Strategy is accessible if it exists in the user's selection and is marked as paid
    return data && data.length > 0 && data[0].paid_status === 'paid';
  } catch (error) {
    console.error('Exception checking strategy access:', error);
    return false;
  }
};

/**
 * Sync premium access for a user - marks appropriate strategies as accessible
 * @param userId The user's ID to sync premium access for
 * @returns boolean indicating success
 */
export const syncPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    console.log('Syncing premium access for user:', userId);
    
    // Get all premium strategies
    const { data: premiumStrategies, error: strategiesError } = await supabase
      .from('predefined_strategies')
      .select('id, name')
      .eq('package', 'premium');
      
    if (strategiesError) {
      console.error('Error fetching premium strategies:', strategiesError);
      return false;
    }
    
    if (!premiumStrategies || premiumStrategies.length === 0) {
      console.log('No premium strategies found to sync');
      return true; // Nothing to do
    }
    
    console.log(`Found ${premiumStrategies.length} premium strategies to sync`);
    
    // For each premium strategy, ensure the user has access in the strategy_selections table
    for (const strategy of premiumStrategies) {
      // Check if this strategy is already in the user's selections
      const { data: existingSelection, error: selectionError } = await supabase
        .from('strategy_selections')
        .select('id, paid_status')
        .eq('user_id', userId)
        .eq('strategy_id', strategy.id)
        .maybeSingle();
        
      if (selectionError) {
        console.error(`Error checking existing selection for strategy ${strategy.id}:`, selectionError);
        continue;
      }
      
      if (existingSelection) {
        // Update existing selection to 'paid' status if not already
        if (existingSelection.paid_status !== 'paid') {
          const { error: updateError } = await supabase
            .from('strategy_selections')
            .update({ paid_status: 'paid' })
            .eq('id', existingSelection.id);
            
          if (updateError) {
            console.error(`Error updating selection status for strategy ${strategy.id}:`, updateError);
          } else {
            console.log(`Updated selection status for strategy ${strategy.id} to paid`);
          }
        }
      } else {
        // Create new selection with 'paid' status
        const { error: insertError } = await supabase
          .from('strategy_selections')
          .insert({
            user_id: userId,
            strategy_id: strategy.id,
            strategy_name: strategy.name,
            paid_status: 'paid'
          });
          
        if (insertError) {
          console.error(`Error creating selection for strategy ${strategy.id}:`, insertError);
        } else {
          console.log(`Created paid selection for strategy ${strategy.id}`);
        }
      }
    }
    
    console.log('Premium access sync completed successfully');
    return true;
  } catch (error) {
    console.error('Exception syncing premium access:', error);
    return false;
  }
};

/**
 * Sync wishlist status with the wishlist_maintain table
 * @param userId User ID
 * @param strategyId Strategy ID
 * @param strategyName Strategy name
 * @param strategyDescription Strategy description
 * @param isWishlisted Boolean indicating if the strategy should be added to wishlist (true) or removed (false)
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
      // Add to wishlist - insert if not exists, upsert will not update if it exists
      const { error } = await supabase
        .from('wishlist_maintain')
        .upsert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription
        }, { onConflict: 'user_id,strategy_id', ignoreDuplicates: true });

      if (error) {
        console.error('Error adding strategy to wishlist_maintain:', error);
        throw error;
      }
      console.log(`Strategy ${strategyId} added to wishlist_maintain for user ${userId}`);
    } else {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist_maintain')
        .delete()
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);

      if (error) {
        console.error('Error removing strategy from wishlist_maintain:', error);
        throw error;
      }
      console.log(`Strategy ${strategyId} removed from wishlist_maintain for user ${userId}`);
    }
  } catch (error) {
    console.error('Exception syncing wishlist maintain:', error);
    throw error;
  }
};
