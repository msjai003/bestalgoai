
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { syncWishlistMaintain, checkUserPremiumStatus, checkStrategyAccess } from "@/lib/supabase/subscription";
import { Strategy } from "@/hooks/strategy/types";

export const useStrategy = (predefinedStrategies: Strategy[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [brokerDialogOpen, setBrokerDialogOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"live trade" | "paper trade">("paper trade");
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  const [hasPremium, setHasPremium] = useState(false);
  
  useEffect(() => {
    if (user) {
      const checkPremiumStatus = async () => {
        try {
          const isPremium = await checkUserPremiumStatus(user.id);
          setHasPremium(isPremium);
          console.log("UseStrategy - Premium status:", isPremium);
        } catch (error) {
          console.error('Error checking premium status:', error);
        }
      };
      
      checkPremiumStatus();
    }
  }, [user]);
  
  useEffect(() => {
    if (!predefinedStrategies) return;
    
    const loadStrategiesWithAccess = async () => {
      setIsLoading(true);
      
      try {
        if (!user) {
          // If user is not logged in, just return the predefined strategies without access checks
          setStrategies(predefinedStrategies.map(strategy => ({
            ...strategy,
            isWishlisted: false,
            isLive: false,
            tradeMode: 'paper trade'
          })));
          setIsLoading(false);
          return;
        }
        
        // Get wishlist data for the user
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlist_maintain')
          .select('*')
          .eq('user_id', user.id);
          
        if (wishlistError) {
          console.error('Error fetching wishlist:', wishlistError);
          throw wishlistError;
        }
        
        // First check if the user has premium status
        const userHasPremium = await checkUserPremiumStatus(user.id);
        setHasPremium(userHasPremium);
        console.log("User has premium:", userHasPremium);
        
        // Map over predefined strategies to add access information
        const enhancedStrategies = await Promise.all(
          predefinedStrategies.map(async (strategy) => {
            // Check if the strategy is in the user's wishlist
            const isWishlisted = wishlistData?.some(item => 
              Number(item.strategy_id) === Number(strategy.id)
            ) || false;
            
            // Get the strategy trade mode
            const { data: selectionData, error: selectionError } = await supabase
              .from('strategy_selections')
              .select('*')
              .eq('user_id', user.id)
              .eq('strategy_id', strategy.id)
              .single();
              
            if (selectionError && selectionError.code !== 'PGRST116') {
              console.error('Error fetching strategy selection:', selectionError);
            }
            
            // Check if this strategy is specifically paid for by this user
            let hasAccess = false;
            
            // Access check for premium strategies
            if (strategy.package === 'premium' || strategy.isPremium) {
              if (userHasPremium) {
                // User has premium subscription, grant access to all premium strategies
                hasAccess = true;
                console.log(`User has premium subscription, granted access to strategy ${strategy.id}`);
              } else {
                // Check if this specific strategy is paid for
                hasAccess = await checkStrategyAccess(user.id, Number(strategy.id));
                console.log(`Strategy ${strategy.id} specific access check: ${hasAccess}`);
              }
            } else {
              // Free strategies are always accessible
              hasAccess = true;
            }
            
            return {
              ...strategy,
              isWishlisted,
              tradeMode: selectionData?.trade_type || 'paper trade',
              isPaid: hasAccess, // Mark strategy as paid if the user has a valid paid access
              isLive: selectionData?.trade_type === 'live trade',
              quantity: selectionData?.quantity || 0
            };
          })
        );
        
        setStrategies(enhancedStrategies);
        console.log("Enhanced strategies:", enhancedStrategies);
      } catch (error) {
        console.error('Error loading strategies with access:', error);
        toast({
          title: "Error",
          description: "Failed to load strategies. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStrategiesWithAccess();
  }, [predefinedStrategies, user, toast]);
  
  const handleToggleWishlist = async (strategyId: number, isCurrentlyWishlisted: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add strategies to your wishlist.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    try {
      // Find the strategy to get its name and description
      const strategy = strategies.find(s => s.id === strategyId);
      
      if (!strategy) {
        console.error(`Strategy with ID ${strategyId} not found`);
        return;
      }
      
      // Update the wishlist status in the database
      await syncWishlistMaintain(
        user.id,
        strategyId,
        strategy.name,
        strategy.description,
        !isCurrentlyWishlisted
      );
      
      // Update the local state
      setStrategies(prev => 
        prev.map(s => 
          s.id === strategyId 
            ? { ...s, isWishlisted: !isCurrentlyWishlisted } 
            : s
        )
      );
      
      toast({
        title: isCurrentlyWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
        description: `${strategy.name} has been ${isCurrentlyWishlisted ? 'removed from' : 'added to'} your wishlist.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleLiveMode = (strategyId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to toggle live mode.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    const strategy = strategies.find(s => Number(s.id) === strategyId);
    
    if (!strategy) {
      console.error(`Strategy with ID ${strategyId} not found`);
      return;
    }
    
    // If the strategy is premium and user doesn't have premium or specific paid access
    const isPremium = strategy.package === 'premium' || strategy.isPremium;
    // Critical check: if the user has premium subscription, they should have access to all premium strategies
    if (isPremium && !hasPremium && !strategy.isPaid) {
      toast({
        title: "Premium Strategy",
        description: "This is a premium strategy. Please upgrade to access it.",
        variant: "destructive",
      });
      
      // Store strategy ID for later use in pricing page
      sessionStorage.setItem('selectedStrategyId', strategyId.toString());
      sessionStorage.setItem('redirectAfterPayment', '/strategy-selection');
      
      // Redirect to pricing page
      navigate('/pricing');
      return;
    }
    
    // Set the target mode to the opposite of the current mode
    const currentMode = strategy.tradeMode || 'paper trade';
    const newMode = currentMode === 'live trade' ? 'paper trade' : 'live trade';
    
    // Only show confirmation dialog if switching to live mode
    if (newMode === 'live trade') {
      setTargetMode(newMode);
      setSelectedStrategyId(strategyId);
      setConfirmDialogOpen(true);
    } else {
      // No confirmation needed for paper trading
      handleUpdateTradeMode(strategyId, newMode);
    }
  };
  
  const handleConfirmLiveMode = () => {
    if (selectedStrategyId === null) return;
    
    setConfirmDialogOpen(false);
    setQuantityDialogOpen(true);
  };
  
  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
    setSelectedStrategyId(null);
  };
  
  const handleQuantitySubmit = (quantity: number) => {
    if (selectedStrategyId === null) return;
    
    setQuantityDialogOpen(false);
    setBrokerDialogOpen(true);
    
    // Save the quantity in session storage for use after broker selection
    sessionStorage.setItem('selectedQuantity', quantity.toString());
  };
  
  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
    setSelectedStrategyId(null);
  };
  
  const handleBrokerSubmit = async (brokerId: string, brokerUsername: string) => {
    if (selectedStrategyId === null) return;
    
    setBrokerDialogOpen(false);
    
    // Get quantity from session storage
    const quantityStr = sessionStorage.getItem('selectedQuantity');
    const quantity = quantityStr ? parseInt(quantityStr, 10) : 1;
    
    // Remove session storage items
    sessionStorage.removeItem('selectedQuantity');
    
    await handleUpdateTradeMode(selectedStrategyId, 'live trade', quantity, brokerId, brokerUsername);
    setSelectedStrategyId(null);
  };
  
  const handleCancelBroker = () => {
    setBrokerDialogOpen(false);
    setSelectedStrategyId(null);
    sessionStorage.removeItem('selectedQuantity');
  };
  
  const handleUpdateTradeMode = async (
    strategyId: number, 
    mode: 'live trade' | 'paper trade', 
    quantity = 0, 
    selectedBroker = '', 
    brokerUsername = ''
  ) => {
    if (!user) return;
    
    try {
      const strategy = strategies.find(s => s.id === strategyId);
      
      if (!strategy) {
        console.error(`Strategy with ID ${strategyId} not found`);
        return;
      }
      
      // Update or insert the selection in strategy_selections table
      const { error } = await supabase
        .from('strategy_selections')
        .upsert({
          user_id: user.id,
          strategy_id: strategyId,
          strategy_name: strategy.name,
          strategy_description: strategy.description,
          trade_type: mode,
          quantity: quantity,
          selected_broker: selectedBroker,
          broker_username: brokerUsername
        }, {
          onConflict: 'user_id,strategy_id'
        });
        
      if (error) {
        console.error('Error updating trade mode:', error);
        throw error;
      }
      
      // Update local state
      setStrategies(prev => 
        prev.map(s => 
          s.id === strategyId 
            ? { ...s, tradeMode: mode, isLive: mode === 'live trade' } 
            : s
        )
      );
      
      toast({
        title: "Strategy Updated",
        description: `${strategy.name} is now set to ${mode === 'live trade' ? 'live trading' : 'paper trading'}.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating trade mode:', error);
      toast({
        title: "Error",
        description: "Failed to update strategy settings. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return {
    strategies,
    isLoading,
    confirmDialogOpen,
    setConfirmDialogOpen,
    quantityDialogOpen,
    setQuantityDialogOpen,
    brokerDialogOpen,
    setBrokerDialogOpen,
    targetMode,
    selectedStrategyId,
    handleToggleWishlist,
    handleToggleLiveMode,
    handleConfirmLiveMode,
    handleCancelLiveMode,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    hasPremium
  };
};
