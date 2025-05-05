
import { supabase } from './client';

/**
 * Check if a user has an active subscription
 * @param userId The user's ID
 * @returns A boolean indicating if the user has an active subscription
 */
export const checkUserPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', true)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking premium status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkUserPremiumStatus:", error);
    return false;
  }
};

/**
 * Sync premium access for a user by marking their selected strategies as paid
 * @param userId The user's ID
 * @returns A boolean indicating if the sync was successful
 */
export const syncPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) return false;

    // Get predefined strategies to mark as paid
    const { data: predefinedStrategies, error: fetchError } = await supabase
      .from('predefined_strategies')
      .select('id, name, description');
    
    if (fetchError) {
      console.error("Error fetching predefined strategies:", fetchError);
      return false;
    }

    // For each strategy, make sure it's marked as paid for this premium user
    for (const strategy of predefinedStrategies || []) {
      // Use the force_strategy_paid_status RPC function or directly upsert
      const { error } = await supabase.rpc(
        'force_strategy_paid_status', 
        { 
          p_user_id: userId, 
          p_strategy_id: strategy.id,
          p_strategy_name: strategy.name,
          p_strategy_description: strategy.description || ''
        }
      );
      
      if (error) {
        console.error(`Error marking strategy ${strategy.id} as paid:`, error);
      }
    }

    return true;
  } catch (error) {
    console.error("Error in syncPremiumAccess:", error);
    return false;
  }
};
