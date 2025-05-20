
import { useState, useEffect } from "react";
import { Strategy } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Helper function to add strategy to wishlist using the wishlist_maintain table
export const addToWishlist = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string
): Promise<void> => {
  try {
    console.log(`Adding strategy ${strategyId} to wishlist for user ${userId}`);
    
    // Insert into wishlist_maintain table
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
    } else {
      // Insert a new record in strategy_selections if it doesn't exist
      const { error: insertError } = await supabase
        .from('strategy_selections')
        .insert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          is_wishlisted: true, // Explicitly mark as wishlisted
          trade_type: 'paper trade',
          quantity: 0,
          selected_broker: ''
        });
      
      if (insertError) throw insertError;
      console.log("Strategy inserted into strategy_selections table");
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
    
    // Remove from wishlist_maintain table
    const { error: deleteError } = await supabase
      .from('wishlist_maintain')
      .delete()
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);
    
    if (deleteError) throw deleteError;
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
      
      // Set is_wishlisted flag to false for all related strategies
      const { error } = await supabase
        .from('strategy_selections')
        .update({ 
          is_wishlisted: false
        })
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);
          
      if (error) {
        console.error("Error updating strategy wishlist status:", error);
        throw error;
      }
      console.log("Updated strategy wishlist status in strategy_selections");
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

// Function to load wishlist items from the wishlist_maintain table
export const loadWishlistItems = async (userId: string): Promise<Array<{id: number, name: string, description: string}>> => {
  try {
    console.log(`Loading wishlist items from wishlist_maintain table for user ${userId}`);
    const { data, error } = await supabase
      .from('wishlist_maintain')
      .select('strategy_id, strategy_name, strategy_description')
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error loading wishlist items:", error);
      throw error;
    }
    
    console.log(`Loaded ${data?.length || 0} wishlist items from wishlist_maintain table`);
    console.log("Wishlist data:", data);
    
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
  
  // Create a local variable for premium status check
  const hasPremium = user?.id ? true : false; // Simplified check, adjust as needed

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Load wishlist items from the wishlist_maintain table
          const items = await loadWishlistItems(user.id);
          console.log("Wishlist items loaded:", items);
          
          if (items.length === 0) {
            console.log("No wishlist items found for user", user.id);
            setWishlistedStrategies([]);
            setIsLoading(false);
            return;
          }
          
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
              drawdown: "N/A"
            }
          }));
          
          console.log("Converted wishlist items to strategies:", strategies);
          setWishlistedStrategies(strategies);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        toast({
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
    hasPremium // Use our local variable
  };
};
