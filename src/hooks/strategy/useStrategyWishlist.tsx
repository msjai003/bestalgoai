
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Strategy } from './types';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { syncWishlistMaintain } from "@/lib/supabase/subscription";

/**
 * Hook to fetch and manage wishlisted strategies
 */
export const useStrategyWishlist = () => {
  const [wishlistedStrategies, setWishlistedStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);
  const { user } = useAuth();

  // Fetch wishlisted strategies
  useEffect(() => {
    const fetchWishlistedStrategies = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Check if user has premium subscription
        const { data: planData, error: planError } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_paid', true)
          .order('selected_at', { ascending: false })
          .limit(1);

        // Set premium status
        const userHasPremium = planData && 
                      planData.length > 0 && 
                      (planData[0].plan_name === 'Premium' || 
                       planData[0].plan_name === 'Pro' || 
                       planData[0].plan_name === 'Elite');
        
        setHasPremium(!!userHasPremium);
        
        // Get wishlisted strategies
        const { data: selections, error: selectError } = await supabase
          .from('strategy_selections')
          .select('*, predefined_strategies(*)')
          .eq('user_id', user.id)
          .eq('is_wishlisted', true);

        if (selectError) {
          console.error('Error fetching wishlisted strategies:', selectError);
          toast({
            title: "Error",
            description: "Failed to load wishlist",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (selections && selections.length > 0) {
          // Transform data to match Strategy type
          const strategies: Strategy[] = selections.map(selection => ({
            id: selection.strategy_id,
            name: selection.strategy_name || 'Unknown Strategy',
            description: selection.strategy_description || '',
            performance: selection.predefined_strategies?.performance || {
              winRate: 'N/A',
              avgProfit: 'N/A',
              drawdown: 'N/A'
            },
            isWishlisted: true,
            isLive: selection.trade_type === 'live trade',
            quantity: selection.quantity || 0,
            selectedBroker: selection.selected_broker || '',
            brokerUsername: selection.broker_username || '',
            tradeType: selection.trade_type === 'live trade' ? 'live trade' : 'paper trade',
            isPremium: selection.predefined_strategies?.package === 'premium',
            isPaid: selection.paid_status === 'paid',
            parameters: selection.predefined_strategies?.parameters || []
          }));

          setWishlistedStrategies(strategies);
          console.log("Fetched wishlisted strategies:", strategies);
        } else {
          setWishlistedStrategies([]);
          console.log("No wishlisted strategies found");
        }
      } catch (error) {
        console.error('Exception fetching wishlisted strategies:', error);
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistedStrategies();
  }, [user]);

  return { wishlistedStrategies, isLoading, hasPremium };
};

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
