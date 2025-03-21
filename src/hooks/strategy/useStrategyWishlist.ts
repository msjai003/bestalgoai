
import { supabase } from "@/integrations/supabase/client";
import { Strategy } from "./types";

// Helper function to add strategy to wishlist using the new wishlist_maintain table
export const addToWishlist = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string
): Promise<void> => {
  try {
    // Check if the strategy already exists in the wishlist_maintain table
    const { data: existingWishlist, error: queryError } = await supabase
      .from('wishlist_maintain')
      .select('*')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
      
    if (queryError) throw queryError;
    
    if (existingWishlist) {
      // Entry already exists, no need to insert
      return;
    }
    
    // Insert into the new wishlist_maintain table
    const { error } = await supabase
      .from('wishlist_maintain')
      .insert({
        user_id: userId,
        strategy_id: strategyId,
        strategy_name: strategyName,
        strategy_description: strategyDescription
      });
      
    if (error) throw error;
    
    // Also update the strategy_selections table to maintain backward compatibility
    // First check if the strategy exists in strategy_selections
    const { data: existingStrategies, error: selectionQueryError } = await supabase
      .from('strategy_selections')
      .select('*')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (selectionQueryError) throw selectionQueryError;
    
    if (existingStrategies && existingStrategies.length > 0) {
      // Update existing record to preserve paid status
      const { error: updateError } = await supabase
        .from('strategy_selections')
        .update({ 
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          is_wishlisted: true // Explicitly mark as wishlisted
        })
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);
        
      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// Helper function to remove strategy from wishlist
export const removeFromWishlist = async (userId: string, strategyId: number): Promise<void> => {
  try {
    // Delete from wishlist_maintain table
    const { error: deleteError } = await supabase
      .from('wishlist_maintain')
      .delete()
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (deleteError) throw deleteError;
    
    // Update the strategy_selections table to maintain backward compatibility
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
          .update({ 
            is_wishlisted: false // Set wishlist status to false but keep the record
          })
          .eq('id', paidStrategy.id);
          
        if (error) throw error;
      } else {
        // If it's not a paid strategy, update the is_wishlisted flag to false
        const { error } = await supabase
          .from('strategy_selections')
          .update({ 
            is_wishlisted: false
          })
          .eq('user_id', userId)
          .eq('strategy_id', strategyId);
          
        if (error) throw error;
      }
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
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

// New function to load wishlist items from the wishlist_maintain table
export const loadWishlistItems = async (userId: string): Promise<Array<{id: number, name: string, description: string}>> => {
  try {
    const { data, error } = await supabase
      .from('wishlist_maintain')
      .select('strategy_id, strategy_name, strategy_description')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.strategy_id,
      name: item.strategy_name,
      description: item.strategy_description || ""
    }));
  } catch (error) {
    console.error("Error loading wishlist items:", error);
    return [];
  }
};
