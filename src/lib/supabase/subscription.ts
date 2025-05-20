
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
 * Sync premium access for a user by updating strategies in the strategy_selections table
 * @param userId The user's ID to sync premium access for
 * @returns boolean indicating if sync was successful
 */
export const syncPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    console.log('Syncing premium access for user:', userId);
    
    // First check if the user has premium access
    const hasPremium = await checkUserPremiumStatus(userId);
    
    if (!hasPremium) {
      console.log('User does not have premium access, no sync needed');
      return false;
    }
    
    // Get all premium strategies that need to be updated
    const { data: premiumStrategies, error: strategyError } = await supabase
      .from('predefined_strategies')
      .select('id, name, description, package')
      .eq('package', 'premium');
      
    if (strategyError) {
      console.error('Error fetching premium strategies:', strategyError);
      return false;
    }
    
    if (!premiumStrategies || premiumStrategies.length === 0) {
      console.log('No premium strategies found to sync');
      return true; // No work to do, but not an error
    }
    
    console.log(`Found ${premiumStrategies.length} premium strategies to sync`);
    
    // For each premium strategy, use RPC call to force paid status
    for (const strategy of premiumStrategies) {
      const { error: rpcError } = await supabase.rpc(
        'force_strategy_paid_status',
        {
          p_user_id: userId,
          p_strategy_id: strategy.id,
          p_strategy_name: strategy.name,
          p_strategy_description: strategy.description
        }
      );
      
      if (rpcError) {
        console.error(`Error updating strategy ${strategy.id}:`, rpcError);
      } else {
        console.log(`Successfully marked strategy ${strategy.id} as paid for user ${userId}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception syncing premium access:', error);
    return false;
  }
};

