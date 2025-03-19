
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./strategy/types";
import { supabase } from "@/integrations/supabase/client";
import { 
  fetchUserStrategySelections,
  mapStrategiesWithSelections
} from "./strategy/strategyHelpers";
import {
  addToWishlist,
  removeFromWishlist,
  updateLocalStorageWishlist
} from "./strategy/useStrategyWishlist";
import { saveStrategyConfiguration } from "./strategy/useStrategyConfiguration";

export type { Strategy } from "./strategy/types";

export const useStrategy = (predefinedStrategies: any[]) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [brokerDialogOpen, setBrokerDialogOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState<number>(0);

  useEffect(() => {
    const loadStrategies = async () => {
      setIsLoading(true);
      
      try {
        let strategiesWithStatus = predefinedStrategies.map(strategy => ({
          ...strategy,
          isWishlisted: false,
          isLive: false,
          quantity: 0,
          selectedBroker: "",
          paidStatus: strategy.id === 1 ? "free" : "premium" // Default first strategy as free, others as premium
        }));
        
        if (user) {
          const selections = await fetchUserStrategySelections(user.id);
          strategiesWithStatus = mapStrategiesWithSelections(predefinedStrategies, selections);
        }
        
        setStrategies(strategiesWithStatus);
      } catch (error) {
        console.error("Error setting up strategies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStrategies();
  }, [user, predefinedStrategies]);

  const handleToggleWishlist = async (id: number, isWishlisted: boolean) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, isWishlisted } 
          : strategy
      )
    );
    
    const strategy = strategies.find(s => s.id === id);
    
    toast({
      title: isWishlisted ? "Added to wishlist" : "Removed from wishlist",
      description: `Strategy has been ${isWishlisted ? 'added to' : 'removed from'} your wishlist`
    });
    
    updateLocalStorageWishlist(id, isWishlisted, strategies);
    
    if (user) {
      try {
        if (isWishlisted && strategy) {
          await addToWishlist(user.id, id, strategy.name, strategy.description);
        } else {
          await removeFromWishlist(user.id, id);
        }
      } catch (error) {
        console.error('Error updating wishlist in Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to update wishlist in database",
          variant: "destructive"
        });
      }
    } else if (isWishlisted) {
      toast({
        title: "Login Required",
        description: "Please login to save strategies to your wishlist permanently",
      });
    }
  };

  const updateLiveMode = (id: number, isLive: boolean) => {
    setStrategies(prev => 
      prev.map(strategy => {
        if (strategy.id === id) {
          return { 
            ...strategy, 
            isLive,
            tradeType: isLive ? "live trade" : "paper" // Set tradeType based on isLive status
          };
        }
        return strategy;
      })
    );
    
    toast({
      title: isLive ? "Strategy set to live mode" : "Strategy set to paper mode",
      description: `Strategy is now in ${isLive ? 'live' : 'paper'} trading mode`,
    });
  };

  const handleToggleLiveMode = (id: number) => {
    const strategyIndex = strategies.findIndex(s => s.id === id);
    const strategy = strategies[strategyIndex];
    const isFreeStrategy = strategyIndex === 0;  // First strategy is free
    const isPremiumStrategy = !isFreeStrategy;
    const newStatus = !strategy?.isLive;
    
    if (newStatus && isPremiumStrategy && !strategy.isLive) {
      const checkPremiumAccess = async () => {
        try {
          if (!user) return false;
          
          // Also check if this specific strategy has been paid for
          const { data: strategyData, error: strategyError } = await supabase
            .from('strategy_selections')
            .select('paid_status')
            .eq('user_id', user.id)
            .eq('strategy_id', id)
            .maybeSingle();
            
          if (strategyData && strategyData.paid_status === 'paid') {
            return true;
          }
          
          // Check if user has a premium plan
          const { data, error } = await supabase
            .from('plan_details')
            .select('*')
            .eq('user_id', user.id)
            .order('selected_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          return data !== null;
        } catch (error) {
          console.error('Error checking premium access:', error);
          return false;
        }
      };
      
      checkPremiumAccess().then(hasPremiumAccess => {
        if (hasPremiumAccess) {
          setSelectedStrategyId(id);
          setTargetMode("live");
          setConfirmDialogOpen(true);
        } else {
          navigate(`/pricing?strategyId=${id}`);
        }
      });
    } else if (newStatus) {
      setSelectedStrategyId(id);
      setTargetMode("live");
      setConfirmDialogOpen(true);
    } else {
      updateLiveMode(id, false);
    }
  };

  const handleConfirmLiveMode = () => {
    setConfirmDialogOpen(false);
    if (selectedStrategyId !== null) {
      updateLiveMode(selectedStrategyId, true);
      setQuantityDialogOpen(true);
    }
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
    setSelectedStrategyId(null);
  };

  const handleQuantitySubmit = (quantity: number) => {
    setQuantityDialogOpen(false);
    
    if (selectedStrategyId !== null) {
      setPendingQuantity(quantity);
      setBrokerDialogOpen(true);
    }
  };

  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
    setSelectedStrategyId(null);
  };

  const handleBrokerSubmit = async (brokerId: string, brokerName: string) => {
    setBrokerDialogOpen(false);
    
    if (selectedStrategyId !== null && user) {
      try {
        const strategy = strategies.find(s => s.id === selectedStrategyId);
        
        if (!strategy) {
          throw new Error("Strategy not found");
        }

        // Determine the appropriate paid_status to set
        let paidStatus = "free"; // Default
        
        // First strategy (index 0) is always free
        const strategyIndex = strategies.findIndex(s => s.id === selectedStrategyId);
        if (strategyIndex !== 0) {
          // Check if user paid for this specific strategy or has a plan
          const { data: strategyData } = await supabase
            .from('strategy_selections')
            .select('paid_status')
            .eq('user_id', user.id)
            .eq('strategy_id', selectedStrategyId)
            .maybeSingle();
            
          if (strategyData && strategyData.paid_status === 'paid') {
            paidStatus = 'paid';
          } else {
            // Check if user has a premium plan
            const { data: planData } = await supabase
              .from('plan_details')
              .select('*')
              .eq('user_id', user.id)
              .order('selected_at', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            if (planData) {
              paidStatus = 'paid'; // User has a plan, so set as paid
            } else {
              paidStatus = 'premium'; // Requires payment but not paid yet
            }
          }
        }

        await saveStrategyConfiguration(
          user.id,
          selectedStrategyId,
          strategy.name,
          strategy.description,
          pendingQuantity,
          brokerName,
          "live trade",
          paidStatus
        );
        
        setStrategies(prev => 
          prev.map(s => 
            s.id === selectedStrategyId 
              ? { 
                  ...s, 
                  quantity: pendingQuantity, 
                  selectedBroker: brokerName,
                  tradeType: "live trade",
                  paidStatus: paidStatus
                } 
              : s
          )
        );

        toast({
          title: "Strategy Configured",
          description: `Strategy is now set up for live trading`,
        });
        
        navigate("/live-trading");
      } catch (error) {
        console.error('Error saving strategy configuration:', error);
        toast({
          title: "Error",
          description: "Failed to save strategy configuration",
          variant: "destructive"
        });
      }
    }
  };

  const handleCancelBroker = () => {
    setBrokerDialogOpen(false);
    setSelectedStrategyId(null);
    setPendingQuantity(0);
    if (selectedStrategyId !== null) {
      updateLiveMode(selectedStrategyId, false);
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
    handleCancelBroker
  };
};
