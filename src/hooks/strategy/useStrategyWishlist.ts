
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
  const { data: existingStrategies, error: queryError } = await supabase
    .from('strategy_selections')
    .select('*')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId);
    
  if (queryError) throw queryError;
  
  if (existingStrategies && existingStrategies.length > 0) {
    // Update existing record to preserve paid status
    const { error } = await supabase
      .from('strategy_selections')
      .update({ 
        strategy_name: strategyName,
        strategy_description: strategyDescription,
        is_wishlisted: true // Explicitly mark as wishlisted
      })
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (error) throw error;
  } else {
    // Insert new record
    const { error } = await supabase
      .from('strategy_selections')
      .insert({
        user_id: userId,
        strategy_id: strategyId,
        strategy_name: strategyName,
        strategy_description: strategyDescription,
        is_wishlisted: true // Explicitly mark as wishlisted
      });
      
    if (error) throw error;
  }
};

// Helper function to remove strategy from wishlist
export const removeFromWishlist = async (userId: string, strategyId: number): Promise<void> => {
  // Check if the strategy is a paid strategy
  const { data: strategies, error: queryError } = await supabase
    .from('strategy_selections')
    .select('*')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId);
    
  if (queryError) throw queryError;
  
  if (strategies && strategies.length > 0) {
    // Check if any of the strategies are paid
    const paidStrategy = strategies.find(strategy => strategy.paid_status === 'paid');
    
    if (paidStrategy) {
      // If this is a paid strategy, don't delete it - just update the wishlist status
      const { error } = await supabase
        .from('strategy_selections')
        .update({ is_wishlisted: false }) // Set wishlist status to false but keep the record
        .eq('id', paidStrategy.id);
        
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
