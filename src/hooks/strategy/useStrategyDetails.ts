
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkStrategyAccess } from "@/lib/supabase/subscription";
import { addToWishlist, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";

export const useStrategyDetails = (strategy: any, user: any) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [isPaidStrategy, setIsPaidStrategy] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !strategy) return;
      
      try {
        const { data, error } = await supabase
          .from('strategy_selections')
          .select('id, paid_status')
          .eq('user_id', user.id)
          .eq('strategy_id', strategy.id);
          
        if (error) {
          console.error('Error checking wishlist status:', error);
          return;
        }
        
        setIsWishlisted(data && data.length > 0);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_paid', true)
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data && (data.plan_name === 'Premium' || data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
          setHasPremium(true);
          console.log('User has active premium subscription');
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };

    const checkSpecificStrategyAccess = async () => {
      if (!user || !strategy) return;

      try {
        const hasAccess = await checkStrategyAccess(user.id, strategy.id);
        console.log(`Strategy ${strategy.id} access check:`, hasAccess);
        
        if (hasAccess) {
          setIsPaidStrategy(true);
        }
      } catch (error) {
        console.error('Error checking specific strategy access:', error);
      }
    };
    
    checkWishlistStatus();
    checkPremiumStatus();
    checkSpecificStrategyAccess();
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
    handleToggleWishlist
  };
};
