
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

// Export the syncPremiumAccess function to fix the import error
export const syncPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    // Check if user has a valid premium subscription
    const { data: planDetails, error } = await supabase
      .from('plan_details')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', true)
      .maybeSingle();

    if (error) {
      console.error("Error checking premium status for sync:", error);
      return false;
    }

    if (!planDetails) {
      console.log("No premium subscription found for user during sync");
      return false;
    }

    // Grant access to premium strategies by inserting records into strategy_access table
    // This assumes a strategy_access table exists to track which users have access to which premium strategies
    const { error: accessError } = await supabase
      .from('strategy_access')
      .upsert([
        { user_id: userId, access_level: 'premium', granted_at: new Date().toISOString() }
      ], { 
        onConflict: 'user_id',
        ignoreDuplicates: false
      });

    if (accessError) {
      console.error("Error syncing premium access:", accessError);
      return false;
    }

    console.log("Premium access synced successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in syncPremiumAccess:", error);
    return false;
  }
};

// Function to sync wishlist with wishlist_maintain table
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
