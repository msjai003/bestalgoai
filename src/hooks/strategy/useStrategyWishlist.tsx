import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { syncWishlistMaintain } from "@/lib/supabase/subscription";

/**
 * Remove a strategy from the user's wishlist
 * @param userId The user's ID
 * @param strategyId The strategy ID to remove from the wishlist
 */
export const removeFromWishlist = async (userId: string, strategyId: number) => {
  try {
    console.log(`Removing strategy ${strategyId} from wishlist for user ${userId}`);

    // Delete from strategy_selections table
    const { error: deleteError } = await supabase
      .from('strategy_selections')
      .delete()
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);

    if (deleteError) {
      console.error('Error deleting wishlist status:', deleteError);
      throw deleteError;
    }

    // Also sync with the wishlist_maintain table
    await syncWishlistMaintain(userId, strategyId, "", "", false);

    console.log(`Successfully removed strategy ${strategyId} from wishlist`);
  } catch (error) {
    console.error('Exception removing from wishlist:', error);
    toast.error('Failed to remove strategy from wishlist');
    throw error;
  }
};

/**
 * Add a strategy to the user's wishlist
 * @param userId The user's ID
 * @param strategyId The strategy ID to add to the wishlist
 * @param strategyName The name of the strategy
 * @param strategyDescription The description of the strategy
 */
export const addToWishlist = async (
  userId: string, 
  strategyId: number,
  strategyName: string,
  strategyDescription: string
) => {
  try {
    console.log(`Adding strategy ${strategyId} to wishlist for user ${userId}`);
    
    // Insert into strategy_selections table if not exists or update is_wishlisted flag
    const { data: existingData, error: selectError } = await supabase
      .from('strategy_selections')
      .select('id')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();
    
    if (selectError) {
      console.error('Error checking if strategy exists in selections:', selectError);
      throw selectError;
    }
    
    let upsertError;
    if (existingData) {
      // Update existing entry
      const { error } = await supabase
        .from('strategy_selections')
        .update({ is_wishlisted: true })
        .eq('id', existingData.id);
      upsertError = error;
    } else {
      // Insert new entry
      const { error } = await supabase
        .from('strategy_selections')
        .insert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          is_wishlisted: true
        });
      upsertError = error;
    }
    
    if (upsertError) {
      console.error('Error updating wishlist status:', upsertError);
      throw upsertError;
    }
    
    // Also sync with the wishlist_maintain table
    await syncWishlistMaintain(userId, strategyId, strategyName, strategyDescription, true);
    
    console.log(`Successfully added strategy ${strategyId} to wishlist`);
  } catch (error) {
    console.error('Exception adding to wishlist:', error);
    toast.error('Failed to add strategy to wishlist');
    throw error;
  }
};
