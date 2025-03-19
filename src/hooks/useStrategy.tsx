
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
  const [processingRequest, setProcessingRequest] = useState<boolean>(false);

  // Load strategies from database
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
    if (processingRequest) return;
    
    const strategy = strategies.find(s => s.id === id);
    const newStatus = !strategy?.isLive;
    
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
      // Add a small delay before opening the quantity dialog
      setTimeout(() => {
        setQuantityDialogOpen(true);
      }, 300);
    }
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
    setSelectedStrategyId(null);
  };

  const handleQuantitySubmit = (quantity: number) => {
    setPendingQuantity(quantity);
    // Add a small delay before opening the broker dialog
    setTimeout(() => {
      setBrokerDialogOpen(true);
    }, 300);
  };

  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
    setSelectedStrategyId(null);
  };

  const handleBrokerSubmit = async (brokerId: string, brokerName: string) => {
    if (processingRequest) return;
    
    setProcessingRequest(true);
    
    if (selectedStrategyId !== null && user) {
      try {
        const strategy = strategies.find(s => s.id === selectedStrategyId);
        
        if (!strategy) {
          throw new Error("Strategy not found");
        }

        toast({
          title: "Saving configuration...",
          description: "Please wait while we save your strategy configuration",
        });

        // Add trade_type parameter
        await saveStrategyConfiguration(
          user.id,
          selectedStrategyId,
          strategy.name,
          strategy.description,
          pendingQuantity,
          brokerName,
          brokerId,
          "live trade" // Set trade_type to "live trade"
        );
        
        setStrategies(prev => 
          prev.map(s => {
            if (s.id === selectedStrategyId) {
              // Create or update the selectedBrokers array
              const currentBrokers = s.selectedBrokers || [];
              const brokerExists = currentBrokers.some(b => b.brokerId === brokerId);
              
              let updatedBrokers;
              if (brokerExists) {
                updatedBrokers = currentBrokers.map(b => 
                  b.brokerId === brokerId 
                    ? { ...b, quantity: pendingQuantity } 
                    : b
                );
              } else {
                updatedBrokers = [
                  ...currentBrokers, 
                  { brokerId, brokerName, quantity: pendingQuantity }
                ];
              }
              
              return { 
                ...s, 
                quantity: pendingQuantity, 
                selectedBroker: brokerName,
                selectedBrokers: updatedBrokers,
                tradeType: "live trade" // Add tradeType to local state
              };
            }
            return s;
          })
        );

        toast({
          title: "Strategy Configured",
          description: `Strategy is now set up for live trading with ${brokerName}`,
        });
        
        // Navigate after a slight delay
        setTimeout(() => {
          navigate("/live-trading");
        }, 500);
      } catch (error) {
        console.error('Error saving strategy configuration:', error);
        toast({
          title: "Error",
          description: "Failed to save strategy configuration",
          variant: "destructive"
        });
      } finally {
        setBrokerDialogOpen(false);
        setSelectedStrategyId(null);
        setPendingQuantity(0);
        setProcessingRequest(false);
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
