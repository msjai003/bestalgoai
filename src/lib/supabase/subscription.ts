
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
