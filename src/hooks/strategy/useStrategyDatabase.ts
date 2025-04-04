
import { supabase } from "@/integrations/supabase/client";
import { Strategy } from "./types";
import { loadWishlistItems } from "./useStrategyWishlist";

/**
 * Loads strategies from database and localStorage
 */
export const loadUserStrategies = async (userId: string | undefined): Promise<Strategy[]> => {
  // First try to get from localStorage for immediate display
  const storedStrategies = localStorage.getItem('wishlistedStrategies');
  let strategies: Strategy[] = [];
  
  if (storedStrategies) {
    try {
      strategies = JSON.parse(storedStrategies);
    } catch (error) {
      console.error("Error parsing wishlisted strategies:", error);
    }
  }
  
  // If user is logged in, fetch strategies from database
  if (userId) {
    try {
      // Fetch strategy selections
      const { data: selections, error: selectionsError } = await supabase
        .from('strategy_selections')
        .select('*')
        .eq('user_id', userId);
        
      if (selectionsError) throw selectionsError;
      
      // Fetch wishlisted items from the new wishlist_maintain table
      const wishlistItems = await loadWishlistItems(userId);
      
      // Create a map of strategy IDs to wishlist status
      const wishlistMap = new Map<number, boolean>();
      wishlistItems.forEach(item => {
        wishlistMap.set(item.id, true);
      });
      
      if (selections && selections.length > 0) {
        // Map database strategies - create a unique instance for each row
        // This allows multiple entries for the same strategy with different brokers
        const dbStrategies = selections.map(item => ({
          // Create a unique ID by combining strategy_id, broker name and username
          id: item.strategy_id,
          uniqueId: `${item.strategy_id}-${item.selected_broker}-${item.broker_username}`,
          rowId: item.id, // Store the actual database row ID
          name: item.strategy_name,
          description: item.strategy_description || "",
          // Use both wishlist tables for status - either is in the dedicated wishlist or has is_wishlisted=true
          isWishlisted: wishlistMap.has(item.strategy_id) || !!item.is_wishlisted,
          // Only set isLive to true if trade_type is explicitly "live trade"
          isLive: item.trade_type === "live trade",
          quantity: item.quantity || 0,
          selectedBroker: item.selected_broker || "",
          brokerUsername: item.broker_username || "",
          tradeType: item.trade_type || "paper trade",
          isPaid: item.paid_status === 'paid',
          performance: {
            winRate: "N/A",
            avgProfit: "N/A",
            drawdown: "N/A"
          }
        }));
        
        strategies = dbStrategies;
        
        // Add any wishlist items that aren't in strategy_selections
        for (const item of wishlistItems) {
          if (!strategies.some(s => s.id === item.id)) {
            strategies.push({
              id: item.id,
              uniqueId: `wishlist-${item.id}`,
              name: item.name,
              description: item.description || "",
              isWishlisted: true,
              isLive: false,
              quantity: 0,
              selectedBroker: "",
              brokerUsername: "",
              tradeType: "paper trade",
              performance: {
                winRate: "N/A",
                avgProfit: "N/A",
                drawdown: "N/A"
              }
            });
          }
        }
        
        localStorage.setItem('wishlistedStrategies', JSON.stringify(
          // Only store wishlisted strategies in localStorage
          strategies.filter(s => s.isWishlisted)
        ));
      } else if (wishlistItems.length > 0) {
        // If there are no selections but there are wishlist items
        strategies = wishlistItems.map(item => ({
          id: item.id,
          uniqueId: `wishlist-${item.id}`,
          name: item.name,
          description: item.description || "",
          isWishlisted: true,
          isLive: false,
          quantity: 0,
          selectedBroker: "",
          brokerUsername: "",
          tradeType: "paper trade",
          performance: {
            winRate: "N/A",
            avgProfit: "N/A",
            drawdown: "N/A"
          }
        }));
        
        localStorage.setItem('wishlistedStrategies', JSON.stringify(strategies));
      }
    } catch (error) {
      console.error("Error fetching strategies from database:", error);
    }
  }
  
  return strategies;
};

/**
 * Updates a strategy's live trading configuration in the database
 */
export const updateStrategyLiveConfig = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerName: string | null,
  brokerUsername: string | null = null,
  tradeType: string = "paper trade"
): Promise<void> => {
  console.log("Updating strategy config:", {
    userId,
    strategyId,
    quantity,
    brokerName,
    brokerUsername,
    tradeType
  });
  
  // Always create a new entry - don't update existing ones
  const { error } = await supabase
    .from('strategy_selections')
    .insert({
      user_id: userId,
      strategy_id: strategyId,
      strategy_name: strategyName,
      strategy_description: strategyDescription,
      quantity: quantity || 0,
      selected_broker: brokerName,
      broker_username: brokerUsername,
      trade_type: tradeType,
      is_wishlisted: false // Explicitly set to not wishlisted for new configurations
    });
  
  if (error) {
    console.error("Error updating strategy config:", error);
    throw error;
  }
};

/**
 * Fetches broker details by ID
 */
export const fetchBrokerById = async (brokerId: string): Promise<{ broker_name: string } | null> => {
  console.log("Fetching broker details for ID:", brokerId);
  
  const { data, error } = await supabase
    .from('broker_credentials')
    .select('broker_name')
    .eq('id', brokerId)
    .single();
    
  if (error) {
    console.error("Error fetching broker details:", error);
    throw error;
  }
  
  console.log("Fetched broker details:", data);
  return data;
};

/**
 * Fetches all available brokers for a user
 */
export const fetchUserBrokers = async (userId: string): Promise<Array<{id: string, broker_name: string}>> => {
  console.log("Fetching connected brokers for user:", userId);
  
  const { data, error } = await supabase
    .from('broker_credentials')
    .select('id, broker_name')
    .eq('user_id', userId)
    .eq('status', 'connected');
    
  if (error) {
    console.error("Error fetching user brokers:", error);
    throw error;
  }
  
  console.log("Fetched connected brokers:", data);
  return data || [];
};
