
import { supabase } from './client';

export type PlanDetails = {
  id: string;
  user_id: string;
  plan_name: string;
  order_id?: string;
  payment_id?: string;
  is_paid?: boolean;
  selected_at: string;
}

export const syncPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) return false;

    const { data: planData, error: planError } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .order('selected_at', { ascending: false })
      .limit(1);
    
    if (planError) {
      console.error("Error fetching plan details:", planError);
      return false;
    }

    if (planData && planData.length > 0) {
      const currentPlan = planData[0];
      
      // Grant access to premium strategies
      const { error: strategyError } = await supabase
        .from('strategy_access')
        .upsert({
          user_id: userId,
          has_premium_access: currentPlan.is_paid || 
            currentPlan.plan_name === 'Pro' || 
            currentPlan.plan_name === 'Elite',
          updated_at: new Date().toISOString()
        });

      if (strategyError) {
        console.error("Error syncing premium access:", strategyError);
        return false;
      }
      
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error in syncPremiumAccess:", error);
    return false;
  }
};
