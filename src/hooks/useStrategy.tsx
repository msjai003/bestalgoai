import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./strategy/types";
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
import { supabase } from "@/integrations/supabase/client";

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
  const [hasPremium, setHasPremium] = useState<boolean>(false);

  useEffect(() => {
    const checkPremium = async () => {
      if (!user) return false;
      
      try {
        const { data, error } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data && (data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
          setHasPremium(true);
          return true;
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
      return false;
    };
    
    checkPremium();
  }, [user]);

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
          isPremium: strategy.id > 1, // Mark all strategies except the first as premium
          isPaid: false // Initialize all strategies as not paid
        }));
        
        if (user) {
          const selections = await fetchUserStrategySelections(user.id);
          
          const { data: paidStrategies, error } = await supabase
            .from('strategy_selections')
            .select('strategy_id, paid_status')
            .eq('user_id', user.id)
            .eq('paid_status', 'paid');
            
          if (error) {
            console.error("Error fetching paid strategies:", error);
          }
          
          const paidStrategyIds = new Set(
            paidStrategies?.map(item => item.strategy_id) || []
          );
          
          strategiesWithStatus = strategiesWithStatus.map(strategy => ({
            ...strategy,
            isPaid: paidStrategyIds.has(strategy.id)
          }));
          
          strategiesWithStatus = mapStrategiesWithSelections(strategiesWithStatus, selections);
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
    const strategy = strategies.find(s => s.id === id);
    const isPremium = id > 1; // All strategies except the first are premium
    
    if (isPremium && !hasPremium && !strategy?.isPaid) {
      toast({
        title: "Premium Required",
        description: "Please upgrade to access premium strategies",
      });
      navigate('/pricing');
      return;
    }
    
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

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    const newStatus = !strategy?.isLive;
    const isPremium = id > 1; // All strategies except the first are premium
    
    if (isPremium && !hasPremium && !strategy?.isPaid) {
      const checkPaidStatus = async () => {
        if (!user) {
          navigate('/pricing');
          return;
        }
        
        try {
          const { data, error } = await supabase
            .from('strategy_selections')
            .select('*')
            .eq('user_id', user.id)
            .eq('strategy_id', id)
            .eq('paid_status', 'paid')
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setStrategies(prev => 
              prev.map(s => s.id === id ? { ...s, isPaid: true } : s)
            );
            
            if (newStatus) {
              setSelectedStrategyId(id);
              setTargetMode("live");
              setConfirmDialogOpen(true);
            } else {
              updateLiveMode(id, false);
            }
          } else {
            toast({
              title: "Premium Required",
              description: "Please upgrade to access premium strategies",
            });
            
            sessionStorage.setItem('selectedStrategyId', id.toString());
            sessionStorage.setItem('redirectAfterPayment', window.location.pathname);
            navigate('/pricing');
          }
        } catch (error) {
          console.error("Error checking strategy paid status:", error);
          sessionStorage.setItem('selectedStrategyId', id.toString());
          sessionStorage.setItem('redirectAfterPayment', window.location.pathname);
          navigate('/pricing');
        }
      };
      
      checkPaidStatus();
      return;
    }
    
    if (newStatus) {
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

        const { data: brokerData, error: brokerError } = await supabase
          .from('broker_credentials')
          .select('username')
          .eq('id', brokerId)
          .single();
          
        if (brokerError) {
          console.error("Error fetching broker username:", brokerError);
          throw brokerError;
        }
        
        const brokerUsername = brokerData?.username || "";

        await saveStrategyConfiguration(
          user.id,
          selectedStrategyId,
          strategy.name,
          strategy.description,
          pendingQuantity,
          brokerName,
          brokerUsername,
          "live trade"
        );
        
        const uniqueId = `${selectedStrategyId}-${brokerName}-${brokerUsername}`;
        
        const newStrategy = { 
          ...strategy, 
          isLive: true,
          quantity: pendingQuantity, 
          selectedBroker: brokerName,
          brokerUsername: brokerUsername,
          tradeType: "live trade",
          uniqueId: uniqueId
        };
        
        setStrategies(prev => [...prev, newStrategy]);

        toast({
          title: "Strategy Configured",
          description: `Strategy is now set up for live trading with ${brokerName}`,
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
    hasPremium
  };
};
