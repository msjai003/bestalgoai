
// This file contains utilities for managing subscription-related functionality

import { supabase } from './client';

/**
 * Retrieves subscription details for a specific user
 * @param userId The user ID to get subscription details for
 * @returns Promise with subscription data or error
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
 * Checks if a user has premium status
 * @param userId The user ID to check premium status for
 * @returns Promise<boolean> indicating if the user has premium access
 */
export async function checkUserPremiumStatus(userId: string): Promise<boolean> {
  if (!userId) {
    return false;
  }

  try {
    // Get the most recent plan for the user
    const { data, error } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .order('selected_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error checking premium status:', error);
      return false;
    }

    // Check if we have data and if the first item indicates premium status
    return data && data.length > 0 && 
      (data[0].plan_name === 'Pro' || data[0].plan_name === 'Elite' || data[0].is_paid === true);
  } catch (error) {
    console.error('Exception checking premium status:', error);
    return false;
  }
}

/**
 * Syncs premium access for a user to unlock premium features
 * @param userId The user ID to sync premium access for
 * @returns Promise<boolean> indicating if the sync was successful
 */
export async function syncPremiumAccess(userId: string): Promise<boolean> {
  if (!userId) {
    return false;
  }

  try {
    // Check if the user has premium status
    const hasPremium = await checkUserPremiumStatus(userId);
    
    if (!hasPremium) {
      return false;
    }
    
    // Here we would typically sync the premium status with other parts of the application
    // For example, unlocking premium strategies
    
    // This is a placeholder for any specific premium sync logic
    // You can implement additional functionality here as needed
    
    // For now, we'll just update any strategies the user has to mark them as paid if they have premium
    const { error } = await supabase.rpc('force_strategy_paid_status', {
      p_user_id: userId,
      p_strategy_id: 1,  // Using a placeholder ID
      p_strategy_name: 'Premium Strategy',
      p_strategy_description: 'Unlocked with premium subscription'
    });
    
    if (error) {
      console.error('Error syncing premium access:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception syncing premium access:', error);
    return false;
  }
}
