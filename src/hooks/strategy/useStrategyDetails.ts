
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkStrategyAccess } from "@/lib/supabase/subscription";
import { addToWishlist, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";

export const useStrategyDetails = (strategy: any, user: any) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [hasPremium, setHasPremium] = useState(false);
  const [isPaidStrategy, setIsPaidStrategy] = useState(false);
  const [accessCheckComplete, setAccessCheckComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAllAccess = async () => {
      if (!user || !strategy) {
        setIsLoading(false);
        setAccessCheckComplete(true);
        return;
      }
      
      setIsLoading(true);
      setAccessCheckComplete(false);
      
      try {
        // Run all checks in parallel for better performance
        const [wishlistData, premiumData, strategyAccess] = await Promise.all([
          // Check wishlist status
          supabase
            .from('strategy_selections')
            .select('id, paid_status')
            .eq('user_id', user.id)
            .eq('strategy_id', strategy.id),
          
          // Check premium status
          supabase
            .from('plan_details')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_paid', true)
            .order('selected_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          
          // Check specific strategy access
          checkStrategyAccess(user.id, strategy.id)
        ]);
        
        // Process results
        if (!wishlistData.error) {
          setIsWishlisted(wishlistData.data && wishlistData.data.length > 0);
        }
        
        if (!premiumData.error && premiumData.data && 
            (premiumData.data.plan_name === 'Premium' || 
             premiumData.data.plan_name === 'Pro' || 
             premiumData.data.plan_name === 'Elite')) {
          setHasPremium(true);
        }
        
        setIsPaidStrategy(strategyAccess);
        
      } catch (error) {
        console.error('Error checking strategy access:', error);
      } finally {
        setIsLoading(false);
        setAccessCheckComplete(true);
      }
    };
    
    checkAllAccess();
  }, [user, strategy]);

  const handleToggleWishlist = async () => {
    if (!user || !strategy) {
      toast({
        description: "Please log in to add strategies to your wishlist",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!isWishlisted) {
        await addToWishlist(user.id, strategy.id, strategy.name, strategy.description);
        setIsWishlisted(true);
        toast({
          description: "Strategy has been added to your wishlist",
        });
      } else {
        await removeFromWishlist(user.id, strategy.id);
        setIsWishlisted(false);
        toast({
          description: "Strategy has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      toast({
        description: "Failed to update wishlist in database",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isWishlisted,
    isLoading,
    hasPremium,
    isPaidStrategy,
    accessCheckComplete,
    handleToggleWishlist
  };
};
