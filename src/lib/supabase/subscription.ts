import { supabase } from './client';

export const checkUserPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data: planDetails, error } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', true)
      .maybeSingle();

    if (error) {
      console.error("Error checking premium status:", error);
      return false;
    }

    return !!planDetails;
  } catch (error) {
    console.error("Error in checkUserPremiumStatus:", error);
    return false;
  }
};

// New function to sync wishlist with wishlist_maintain table
export const syncWishlistMaintain = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string = "",
  isWishlisted: boolean
): Promise<void> => {
  try {
    if (isWishlisted) {
      // Add to wishlist_maintain table
      const { error: insertError } = await supabase
        .from('wishlist_maintain')
        .upsert({
          user_id: userId,
          strategy_id: strategyId,
          strategy_name: strategyName,
          strategy_description: strategyDescription
        }, { 
          onConflict: 'user_id,strategy_id',
          ignoreDuplicates: false
        });
      
      if (insertError) {
        throw insertError;
      }
      
      console.log(`Strategy ${strategyId} added to wishlist_maintain`);
    } else {
      // Remove from wishlist_maintain table
      const { error: deleteError } = await supabase
        .from('wishlist_maintain')
        .delete()
        .eq('user_id', userId)
        .eq('strategy_id', strategyId);
      
      if (deleteError) {
        throw deleteError;
      }
      
      console.log(`Strategy ${strategyId} removed from wishlist_maintain`);
    }
  } catch (error) {
    console.error("Error syncing wishlist_maintain:", error);
    throw error;
  }
};
