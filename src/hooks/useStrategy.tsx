
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadUserStrategies,
  updateStrategyLiveConfig,
  updateStrategyTradeType
} from "@/hooks/strategy/useStrategyDatabase";
import { checkUserPremiumStatus } from "@/lib/supabase/subscription";

export const useStrategy = (predefinedStrategies: any[]) => {
  const [strategies, setStrategies] = useState(predefinedStrategies);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [brokerDialogOpen, setBrokerDialogOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"live trade" | "paper trade">("paper trade");
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  // Set hasPremium to true by default to unlock all strategies
  const [hasPremium, setHasPremium] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // When predefinedStrategies are loaded or change, update our state
    if (predefinedStrategies.length > 0) {
      setStrategies(prevStrategies => {
        // If we already have strategies loaded with user settings, don't override them
        if (prevStrategies.length > 0 && prevStrategies[0].hasOwnProperty('isWishlisted')) {
          return prevStrategies;
        }
        return predefinedStrategies.map(strategy => ({
          ...strategy,
          isWishlisted: false,
          isLive: false,
          isPremium: false, // Set all strategies as non-premium
          isPaid: true // Mark all strategies as paid/unlocked
        }));
      });
    }
  }, [predefinedStrategies]);

  useEffect(() => {
    if (user) {
      loadStrategies();
      // Always set hasPremium to true for all users
      setHasPremium(true);
    }
  }, [user]);

  const checkPremiumStatus = async (userId: string) => {
    // Always return true to unlock all strategies
    setHasPremium(true);
  };

  const loadStrategies = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userStrategies = await loadUserStrategies(user.id);
      
      setStrategies(prevStrategies => {
        // Merge predefined strategies with user-specific configurations
        const mergedStrategies = predefinedStrategies.map(predefinedStrategy => {
          const userStrategy = userStrategies.find(userStrategy => userStrategy.id === predefinedStrategy.id);
          
          // Mark all strategies as accessible
          return { 
            ...predefinedStrategy, 
            ...(userStrategy || {}),
            isPremium: false, // Set all strategies as non-premium
            isPaid: true  // Mark all as paid/unlocked
          };
        });
        return mergedStrategies;
      });
    } catch (error) {
      console.error("Error loading strategies:", error);
      toast.error("Failed to load strategies");
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed type signature to match expected types in PredefinedStrategyList
  const handleToggleWishlist = (id: number, isWishlisted: boolean) => {
    setStrategies(prevStrategies =>
      prevStrategies.map(strategy =>
        strategy.id === id ? { ...strategy, isWishlisted: !strategy.isWishlisted } : strategy
      )
    );
  };

  // Fixed type signature to match expected types in PredefinedStrategyList
  const handleToggleLiveMode = async (id: number) => {
    setSelectedStrategyId(id);
    const strategy = strategies.find(s => s.id === id);

    if (!strategy) {
      console.error(`Strategy with ID ${id} not found`);
      return;
    }

    // Always open the dialog to choose mode, regardless of current state
    // This allows users to switch between brokers
    setTargetMode("live trade");
    setConfirmDialogOpen(true);
  };

  const handleConfirmLiveMode = async () => {
    setConfirmDialogOpen(false);
    
    // For live trade mode, we need quantity and broker info
    if (targetMode === "live trade") {
      setQuantityDialogOpen(true);
    } else {
      // Default values for paper trading - no broker needed
      await handleBrokerSubmit("", "", "");
    }
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
    resetDialogState();
  };

  const handleQuantitySubmit = (quantity: number) => {
    // Close quantity dialog
    setQuantityDialogOpen(false);
    
    // Store the quantity for later use with broker selection
    setSelectedQuantity(quantity);
    
    // Open the broker selection dialog
    setBrokerDialogOpen(true);
  };

  const resetDialogState = () => {
    setSelectedStrategyId(null);
    setSelectedQuantity(null);
    setConfirmDialogOpen(false);
    setQuantityDialogOpen(false);
    setBrokerDialogOpen(false);
  };

  const handleBrokerSubmit = async (brokerId: string, brokerName: string, username: string) => {
    try {
      // Close the broker dialog
      setBrokerDialogOpen(false);
      
      if (!user || !selectedStrategyId) {
        console.error("Missing required data for broker submission", {
          userId: user?.id,
          strategyId: selectedStrategyId
        });
        toast.error("Missing required information");
        return;
      }

      // Use default values for play icon (Zerodha and 789) only if no broker is selected
      const finalBrokerName = targetMode === "live trade" ? (brokerName || "zerodha") : "";
      const finalUsername = targetMode === "live trade" ? (username || "789") : "";
      const finalQuantity = selectedQuantity || 75; // Default to 75 if not specified
      
      console.log("Updating strategy with broker:", {
        userId: user.id,
        strategyId: selectedStrategyId,
        quantity: finalQuantity,
        brokerName: finalBrokerName,
        username: finalUsername,
        mode: targetMode
      });
      
      // Update the strategy configuration
      await updateStrategyLiveConfig(
        user.id,
        Number(selectedStrategyId),
        finalQuantity,
        finalBrokerName,
        finalUsername,
        targetMode
      );
      
      // Update local state to reflect changes immediately
      setStrategies(prevStrategies =>
        prevStrategies.map(strategy =>
          strategy.id === selectedStrategyId
            ? {
                ...strategy,
                isLive: targetMode === "live trade",
                quantity: finalQuantity,
                selectedBroker: finalBrokerName,
                brokerUsername: finalUsername,
                tradeType: targetMode
              }
            : strategy
        )
      );
      
      // Show success message
      toast.success(`Strategy set to ${targetMode} with broker ${finalBrokerName} successfully`);
      
      // Reset all dialog state
      resetDialogState();
    } catch (error) {
      console.error("Error updating strategy with broker:", error);
      toast.error("Failed to update strategy settings");
    }
  };

  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
    resetDialogState();
  };

  const handleCancelBroker = () => {
    setBrokerDialogOpen(false);
    resetDialogState();
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
    hasPremium: true // Always return true for hasPremium
  };
};
