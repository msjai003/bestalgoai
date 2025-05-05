
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

// Add the missing function that useStrategy.tsx is trying to import
export const checkUserPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) return false;

    const { data: planData, error: planError } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .order('selected_at', { ascending: false })
      .limit(1);
    
    if (planError) {
      console.error("Error checking premium status:", planError);
      return false;
    }

    return !!(planData && planData.length > 0 && 
      (planData[0].is_paid || 
       planData[0].plan_name === 'Pro' || 
       planData[0].plan_name === 'Elite'));
  } catch (error) {
    console.error("Error in checkUserPremiumStatus:", error);
    return false;
  }
};

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
      
      // Fix the upsert issue - using insert with onConflict instead
      const { error: strategyError } = await supabase
        .from('strategy_access')
        .insert({
          user_id: userId,
          has_premium_access: currentPlan.is_paid || 
            currentPlan.plan_name === 'Pro' || 
            currentPlan.plan_name === 'Elite',
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id',  // This replaces the upsert functionality
          ignoreDuplicates: false
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
