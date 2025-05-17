
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadUserStrategies,
  updateStrategyLiveConfig,
  updateStrategyTradeType
} from "@/hooks/strategy/useStrategyDatabase";
import { checkUserPremiumStatus } from "@/lib/supabase/subscription";
import { addToWishlist, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";
import { PREMIUM_STRATEGY_IDS } from "@/hooks/strategy/types";

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
    // When predefinedStrategies are loaded or change, update our state
    if (predefinedStrategies.length > 0) {
      console.log("Received predefined strategies in useStrategy:", predefinedStrategies);
      setStrategies(prevStrategies => {
        // If we already have strategies loaded with user settings, don't override them
        if (prevStrategies.length > 0 && prevStrategies[0].hasOwnProperty('isWishlisted')) {
          console.log("Preserving existing strategies with user settings");
          return prevStrategies;
        }
        
        console.log("Creating new strategies with defaults");
        return predefinedStrategies.map(strategy => {
          // Explicitly convert strategy.id to number if it's a string
          const strategyIdNumber = typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : Number(strategy.id);
          
          // A strategy is premium if it's in the PREMIUM_STRATEGY_IDS list or has isPremium flag
          const isPremium = PREMIUM_STRATEGY_IDS.includes(strategyIdNumber) || strategy.isPremium === true;
          
          console.log(`Setting up strategy ${strategyIdNumber}: ${strategy.name}, isPremium: ${isPremium}, inPremiumIds: ${PREMIUM_STRATEGY_IDS.includes(strategyIdNumber)}`);
          
          return {
            ...strategy,
            id: strategyIdNumber, // Ensure ID is a number
            isWishlisted: false,
            isLive: false,
            isPremium: isPremium, // Setting premium flag based on the ID
            isPaid: false
          };
        });
      });
    }
  }, [predefinedStrategies]);

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
          
          // Explicitly convert strategy ID to number if needed
          const strategyIdNumber = typeof predefinedStrategy.id === 'string' ? 
            parseInt(predefinedStrategy.id, 10) : predefinedStrategy.id;
          
          // Check if this is a premium strategy
          const isPremium = PREMIUM_STRATEGY_IDS.includes(strategyIdNumber) || predefinedStrategy.isPremium === true;
          
          console.log(`Merging strategy ${predefinedStrategy.id}: ${predefinedStrategy.name}`, {
            hasUserStrategy: !!userStrategy,
            userPaidStatus: userStrategy?.paid_status,
            isPremium: isPremium,
            inPremiumIDs: PREMIUM_STRATEGY_IDS.includes(strategyIdNumber)
          });
          
          // If user has a strategy with paid_status='paid', mark it as accessible
          // We need to check if the property exists before accessing it
          if (userStrategy && userStrategy.paid_status === 'paid') {
            console.log(`Strategy ${predefinedStrategy.id} is marked as paid/unlocked`);
            return { 
              ...predefinedStrategy, 
              ...userStrategy,
              name: predefinedStrategy.name, // Ensure we keep the original name
              description: predefinedStrategy.description, // Ensure we keep the original description
              isPremium: isPremium, // Keep the premium flag
              isPaid: true  // Mark as paid/unlocked
            };
          }
          
          return userStrategy ? {
            ...predefinedStrategy,
            ...userStrategy,
            name: predefinedStrategy.name, // Ensure we keep the original name
            description: predefinedStrategy.description, // Ensure we keep the original description
            isPremium: isPremium, // Keep the premium flag
          } : {
            ...predefinedStrategy,
            isWishlisted: false,
            isLive: false,
            isPremium: isPremium, // Setting premium flag based on the ID
            isPaid: false
          };
        });
        
        console.log("Final merged strategies:", mergedStrategies);
        return mergedStrategies;
      });
    } catch (error) {
      console.error("Error loading strategies:", error);
      toast.error("Failed to load strategies");
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handleToggleWishlist function to correctly use wishlist_maintain table
  const handleToggleWishlist = async (id: number, isWishlisted: boolean) => {
    if (!user) {
      console.log("User not authenticated, cannot toggle wishlist");
      return;
    }

    try {
      console.log(`Toggle wishlist for strategy ${id}, current state: ${isWishlisted}`);

      // Find the strategy to get its name and description
      const strategy = strategies.find(s => s.id === id);
      if (!strategy) {
        console.error(`Strategy with ID ${id} not found`);
        return;
      }

      if (!isWishlisted) {
        // Add to wishlist
        await addToWishlist(user.id, id, strategy.name, strategy.description || "");
        toast.success(`Added "${strategy.name}" to your wishlist`);
      } else {
        // Remove from wishlist - with a more generic message
        await removeFromWishlist(user.id, id);
        toast.success(`Removed strategy from your wishlist`);
      }

      // Update local state
      setStrategies(prevStrategies =>
        prevStrategies.map(strategy =>
          strategy.id === id ? { ...strategy, isWishlisted: !isWishlisted } : strategy
        )
      );
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  // Fixed type signature to match expected types in PredefinedStrategyList
  const handleToggleLiveMode = async (id: number) => {
    // Find the strategy
    const strategy = strategies.find(s => s.id === id);
    
    if (!strategy) {
      console.error(`Strategy with ID ${id} not found`);
      return;
    }
    
    // Check if the strategy is premium and not paid
    const isPremium = PREMIUM_STRATEGY_IDS.includes(id) || strategy.isPremium === true;
    const canAccess = !isPremium || hasPremium || strategy.isPaid === true;
    
    if (isPremium && !canAccess) {
      // If it's a premium strategy and user doesn't have access, redirect to pricing
      sessionStorage.setItem('selectedStrategyId', id.toString());
      sessionStorage.setItem('redirectAfterPayment', '/live-trading');
      // We'll let the component handle the navigation
      return;
    }
    
    // Otherwise, proceed with the normal flow
    setSelectedStrategyId(id);
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
    hasPremium
  };
};
