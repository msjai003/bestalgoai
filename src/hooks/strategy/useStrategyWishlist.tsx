
import { useState, useEffect } from "react";
import { Strategy } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { loadWishlistItems, addToWishlist, removeFromWishlist } from "./useStrategyWishlist.ts";
import { toast } from "@/hooks/use-toast";

export const useStrategyWishlist = () => {
  const [wishlistedStrategies, setWishlistedStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, hasPremium } = useAuth();

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const items = await loadWishlistItems(user.id);
          setWishlistedStrategies(items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            isWishlisted: true,
            performance: {
              winRate: "N/A",
              avgProfit: "N/A"
            }
          })));
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
  }, [user]);

  return {
    wishlistedStrategies,
    isLoading,
    hasPremium
  };
};

// Re-export functions from the original file
export { loadWishlistItems, addToWishlist, removeFromWishlist };
