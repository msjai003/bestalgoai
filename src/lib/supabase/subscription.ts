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
      .order('selected_at', { ascending: false });
      
    if (planError) {
      console.error('Error fetching plan details:', planError);
      return false;
    }
    
    // Premium plan check - look for plans with names 'Premium', 'Pro', or 'Elite' exactly
    // and ensure they're marked as paid
    const hasPremium = planData && 
                      planData.length > 0 && 
                      (planData[0].plan_name === 'Premium' || 
                       planData[0].plan_name === 'Pro' || 
                       planData[0].plan_name === 'Elite') &&
                      planData[0].is_paid === true;
    
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

    // If this is a premium subscription (not a specific strategy)
    if (!specificStrategyId && premiumStatus) {
      console.log(`Granting premium access to all strategies for user ${userId}`);
      
      // Fetch all premium strategies from predefined_strategies
      const { data: premiumStrategies, error: fetchError } = await supabase
        .from('predefined_strategies')
        .select('id, name, description')
        .eq('package', 'premium');
      
      if (fetchError) {
        console.error('Error fetching premium strategies:', fetchError);
        return false;
      }
      
      // For all premium strategies, make sure they are marked as paid for this user
      if (premiumStrategies && premiumStrategies.length > 0) {
        console.log(`Found ${premiumStrategies.length} premium strategies to unlock`);
        
        // Process each premium strategy - force them to have paid status in strategy_selections
        for (const strategy of premiumStrategies) {
          console.log(`Setting paid access for strategy: ${strategy.id} - ${strategy.name}`);
          
          // Check if record exists
          const { data: existing, error: checkError } = await supabase
            .from('strategy_selections')
            .select('*')
            .eq('user_id', userId)
            .eq('strategy_id', strategy.id);
            
          if (checkError) {
            console.error(`Error checking existing selection for strategy ${strategy.id}:`, checkError);
            continue; // Skip to next strategy
          }
          
          if (existing && existing.length > 0) {
            // Update existing record
            const { error: updateError } = await supabase
              .from('strategy_selections')
              .update({
                paid_status: 'paid',
                strategy_name: strategy.name,
                strategy_description: strategy.description || ""
              })
              .eq('user_id', userId)
              .eq('strategy_id', strategy.id);
              
            if (updateError) {
              console.error(`Error updating strategy ${strategy.id}:`, updateError);
            }
          } else {
            // Insert new record
            const { error: insertError } = await supabase
              .from('strategy_selections')
              .insert({
                user_id: userId,
                strategy_id: strategy.id,
                strategy_name: strategy.name,
                strategy_description: strategy.description || "",
                paid_status: 'paid',
                trade_type: 'paper trade',
                quantity: 0,
                selected_broker: ''
              });
              
            if (insertError) {
              console.error(`Error inserting strategy ${strategy.id}:`, insertError);
            }
          }
        }
      }
      
      return true;
    }
    
    // If we're dealing with a specific strategy unlock
    else if (specificStrategyId) {
      console.log(`Setting access for specific strategy ${specificStrategyId}`);
      
      // Find the strategy to get its details
      const { data: strategyData, error: strategyError } = await supabase
        .from('predefined_strategies')
        .select('name, description')
        .eq('id', specificStrategyId)
        .single();
        
      if (strategyError) {
        console.error(`Error fetching strategy ${specificStrategyId}:`, strategyError);
        return false;
      }
      
      // Set the strategy as paid in strategy_selections
      const { error: updateError } = await supabase
        .from('strategy_selections')
        .upsert({
          user_id: userId,
          strategy_id: specificStrategyId,
          strategy_name: strategyData.name,
          strategy_description: strategyData.description || "",
          paid_status: 'paid',
          trade_type: 'paper trade',
          quantity: 0,
          selected_broker: ''
        }, {
          onConflict: 'user_id,strategy_id'
        });
        
      if (updateError) {
        console.error(`Error updating strategy ${specificStrategyId}:`, updateError);
        return false;
      }
      
      return true;
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
      console.log(`User ${userId} has premium access to all strategies including ${strategyId}`);
      return true;
    }
    
    // If no premium access, check if this specific strategy has been paid for
    const { data: strategySelection, error: selectionError } = await supabase
      .from('strategy_selections')
      .select('*')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('paid_status', 'paid');
      
    if (selectionError) {
      console.error('Error checking specific strategy access:', selectionError);
      return false;
    }
    
    const hasSpecificAccess = strategySelection && strategySelection.length > 0;
    console.log(`User ${userId} specific access to strategy ${strategyId}: ${hasSpecificAccess}`);
    
    return hasSpecificAccess;
  } catch (error) {
    console.error('Error checking strategy access:', error);
    return false;
  }
};
