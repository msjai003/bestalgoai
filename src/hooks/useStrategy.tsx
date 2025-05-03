
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
  const [hasPremium, setHasPremium] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadStrategies();
      checkPremiumStatus(user.id);
    }
  }, [user]);

  const checkPremiumStatus = async (userId: string) => {
    const isPremium = await checkUserPremiumStatus(userId);
    setHasPremium(isPremium);
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
          
          // If user has a strategy with paid_status='paid', mark it as accessible
          // We need to check if the property exists before accessing it
          if (userStrategy && userStrategy.paid_status === 'paid') {
            return { 
              ...predefinedStrategy, 
              ...userStrategy,
              isPaid: true  // Mark as paid/unlocked
            };
          }
          
          return userStrategy ? { ...predefinedStrategy, ...userStrategy } : predefinedStrategy;
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

    // Determine the target mode based on the current state
    const isCurrentlyLive = strategy.isLive === true;
    setTargetMode(isCurrentlyLive ? "paper trade" : "live trade");

    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  const handleConfirmLiveMode = async () => {
    setConfirmDialogOpen(false);
    
    // If user is playing a strategy and targetMode is "live trade"
    if (targetMode === "live trade") {
      setQuantityDialogOpen(true);
    } else {
      // Default values for paper trading - no broker needed
      await handleBrokerSubmit("", "", "");
    }
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
  };

  const handleQuantitySubmit = (quantity: number) => {
    // Close quantity dialog
    setQuantityDialogOpen(false);
    
    // Store the quantity for later use with broker selection
    setSelectedQuantity(quantity);
    
    // Open the broker selection dialog if needed
    if (targetMode === "live trade") {
      setBrokerDialogOpen(true);
    } else {
      // For paper trading, use default values
      handleBrokerSubmit("", "", "");
    }
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

      // Use default values for play icon (Zerodha and 789)
      const finalBrokerName = targetMode === "live trade" ? (brokerId ? brokerName : "zerodha") : "";
      const finalUsername = targetMode === "live trade" ? (brokerId ? username : "789") : "";
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
      
      // Show success message
      toast.success(`Strategy set to ${targetMode} successfully`);
      
      // Refresh strategies list
      await loadStrategies();
    } catch (error) {
      console.error("Error updating strategy with broker:", error);
      toast.error("Failed to update strategy settings");
    }
  };

  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
  };

  const handleCancelBroker = () => {
    setBrokerDialogOpen(false);
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
