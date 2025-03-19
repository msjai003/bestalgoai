import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('refresh')) {
      setRefreshTrigger(prev => prev + 1);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const loadStrategies = async () => {
      console.log("Loading strategies...");
      setIsLoading(true);
      
      try {
        if (refreshTrigger > 0) {
          console.log("Triggered refresh, clearing local storage cache");
          localStorage.removeItem('wishlistedStrategies');
        }
        
        let strategiesWithStatus = predefinedStrategies.map(strategy => ({
          ...strategy,
          isWishlisted: false,
          isLive: false,
          quantity: 0,
          selectedBroker: "",
          paidStatus: strategy.id === 1 ? "free" : "premium"
        }));
        
        if (user) {
          console.log("Fetching user strategy selections for user:", user.id);
          const selections = await fetchUserStrategySelections(user.id);
          console.log("User strategy selections:", selections);
          strategiesWithStatus = mapStrategiesWithSelections(predefinedStrategies, selections);
        }
        
        console.log("Final strategies with status:", strategiesWithStatus);
        setStrategies(strategiesWithStatus);
      } catch (error) {
        console.error("Error setting up strategies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStrategies();
  }, [user, predefinedStrategies, refreshTrigger]);

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
            tradeType: isLive ? "live trade" : "paper"
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

  const handleToggleLiveMode = async (id: number) => {
    const strategyIndex = strategies.findIndex(s => s.id === id);
    const strategy = strategies[strategyIndex];
    const isFreeStrategy = strategyIndex === 0;
    const isPremiumStrategy = !isFreeStrategy;
    const newStatus = !strategy?.isLive;
    
    if (newStatus && isPremiumStrategy && !strategy.isLive) {
      const checkPremiumAccess = async () => {
        try {
          if (!user) return false;
          
          console.log("Checking premium access for strategy ID:", id);
          
          const { data: strategyData, error: strategyError } = await supabase
            .from('strategy_selections')
            .select('paid_status')
            .eq('user_id', user.id)
            .eq('strategy_id', id)
            .maybeSingle();
            
          console.log("Strategy specific payment check:", strategyData);
            
          if (strategyData && strategyData.paid_status === 'paid') {
            console.log("Strategy is already paid for");
            return true;
          }
          
          const { data, error } = await supabase
            .from('plan_details')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_paid', true)
            .order('selected_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          console.log("User paid plan check:", data);
          return data !== null && data.is_paid === true;
        } catch (error) {
          console.error('Error checking premium access:', error);
          return false;
        }
      };
      
      const hasPremiumAccess = await checkPremiumAccess();
      console.log("Premium access check result:", hasPremiumAccess);
      
      if (hasPremiumAccess) {
        setSelectedStrategyId(id);
        setTargetMode("live");
        setConfirmDialogOpen(true);
      } else {
        setSelectedStrategyId(id);
        return false;
      }
    } else if (newStatus) {
      setSelectedStrategyId(id);
      setTargetMode("live");
      setConfirmDialogOpen(true);
    } else {
      updateLiveMode(id, false);
    }
    
    return true;
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

        let paidStatus = "free";
        
        const strategyIndex = strategies.findIndex(s => s.id === selectedStrategyId);
        if (strategyIndex !== 0) {
          const { data: strategyData } = await supabase
            .from('strategy_selections')
            .select('paid_status')
            .eq('user_id', user.id)
            .eq('strategy_id', selectedStrategyId)
            .maybeSingle();
            
          if (strategyData && strategyData.paid_status === 'paid') {
            paidStatus = 'paid';
          } else {
            const { data: planData } = await supabase
              .from('plan_details')
              .select('*')
              .eq('user_id', user.id)
              .eq('is_paid', true)
              .order('selected_at', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            if (planData && planData.is_paid === true) {
              paidStatus = 'paid';
            } else {
              paidStatus = 'premium';
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
    handleCancelBroker,
    refreshTrigger,
    setRefreshTrigger
  };
};
