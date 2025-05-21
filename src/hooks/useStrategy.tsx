import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadUserStrategies,
  updateStrategyLiveConfig,
  updateStrategyTradeType
} from "@/hooks/strategy/useStrategyDatabase";
import { checkUserPremiumStatus, checkStrategyAccess } from "@/lib/supabase/subscription";
import { addToWishlist, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";
import { useNavigate } from "react-router-dom";
import { Strategy } from "./strategy/types";

export const useStrategy = (predefinedStrategies: any[]) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [brokerDialogOpen, setBrokerDialogOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"live trade" | "paper trade">("paper trade");
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [hasPremium, setHasPremium] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Filter out Apexflow strategies before setting them
    if (predefinedStrategies.length > 0) {
      console.log("Received predefined strategies in useStrategy:", predefinedStrategies);
      
      // Filter out Apexflow strategies
      const filteredStrategies = predefinedStrategies.filter(
        strategy => !strategy.name || !strategy.name.toLowerCase().includes('apex')
      );
      
      setStrategies(prevStrategies => {
        // If we already have strategies loaded with user settings, don't override them
        if (prevStrategies.length > 0 && prevStrategies[0].hasOwnProperty('isWishlisted')) {
          console.log("Preserving existing strategies with user settings");
          return prevStrategies.filter(strategy => 
            !strategy.name || !strategy.name.toLowerCase().includes('apex')
          );
        }
        
        console.log("Creating new strategies with defaults");
        return filteredStrategies.map(strategy => {
          // Explicitly convert strategy.id to number if it's a string
          const strategyIdNumber = typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : Number(strategy.id);
          
          // Check if this is Zenflow strategy (always free)
          const isZenflow = strategy.name.toLowerCase().includes('zen');
          
          // Check if this is Evercrest strategy (always premium)
          const isEvercrest = strategy.name.toLowerCase().includes('evercrest');
          
          // Check if this is Speed Up strategy (always premium)
          const isSpeedUp = strategy.name.toLowerCase().includes('speed up');
          
          // Check if this is Velox Edge strategy (always premium)
          const isVeloxEdge = strategy.name.toLowerCase().includes('velox');
          
          // Check if this is NovaGlide strategy (always premium)
          const isNovaGlide = strategy.name.toLowerCase().includes('nova');
          
          // A strategy is premium if:
          // - it has package='premium', OR 
          // - has isPremium flag, OR
          // - is Evercrest, Speed Up, Velox Edge, or NovaGlide,
          // BUT NOT if it's Zenflow (Zenflow is always free)
          const isPremium = (strategy.package === 'premium' || 
                           strategy.isPremium === true || 
                           isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && !isZenflow;
          
          console.log(`Setting up strategy ${strategyIdNumber}: ${strategy.name}, isPremium: ${isPremium}, package: ${strategy.package}, isSpeedUp: ${isSpeedUp}, isZenflow: ${isZenflow}, isEvercrest: ${isEvercrest}, isVeloxEdge: ${isVeloxEdge}, isNovaGlide: ${isNovaGlide}`);
          
          return {
            ...strategy,
            id: strategyIdNumber, // Ensure ID is a number
            isWishlisted: false,
            isLive: false,
            isPremium: isPremium, // Setting premium flag based on all conditions
            isPaid: false
          } as Strategy;
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

  // Check if the user has general premium access
  const checkPremiumStatus = async (userId: string) => {
    const isPremium = await checkUserPremiumStatus(userId);
    setHasPremium(isPremium);
    console.log("Premium status set to:", isPremium);
  };

  // Load all user strategies
  const loadStrategies = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userStrategies = await loadUserStrategies(user.id);
      
      setStrategies(prevStrategies => {
        // Filter out Apexflow strategies from predefinedStrategies
        const filteredPredefinedStrategies = predefinedStrategies.filter(
          strategy => !strategy.name || !strategy.name.toLowerCase().includes('apex')
        );
        
        // Merge predefined strategies with user-specific configurations
        const mergedStrategies = filteredPredefinedStrategies.map(predefinedStrategy => {
          const userStrategy = userStrategies.find(userStrategy => userStrategy.id === predefinedStrategy.id);
          
          // Explicitly convert strategy ID to number if needed
          const strategyIdNumber = typeof predefinedStrategy.id === 'string' ? 
            parseInt(predefinedStrategy.id, 10) : predefinedStrategy.id;
          
          // Check if this is Zenflow strategy (always free)
          const isZenflow = predefinedStrategy.name.toLowerCase().includes('zen');
          
          // Check if this is Evercrest strategy (always premium)
          const isEvercrest = predefinedStrategy.name.toLowerCase().includes('evercrest');
          
          // Check if this is Speed Up strategy (always premium)
          const isSpeedUp = predefinedStrategy.name.toLowerCase().includes('speed up');
          
          // Check if this is Velox Edge strategy (always premium)
          const isVeloxEdge = predefinedStrategy.name.toLowerCase().includes('velox');
          
          // Check if this is NovaGlide strategy (always premium)
          const isNovaGlide = predefinedStrategy.name.toLowerCase().includes('nova');
          
          // Check if this is a premium strategy based on package field or specific strategy name
          const isPremium = (predefinedStrategy.package === 'premium' || 
                          predefinedStrategy.isPremium === true || 
                          isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && !isZenflow;
          
          // Initially set isPaid to false, we'll check individual strategy access below
          let isPaid = false;

          // If user has premium plan access, mark all premium strategies as paid
          if (hasPremium && isPremium) {
            isPaid = true;
            console.log(`User has premium plan, marking strategy ${predefinedStrategy.name} as accessible`);
          } else if (userStrategy && userStrategy.paid_status === 'paid') {
            // If user has individually purchased this strategy, mark it as paid
            isPaid = true;
            console.log(`Strategy ${predefinedStrategy.name} is individually purchased`);
          }
          
          console.log(`Merging strategy ${predefinedStrategy.id}: ${predefinedStrategy.name}`, {
            hasUserStrategy: !!userStrategy,
            userPaidStatus: userStrategy?.paid_status,
            isPremium: isPremium,
            isZenflow: isZenflow,
            isEvercrest: isEvercrest,
            isSpeedUp: isSpeedUp, 
            isVeloxEdge: isVeloxEdge,
            isNovaGlide: isNovaGlide,
            package: predefinedStrategy.package,
            hasPremium: hasPremium,
            isPaid: isPaid
          });
          
          return userStrategy ? {
            ...predefinedStrategy,
            ...userStrategy,
            name: predefinedStrategy.name, // Ensure we keep the original name
            description: predefinedStrategy.description, // Ensure we keep the original description
            isPremium: isPremium, // Keep the premium flag
            isPaid: isPaid  // Set isPaid based on premium status
          } as Strategy : {
            ...predefinedStrategy,
            isWishlisted: false,
            isLive: false,
            isPremium: isPremium, // Setting premium flag based on package
            isPaid: isPaid  // Initial value that will be updated by checkStrategyAccess
          } as Strategy;
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
    
    // Check if this is Zenflow strategy (always free)
    const isZenflow = strategy.name && strategy.name.toLowerCase().includes('zen');
    
    // Check if this is Evercrest strategy (always premium)
    const isEvercrest = strategy.name && strategy.name.toLowerCase().includes('evercrest');
    
    // Check if this is Speed Up strategy (always premium)
    const isSpeedUp = strategy.name && strategy.name.toLowerCase().includes('speed up');
    
    // Check if this is Velox Edge strategy (always premium)
    const isVeloxEdge = strategy.name && strategy.name.toLowerCase().includes('velox');
    
    // Check if this is NovaGlide strategy (always premium)
    const isNovaGlide = strategy.name && strategy.name.toLowerCase().includes('nova');
    
    // Check if this is a premium strategy
    const isPremium = (strategy.package === 'premium' || 
                     strategy.isPremium === true || 
                     isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && 
                     !isZenflow;
    
    // Check if user has access to this specific strategy
    let canAccess = false;
    
    if (user) {
      // If not premium, always accessible
      if (!isPremium) {
        canAccess = true;
      } 
      // If premium, check if user has premium plan
      else if (hasPremium) {
        canAccess = true;
      }
      // Lastly, check individual strategy access
      else {
        canAccess = strategy.isPaid === true;
      }
    }
    
    console.log(`Toggle live mode for strategy ${id}: ${strategy.name}`, { 
      isPremium, 
      hasPremium, 
      isPaid: strategy.isPaid,
      canAccess,
      isEvercrest,
      isSpeedUp,
      isVeloxEdge,
      isNovaGlide,
      isZenflow
    });
    
    // For premium strategies without access, redirect to pricing with this strategy ID
    if (isPremium && !canAccess) {
      sessionStorage.setItem('selectedStrategyId', id.toString());
      sessionStorage.setItem('redirectAfterPayment', '/live-trading');
      navigate('/pricing');
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
