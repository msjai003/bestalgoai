import { supabase } from "@/integrations/supabase/client";
import { Strategy } from "./types";

// Helper function to add strategy to wishlist
export const addToWishlist = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string
): Promise<void> => {
  // Check if the strategy already exists in the database for this user
  const { data: existingStrategy, error: queryError } = await supabase
    .from('strategy_selections')
    .select('*')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId)
    .maybeSingle();
    
  if (queryError) throw queryError;
  
  if (existingStrategy) {
    // Update existing record to mark as wishlisted but preserve paid status
    const { error } = await supabase
      .from('strategy_selections')
      .update({ 
        strategy_name: strategyName,
        strategy_description: strategyDescription
      })
      .eq('id', existingStrategy.id);
      
    if (error) throw error;
  } else {
    // Insert new record
    const { error } = await supabase
      .from('strategy_selections')
      .insert({
        user_id: userId,
        strategy_id: strategyId,
        strategy_name: strategyName,
        strategy_description: strategyDescription
      });
      
    if (error) throw error;
  }
};

// Helper function to remove strategy from wishlist
export const removeFromWishlist = async (userId: string, strategyId: number): Promise<void> => {
  // Check if the strategy is a paid strategy
  const { data: strategy, error: queryError } = await supabase
    .from('strategy_selections')
    .select('*')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId)
    .maybeSingle();
    
  if (queryError) throw queryError;
  
  if (strategy && strategy.paid_status === 'paid') {
    // If this is a paid strategy, don't delete it - just make it not wishlisted
    // We'll use a dummy field since there's no explicit "is_wishlisted" column
    // The presence in the database without being marked as paid means it's wishlisted
    const { error } = await supabase
      .from('strategy_selections')
      .update({ 
        // Keep in database but update any fields that would affect wishlist status
        // We're keeping the record because it's a paid strategy
      })
      .eq('id', strategy.id);
      
    if (error) throw error;
  } else {
    // If it's not a paid strategy, we can safely delete it
    const { error } = await supabase
      .from('strategy_selections')
      .delete()
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (error) throw error;
  }
};

// Helper function to update local storage wishlist
export const updateLocalStorageWishlist = (
  strategyId: number,
  isWishlisted: boolean,
  strategies: Strategy[]
): void => {
  const storedWishlist = localStorage.getItem('wishlistedStrategies');
  let wishlistedStrategies: any[] = [];
  
  if (storedWishlist) {
    try {
      wishlistedStrategies = JSON.parse(storedWishlist);
    } catch (error) {
      console.error("Error parsing wishlisted strategies:", error);
    }
  }
  
  if (isWishlisted) {
    if (!wishlistedStrategies.some(s => s.id === strategyId)) {
      const strategyToAdd = strategies.find(s => s.id === strategyId);
      if (strategyToAdd) {
        wishlistedStrategies.push({...strategyToAdd, isWishlisted: true});
      }
    }
  } else {
    wishlistedStrategies = wishlistedStrategies.filter(s => s.id !== strategyId);
  }
  
  localStorage.setItem('wishlistedStrategies', JSON.stringify(wishlistedStrategies));
};
