
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
