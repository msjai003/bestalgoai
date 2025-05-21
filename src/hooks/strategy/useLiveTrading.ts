
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loadUserStrategies, updateStrategyLiveConfig } from "./useStrategyDatabase";
import { checkUserPremiumStatus, checkStrategyAccess } from "@/lib/supabase/subscription";

export const useLiveTrading = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"all" | "live" | "paper">("all");
  const [strategies, setStrategies] = useState<any[]>([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);
  const [targetMode, setTargetMode] = useState<"live trade" | "paper trade">("paper trade");
  const [currentStrategyId, setCurrentStrategyId] = useState<number | null>(null);
  const [currentStrategyName, setCurrentStrategyName] = useState<string | null>(null);
  const [currentBrokerName, setCurrentBrokerName] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [hasPremium, setHasPremium] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const refreshStrategies = useCallback(async () => {
    if (!user) return;
    
    try {
      // Check for premium status first
      const isPremium = await checkUserPremiumStatus(user.id);
      setHasPremium(isPremium);
      console.log("Premium status in useLiveTrading:", isPremium);
      
      // Load user strategies
      const loadedStrategies = await loadUserStrategies(user.id);
      console.log("Loaded strategies:", loadedStrategies);
      
      // Process strategies to mark premium ones as accessible if user has premium
      const processedStrategies = await Promise.all(loadedStrategies.map(async (strategy) => {
        // Check if this is specifically Zenflow (always free)
        const isZenflow = strategy.strategy_name?.toLowerCase().includes('zen');
        
        // Check if this is specifically Evercrest (always premium)
        const isEvercrest = strategy.strategy_name?.toLowerCase().includes('evercrest');
        
        // Check if this is specifically Speed Up (always premium)
        const isSpeedUp = strategy.strategy_name?.toLowerCase().includes('speed up');
        
        // Check if this is specifically Velox Edge (always premium)
        const isVeloxEdge = strategy.strategy_name?.toLowerCase().includes('velox');
        
        // Check if this is specifically NovaGlide (always premium)
        const isNovaGlide = strategy.strategy_name?.toLowerCase().includes('nova');
        
        // A strategy is premium if it's premium package or one of the premium strategies
        const isPremiumStrategy = (strategy.package === 'premium' || 
                                isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && !isZenflow;
        
        // Check specific strategy access
        let hasAccess = false;
        if (isPremiumStrategy) {
          hasAccess = await checkStrategyAccess(user.id, strategy.strategy_id);
        }
        
        // Set isPaid to true if it's not a premium strategy, or if user has premium access or specific access
        const isPaid = !isPremiumStrategy || isPremium || hasAccess;
        
        console.log(`Strategy ${strategy.strategy_id}: ${strategy.strategy_name}`, {
          isPremiumStrategy,
          isPremium,
          hasSpecificAccess: hasAccess,
          isPaid,
          isEvercrest,
          isSpeedUp,
          isVeloxEdge,
          isNovaGlide,
          isZenflow
        });
        
        return {
          id: strategy.strategy_id,
          name: strategy.strategy_name,
          description: strategy.strategy_description,
          isLive: strategy.trade_type === "live trade",
          tradeType: strategy.trade_type,
          quantity: strategy.quantity,
          selectedBroker: strategy.selected_broker,
          brokerUsername: strategy.broker_username,
          isPremium: isPremiumStrategy,
          isPaid: isPaid, // Mark as paid based on premium status
          package: strategy.package || (isPremiumStrategy ? 'premium' : 'free')
        };
      }));
      
      // Filter strategies based on selected mode
      const filteredStrategies = selectedMode === "all" 
        ? processedStrategies 
        : processedStrategies.filter(strategy => {
            if (selectedMode === "live") {
              return strategy.isLive;
            } else {
              return !strategy.isLive;
            }
          });
      
      setStrategies(filteredStrategies);
      
      // Set isActive based on whether there are any active live strategies
      const hasActiveStrategy = processedStrategies.some(s => s.isLive);
      setIsActive(hasActiveStrategy);
      
    } catch (error) {
      console.error("Error loading strategies:", error);
      toast.error("Failed to load strategies");
    }
  }, [user, selectedMode]);

  // Load strategies when component mounts or selectedMode changes
  useEffect(() => {
    refreshStrategies();
  }, [refreshStrategies, selectedMode]);

  const handleTradingToggle = () => {
    setIsActive(!isActive);
    toast({
      description: !isActive 
        ? "Your strategies are now live and will execute trades based on your settings." 
        : "Trading has been paused. No new trades will be executed.",
      duration: 3000,
    });
  };

  const handleModeChange = (mode: "all" | "live" | "paper") => {
    setSelectedMode(mode);
  };

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    if (!strategy) return;
    
    // If the strategy is premium and not paid, redirect to pricing
    if (strategy.isPremium && !strategy.isPaid) {
      sessionStorage.setItem('selectedStrategyId', id.toString());
      sessionStorage.setItem('redirectAfterPayment', '/live-trading');
      navigate('/pricing');
      return;
    }
    
    setCurrentStrategyId(id);
    setCurrentStrategyName(strategy.name);
    setCurrentBrokerName(strategy.selectedBroker || null);
    setTargetMode(strategy.isLive ? "paper trade" : "live trade");
    setShowConfirmationDialog(true);
  };

  const confirmModeChange = () => {
    // This will be handled in the dialog's onConfirm callback
    setShowConfirmationDialog(false);
    
    if (targetMode === "live trade") {
      setShowQuantityDialog(true);
    } else {
      handleBrokerSubmit("", "", "");
    }
  };

  const handleQuantitySubmit = (quantity: number) => {
    setSelectedQuantity(quantity);
    setShowQuantityDialog(false);
    setShowBrokerDialog(true);
  };

  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    resetDialogState();
  };

  const handleBrokerSubmit = async (brokerId: string, brokerName: string, username: string) => {
    try {
      setShowBrokerDialog(false);
      
      if (!user || !currentStrategyId) {
        toast.error("Missing required information");
        return;
      }
      
      const finalBrokerName = targetMode === "live trade" ? (brokerName || "zerodha") : "";
      const finalUsername = targetMode === "live trade" ? (username || "789") : "";
      const finalQuantity = selectedQuantity || 75;
      
      await updateStrategyLiveConfig(
        user.id,
        currentStrategyId,
        finalQuantity,
        finalBrokerName,
        finalUsername,
        targetMode,
        currentStrategyName || ""
      );
      
      toast.success(`Strategy set to ${targetMode} mode successfully`);
      refreshStrategies();
      resetDialogState();
      
    } catch (error) {
      console.error("Error updating strategy:", error);
      toast.error("Failed to update strategy");
    }
  };

  const handleCancelBroker = () => {
    setShowBrokerDialog(false);
    resetDialogState();
  };

  const resetDialogState = () => {
    setCurrentStrategyId(null);
    setCurrentStrategyName(null);
    setCurrentBrokerName(null);
    setSelectedQuantity(null);
  };

  return {
    isActive,
    selectedMode,
    strategies,
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog, 
    setShowBrokerDialog,
    targetMode,
    handleTradingToggle,
    handleModeChange,
    handleToggleLiveMode,
    confirmModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    navigate,
    setCurrentStrategyId,
    currentStrategyName,
    currentBrokerName,
    refreshStrategies
  };
};
