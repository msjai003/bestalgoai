
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
    .filter('user_id', 'eq', userId)
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
