
// This file contains utilities for managing subscription-related functionality

import { supabase } from './client';
import { ExecuteSqlParams } from '@/types/broker';

/**
 * Retrieves subscription details for a specific user
 * @param userId The user ID to get subscription details for
 * @returns Promise with subscription data or error
 */
export async function getUserSubscription(userId: string) {
  if (!userId) {
    return { data: null, error: new Error('User ID is required') };
  }

  const params: ExecuteSqlParams = { 
    query: `SELECT * FROM plan_details WHERE user_id = '${userId}'` 
  };
  const { data, error } = await supabase.rpc('execute_sql', params);

  // Convert the result to match the expected return format
  const subscription = data && Array.isArray(data) && data.length > 0 ? data[0] : null;
  return { data: subscription, error };
}

/**
 * Retrieves all available pricing plans
 * @returns Promise with pricing plans data or error
 */
export async function getPricingPlans() {
  const params: ExecuteSqlParams = { 
    query: `SELECT * FROM price_admin ORDER BY sort_order ASC` 
  };
  const { data, error } = await supabase.rpc('execute_sql', params);

  return { data, error };
}

/**
 * Checks if a user has premium status
 * @param userId The user ID to check premium status for
 * @returns Promise<boolean> indicating if the user has premium access
 */
export async function checkUserPremiumStatus(userId: string): Promise<boolean> {
  // All users now have premium status by default
  return true;
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
    // Force all user strategies to be marked as paid
    const { error } = await supabase.rpc('force_strategy_paid_status', {
      p_user_id: userId,
      p_strategy_id: 1,  // Using a placeholder ID
      p_strategy_name: 'All Strategies',
      p_strategy_description: 'All strategies are now free'
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
