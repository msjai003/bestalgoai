import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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

export type { Strategy } from "./strategy/types";

export const useStrategy = (predefinedStrategies: any[]) => {
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
          selectedBroker: ""
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

  const handleDeployStrategy = (id: number) => {
    setSelectedStrategyId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmLiveMode = () => {
    setConfirmDialogOpen(false);
    if (selectedStrategyId !== null) {
      setTargetMode('live');
      setQuantityDialogOpen(true);
    }
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
    if (selectedStrategyId !== null) {
      setTargetMode('paper');
      setQuantityDialogOpen(true);
    }
  };

  const handleQuantitySubmit = (quantity: number) => {
    setQuantityDialogOpen(false);
    setPendingQuantity(quantity);
    setBrokerDialogOpen(true);
  };

  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
    setSelectedStrategyId(null);
    setTargetMode(null);
  };

  const handleBrokerSubmit = async (brokerId: string, brokerName: string) => {
    setBrokerDialogOpen(false);
    
    if (selectedStrategyId !== null && user) {
      try {
        const strategy = strategies.find(s => s.id === selectedStrategyId);
        
        if (!strategy) {
          throw new Error("Strategy not found");
        }

        await saveStrategyConfiguration(
          user.id,
          selectedStrategyId,
          strategy.name,
          strategy.description,
          pendingQuantity,
          brokerName,
          targetMode === 'live' ? "live trade" : "paper trade"
        );
        
        setStrategies(prev => 
          prev.map(s => 
            s.id === selectedStrategyId 
              ? { 
                  ...s, 
                  quantity: pendingQuantity, 
                  selectedBroker: brokerName,
                  tradeType: targetMode === 'live' ? "live trade" : "paper trade"
                } 
              : s
          )
        );

        toast({
          title: "Strategy Configured",
          description: `Strategy is now set up for ${targetMode === 'live' ? 'live' : 'paper'} trading`,
        });
      } catch (error) {
        console.error('Error saving strategy configuration:', error);
        toast({
          title: "Error",
          description: "Failed to save strategy configuration",
          variant: "destructive"
        });
      }
    }
    
    setSelectedStrategyId(null);
    setTargetMode(null);
    setPendingQuantity(0);
  };

  const handleCancelBroker = () => {
    setBrokerDialogOpen(false);
    setSelectedStrategyId(null);
    setTargetMode(null);
    setPendingQuantity(0);
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
    handleDeployStrategy,
    handleConfirmLiveMode,
    handleCancelLiveMode,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker
  };
};
