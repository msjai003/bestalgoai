
import { supabase } from './client';

/**
 * Check if a user has premium access
 * @param userId The user's ID
 * @returns Boolean indicating if the user has premium access
 */
export const checkUserPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    // Correctly chain the query methods
    const { data, error } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', true)
      .order('selected_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking premium status:', error);
    return false;
  }
};

/**
 * Unlock all premium strategies for a user
 * @param userId The user's ID
 * @returns Boolean indicating success or failure
 */
export const unlockPremiumStrategies = async (userId: string): Promise<boolean> => {
  try {
    // First, get all predefined strategies
    const { data: strategies, error: strategiesError } = await supabase
      .from('predefined_strategies')
      .select('id, name, description');
      
    if (strategiesError) {
      throw strategiesError;
    }
    
    if (!strategies || strategies.length === 0) {
      console.log('No strategies found to unlock');
      return false;
    }
    
    console.log(`Unlocking ${strategies.length} strategies for Premium user ${userId}`);
    
    // For each strategy, call the force_strategy_paid_status function
    for (const strategy of strategies) {
      const { error: strategyError } = await supabase.rpc(
        'force_strategy_paid_status',
        {
          p_user_id: userId,
          p_strategy_id: strategy.id,
          p_strategy_name: strategy.name,
          p_strategy_description: strategy.description || 'Premium strategy unlocked with subscription'
        }
      );
      
      if (strategyError) {
        console.error(`Error unlocking strategy ${strategy.id}:`, strategyError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error unlocking premium strategies:', error);
    return false;
  }
};

/**
 * Check and update premium access based on plan_details
 * @param userId The user's ID
 * @returns Boolean indicating if premium was activated
 */
export const syncPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    // Check if user has a paid premium plan
    const hasPremium = await checkUserPremiumStatus(userId);
    
    if (hasPremium) {
      // Unlock all strategies for the premium user
      await unlockPremiumStrategies(userId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error syncing premium access:', error);
    return false;
  }
};
