
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadUserStrategies,
  updateStrategyLiveConfig,
  updateStrategyTradeType
} from "@/hooks/strategy/useStrategyDatabase";

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
    }
  }, [user]);

  useEffect(() => {
    // Mock premium status check
    const premiumStatus = Math.random() < 0.8;
    setHasPremium(premiumStatus);
  }, []);

  const loadStrategies = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userStrategies = await loadUserStrategies(user.id);
      setStrategies(prevStrategies => {
        // Merge predefined strategies with user-specific configurations
        const mergedStrategies = predefinedStrategies.map(predefinedStrategy => {
          const userStrategy = userStrategies.find(userStrategy => userStrategy.id === predefinedStrategy.id);
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
    setQuantityDialogOpen(true);
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
  };

  const handleQuantitySubmit = (quantity: number) => {
    // Close quantity dialog
    setQuantityDialogOpen(false);
    
    // Store the quantity for later use with broker selection
    setSelectedQuantity(quantity);
    
    // Open the broker selection dialog
    setBrokerDialogOpen(true);
  };

  const handleBrokerSubmit = async (brokerId: string, brokerName: string) => {
    try {
      // Close the broker dialog
      setBrokerDialogOpen(false);
      
      if (!user || !selectedStrategyId || !brokerId || !selectedQuantity) {
        console.error("Missing required data for broker submission", {
          userId: user?.id,
          strategyId: selectedStrategyId,
          brokerId,
          quantity: selectedQuantity
        });
        toast.error("Missing required information");
        return;
      }
      
      console.log("Updating strategy with broker:", {
        userId: user.id,
        strategyId: selectedStrategyId,
        quantity: selectedQuantity,
        brokerId,
        brokerName,
        mode: targetMode
      });
      
      // Update the strategy configuration
      await updateStrategyLiveConfig(
        user.id,
        Number(selectedStrategyId),
        selectedQuantity,
        brokerId,
        brokerName,
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
