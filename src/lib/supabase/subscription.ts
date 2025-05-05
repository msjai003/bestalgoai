
// This file contains utilities for managing subscription-related functionality

import { supabase } from './client';

/**
 * Retrieves subscription details for a specific user
 * @param userId The user ID to get subscription details for
 * @returns Promise with subscription details or error
 */
export async function getUserSubscription(userId: string) {
  if (!userId) {
    return { data: null, error: new Error('User ID is required') };
  }

  const { data, error } = await supabase
    .from('plan_details')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return { data, error };
}

/**
 * Retrieves all available pricing plans
 * @returns Promise with pricing plans data or error
 */
export async function getPricingPlans() {
  const { data, error } = await supabase
    .from('price_admin')
    .select('*')
    .order('sort_order', { ascending: true });

  return { data, error };
}

/**
 * Checks if a user has premium status based on their subscription
 * @param userId The user ID to check premium status for
 * @returns Promise resolving to true if user has premium, false otherwise
 */
export async function checkUserPremiumStatus(userId: string) {
  if (!userId) {
    return false;
  }
  
  const { data, error } = await supabase
    .from('plan_details')
    .select('*')
    .eq('user_id', userId)
    .order('selected_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error checking premium status:', error);
    return false;
  }
  
  return data.plan_name === 'Pro' || data.plan_name === 'Elite' || data.is_paid === true;
}

/**
 * Synchronizes premium access for user to unlock strategies
 * @param userId The user ID to sync premium access for
 * @returns Promise resolving to true if sync was successful, false otherwise
 */
export async function syncPremiumAccess(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      console.error('Cannot sync premium access: No user ID provided');
      return false;
    }
    
    // Get the user's current subscription details
    const { data: planDetails, error: planError } = await getUserSubscription(userId);
    
    if (planError || !planDetails) {
      console.error('Error fetching plan details during sync:', planError);
      return false;
    }
    
    // If user has a paid plan, update their strategy access
    if (planDetails.is_paid === true || 
        planDetails.plan_name === 'Pro' || 
        planDetails.plan_name === 'Elite') {
      
      // The list of premium strategy IDs (you can expand this list as needed)
      const premiumStrategyIds = [1, 2, 3];
      
      // For each premium strategy, ensure the user has access
      for (const strategyId of premiumStrategyIds) {
        // Apply force_strategy_paid_status RPC function if available, or use direct database update
        try {
          // Get the strategy name and description for inclusion in record
          const { data: strategyData } = await supabase
            .from('predefined_strategies')
            .select('name, description')
            .eq('id', strategyId)
            .maybeSingle();
          
          const strategyName = strategyData?.name || `Strategy ${strategyId}`;
          const strategyDescription = strategyData?.description || 'Premium strategy';
          
          // Call the RPC function or fallback to direct insert/update
          const { error: rpcError } = await supabase.rpc(
            'force_strategy_paid_status',
            {
              p_user_id: userId,
              p_strategy_id: strategyId,
              p_strategy_name: strategyName,
              p_strategy_description: strategyDescription
            }
          );
          
          if (rpcError) {
            console.error('Error syncing premium strategy access via RPC:', rpcError);
          }
        } catch (e) {
          console.error('Error processing strategy sync:', e);
        }
      }
      
      console.log('Premium access successfully synced for user:', userId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error during premium access sync:', error);
    return false;
  }
}
