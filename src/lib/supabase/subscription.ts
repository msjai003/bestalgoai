
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
 * Sync premium access across all strategies for a user with premium plan
 * @param userId The user ID to sync premium access for
 * @returns boolean indicating if sync was successful
 */
export const syncPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Syncing premium access for user ${userId}`);
    
    // Get all premium strategies from predefined_strategies table
    const { data: premiumStrategies, error: fetchError } = await supabase
      .from('predefined_strategies')
      .select('id, name, description')
      .eq('package', 'premium');
      
    if (fetchError) {
      console.error('Error fetching premium strategies:', fetchError);
      return false;
    }
    
    if (!premiumStrategies || premiumStrategies.length === 0) {
      console.log('No premium strategies found to sync');
      return true; // Nothing to sync, but not an error
    }
    
    console.log(`Found ${premiumStrategies.length} premium strategies to sync`);
    
    // For each premium strategy, ensure the user has access
    for (const strategy of premiumStrategies) {
      // Check if strategy selection already exists
      const { data: existingStrategy, error: queryError } = await supabase
        .from('strategy_selections')
        .select('*')
        .eq('user_id', userId)
        .eq('strategy_id', strategy.id)
        .maybeSingle();
        
      if (queryError) {
        console.error(`Error checking existing strategy selection for strategy ${strategy.id}:`, queryError);
        continue; // Skip to next strategy if there was an error
      }
      
      if (existingStrategy) {
        // Update existing entry to mark as paid
        const { error: updateError } = await supabase
          .from('strategy_selections')
          .update({ 
            paid_status: 'paid',
            strategy_name: strategy.name,
            strategy_description: strategy.description
          })
          .eq('id', existingStrategy.id);
          
        if (updateError) {
          console.error(`Error updating strategy selection for strategy ${strategy.id}:`, updateError);
        }
      } else {
        // Create new entry with paid status
        const { error: insertError } = await supabase
          .from('strategy_selections')
          .insert({
            user_id: userId,
            strategy_id: strategy.id,
            strategy_name: strategy.name,
            strategy_description: strategy.description,
            paid_status: 'paid',
            trade_type: 'paper trade',
            quantity: 0
          });
          
        if (insertError) {
          console.error(`Error inserting strategy selection for strategy ${strategy.id}:`, insertError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception during premium access sync:', error);
    return false;
  }
};

/**
 * Add or update strategy in user's wishlist
 * @param userId User ID
 * @param strategyId Strategy ID
 * @param strategyName Strategy name
 * @param strategyDescription Strategy description
 * @param isWishlisted Whether to add or remove from wishlist
 */
export const syncWishlistMaintain = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  isWishlisted: boolean
): Promise<void> => {
  try {
    console.log(`${isWishlisted ? 'Adding' : 'Removing'} strategy ${strategyId} ${isWishlisted ? 'to' : 'from'} wishlist for user ${userId}`);
    
    if (isWishlisted) {
      // Check if the strategy already exists in the wishlist
      const { data: existing, error: queryError } = await supabase
        .from('wishlist_maintain')
        .select('*')
        .eq('user_id', userId)
        .eq('strategy_id', strategyId)
        .maybeSingle();
        
      if (queryError) {
        console.error('Error querying wishlist:', queryError);
        throw queryError;
      }
      
      if (existing) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('wishlist_maintain')
          .update({
            strategy_name: strategyName,
            strategy_description: strategyDescription,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
          
        if (updateError) {
          console.error('Error updating wishlist:', updateError);
          throw updateError;
        }
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('wishlist_maintain')
          .insert({
            user_id: userId,
            strategy_id: strategyId,
            strategy_name: strategyName,
            strategy_description: strategyDescription
          });
          
        if (insertError) {
          console.error('Error inserting into wishlist:', insertError);
          throw insertError;
        }
      }
    } else {
      // Remove from wishlist_maintain table
      const { error: deleteError } = await supabase
        .from('wishlist_maintain')
        .delete()
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);
        
      if (deleteError) {
        console.error('Error deleting from wishlist:', deleteError);
        throw deleteError;
      }
    }
    
    console.log(`Successfully ${isWishlisted ? 'added to' : 'removed from'} wishlist`);
  } catch (error) {
    console.error(`Error in syncWishlistMaintain:`, error);
    throw error;
  }
};
