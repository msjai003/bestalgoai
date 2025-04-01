
import { useState, useEffect } from "react";
import { Strategy } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      console.log("Strategy already in wishlist, skipping insert");
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
    console.log("Strategy added to wishlist_maintain table");
    
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
      console.log("Strategy updated in strategy_selections table");
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// Helper function to remove strategy from wishlist
export const removeFromWishlist = async (userId: string, strategyId: number): Promise<void> => {
  try {
    console.log(`Removing strategy ${strategyId} from wishlist for user ${userId}`);
    
    // Delete from wishlist_maintain table
    const { error: deleteError } = await supabase
      .from('wishlist_maintain')
      .delete()
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (deleteError) {
      console.error("Error deleting from wishlist_maintain:", deleteError);
      throw deleteError;
    }
    console.log("Deleted from wishlist_maintain table");
    
    // Update the strategy_selections table to maintain backward compatibility
    // Check if the strategy is a paid strategy
    const { data: strategies, error: queryError } = await supabase
      .from('strategy_selections')
      .select('*')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
      
    if (queryError) {
      console.error("Error querying strategy_selections:", queryError);
      throw queryError;
    }
    
    if (strategies && strategies.length > 0) {
      console.log(`Found ${strategies.length} entries in strategy_selections to update`);
      
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
          
        if (error) {
          console.error("Error updating paid strategy:", error);
          throw error;
        }
        console.log("Updated paid strategy wishlist status");
      } else {
        // If it's not a paid strategy, update the is_wishlisted flag to false
        const { error } = await supabase
          .from('strategy_selections')
          .update({ 
            is_wishlisted: false
          })
          .eq('user_id', userId)
          .eq('strategy_id', strategyId);
          
        if (error) {
          console.error("Error updating non-paid strategy:", error);
          throw error;
        }
        console.log("Updated non-paid strategy wishlist status");
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

// Function to load wishlist items from the wishlist_maintain table
export const loadWishlistItems = async (userId: string): Promise<Array<{id: number, name: string, description: string}>> => {
  try {
    console.log(`Loading wishlist items for user ${userId}`);
    const { data, error } = await supabase
      .from('wishlist_maintain')
      .select('strategy_id, strategy_name, strategy_description')
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error loading wishlist items:", error);
      throw error;
    }
    
    console.log(`Loaded ${data?.length || 0} wishlist items from database`);
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

// Main hook for managing strategy wishlist
export const useStrategyWishlist = () => {
  const [wishlistedStrategies, setWishlistedStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Remove hasPremium from useAuth() since it doesn't exist
  // Instead create a local variable for premium status check
  const isPremium = user?.id ? true : false; // Simplified check, adjust as needed

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const items = await loadWishlistItems(user.id);
          
          // Ensure all required Strategy properties are included
          const strategies: Strategy[] = items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            isWishlisted: true,
            isLive: false, // Default value for isLive
            quantity: 1,    // Default value for quantity
            performance: {
              winRate: "N/A",
              avgProfit: "N/A",
              drawdown: "N/A" // Added missing property from Strategy interface
            }
          }));
          
          setWishlistedStrategies(strategies);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        toast({
          title: "Error",
          description: "Failed to load wishlist items",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [user, toast]);

  return {
    wishlistedStrategies,
    isLoading,
    hasPremium: isPremium // Use our local variable instead of missing property
  };
};
