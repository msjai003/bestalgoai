
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./types";
import { 
  loadUserStrategies, 
  updateStrategyLiveConfig, 
  updateStrategyTradeType 
} from "./useStrategyDatabase";
import { useCustomStrategies } from "./useCustomStrategies";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLiveTrading = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"all" | "live" | "paper">("all");
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);
  const [currentStrategyId, setCurrentStrategyId] = useState<number | null>(null);
  const [currentCustomId, setCurrentCustomId] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [currentBroker, setCurrentBroker] = useState<string | null>(null);
  
  // Get custom strategies
  const { customStrategies } = useCustomStrategies();
  
  useEffect(() => {
    const fetchStrategies = async () => {
      if (!user) return;
      
      try {
        const userStrategies = await loadUserStrategies(user.id);
        setStrategies(prev => {
          // Combine predefined strategies with custom strategies
          const combinedStrategies = [...userStrategies, ...customStrategies];
          
          // Filter by selected mode if needed
          if (selectedMode !== "all") {
            return combinedStrategies.filter(strategy => 
              (selectedMode === "live" && strategy.isLive) || 
              (selectedMode === "paper" && !strategy.isLive)
            );
          }
          
          return combinedStrategies;
        });
      } catch (error) {
        console.error("Error fetching strategies:", error);
      }
    };
    
    fetchStrategies();
  }, [user, selectedMode, customStrategies]);
  
  const handleModeChange = (mode: "all" | "live" | "paper") => {
    setSelectedMode(mode);
  };
  
  const handleTradingToggle = () => {
    setIsActive(!isActive);
    toast({
      title: !isActive ? "Trading Activated" : "Trading Deactivated",
      description: !isActive 
        ? "Your strategies are now live and will execute trades based on your settings." 
        : "Trading has been paused. No new trades will be executed.",
      duration: 3000,
    });
  };
  
  const handleToggleLiveMode = (id: number, uniqueId?: string, rowId?: string, broker?: string) => {
    // Find the specific strategy based on these identifiers
    const strategy = strategies.find(s => {
      if (s.id === id) {
        // For predefined strategies, also check the broker if provided
        if (broker && s.selectedBroker) {
          return s.selectedBroker === broker;
        }
        // If no broker is provided, or the strategy doesn't have a broker, match by id
        return true;
      }
      // Also check uniqueId or rowId for custom strategies
      return (uniqueId && s.uniqueId === uniqueId) || (rowId && s.rowId === rowId);
    });
    
    if (!strategy) {
      console.error("Strategy not found:", id, uniqueId, rowId, broker);
      return;
    }
    
    setCurrentStrategyId(typeof id === 'number' ? id : parseInt(id as string, 10));
    setCurrentBroker(broker || strategy.selectedBroker || null);
    
    if (strategy.isCustom && rowId) {
      setCurrentCustomId(rowId);
    } else {
      setCurrentCustomId(null);
    }
    
    // Toggle the current state for the specific broker
    setTargetMode(strategy.isLive ? "paper" : "live");
    setShowConfirmationDialog(true);
  };
  
  const handleOpenQuantityDialog = (id: number) => {
    setCurrentStrategyId(id);
    setShowQuantityDialog(true);
  };
  
  const confirmModeChange = async () => {
    if (!user || (currentStrategyId === null && currentCustomId === null) || targetMode === null) return;
    
    try {
      if (currentCustomId) {
        // Update custom strategy in custom_strategies table
        const { error } = await supabase
          .from('custom_strategies')
          .update({
            trade_type: targetMode === "live" ? "live trade" : "paper trade"
          })
          .eq('id', currentCustomId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else if (currentStrategyId !== null && currentBroker) {
        // For predefined strategies, update the specific broker's record
        await updateStrategyTradeType(
          user.id,
          currentStrategyId,
          targetMode === "live" ? "live trade" : "paper trade",
          currentBroker
        );
      }
      
      // Update local state - but only for the specific broker-strategy combination
      setStrategies(prev => 
        prev.map(strategy => {
          // Match by strategy ID and broker name (if applicable)
          if (strategy.id === currentStrategyId) {
            // For predefined strategies with brokers, make sure we only update the correct broker record
            if (strategy.selectedBroker && currentBroker) {
              if (strategy.selectedBroker === currentBroker) {
                return { ...strategy, isLive: targetMode === "live" };
              }
              // Different broker for same strategy ID, don't update
              return strategy;
            }
            // No broker specificity, update based on ID
            return { ...strategy, isLive: targetMode === "live" };
          } else if (strategy.rowId === currentCustomId) {
            // Custom strategy match by rowId
            return { ...strategy, isLive: targetMode === "live" };
          }
          return strategy;
        })
      );
      
      toast({
        title: targetMode === "live" ? "Strategy Set to Live Mode" : "Strategy Set to Paper Mode",
        description: `Strategy is now in ${targetMode} trading mode${currentBroker ? ` with ${currentBroker} broker` : ''}`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error updating strategy mode:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy mode",
        variant: "destructive",
      });
    }
    
    setShowConfirmationDialog(false);
    setCurrentStrategyId(null);
    setCurrentCustomId(null);
    setCurrentBroker(null);
    setTargetMode(null);
  };
  
  const cancelModeChange = () => {
    setShowConfirmationDialog(false);
    setCurrentStrategyId(null);
    setCurrentCustomId(null);
    setCurrentBroker(null);
    setTargetMode(null);
  };
  
  const handleQuantitySubmit = async (quantity: number) => {
    if (!user || currentStrategyId === null) return;
    
    try {
      const strategy = strategies.find(s => s.id === currentStrategyId);
      
      if (strategy?.isCustom && strategy.rowId) {
        // Update custom strategy quantity
        const { error } = await supabase
          .from('custom_strategies')
          .update({ quantity })
          .eq('id', strategy.rowId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Update predefined strategy quantity
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          quantity,
          strategy?.selectedBroker || "",
          strategy?.brokerUsername || "",
          strategy?.isLive ? "live trade" : "paper trade"
        );
      }
      
      // Update local state
      setStrategies(prev => 
        prev.map(s => {
          if (s.id === currentStrategyId) {
            return { ...s, quantity };
          }
          return s;
        })
      );
      
      toast({
        title: "Quantity Updated",
        description: `Strategy quantity set to ${quantity}`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
    
    setShowQuantityDialog(false);
    setCurrentStrategyId(null);
  };
  
  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    setCurrentStrategyId(null);
  };
  
  const handleBrokerSubmit = async (broker: string, username: string) => {
    if (!user || currentStrategyId === null) return;
    
    try {
      const strategy = strategies.find(s => s.id === currentStrategyId);
      
      if (strategy?.isCustom && strategy.rowId) {
        // Update custom strategy broker info
        const { error } = await supabase
          .from('custom_strategies')
          .update({
            selected_broker: broker,
            broker_username: username
          })
          .eq('id', strategy.rowId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Update predefined strategy broker info
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          strategy?.quantity || 0,
          broker,
          username,
          strategy?.isLive ? "live trade" : "paper trade"
        );
      }
      
      // Update local state
      setStrategies(prev => 
        prev.map(s => {
          if (s.id === currentStrategyId) {
            return { ...s, selectedBroker: broker, brokerUsername: username };
          }
          return s;
        })
      );
      
      toast({
        title: "Broker Settings Updated",
        description: `Strategy broker set to ${broker}`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error updating broker settings:", error);
      toast({
        title: "Error",
        description: "Failed to update broker settings",
        variant: "destructive",
      });
    }
    
    setShowBrokerDialog(false);
    setCurrentStrategyId(null);
  };
  
  const handleCancelBroker = () => {
    setShowBrokerDialog(false);
    setCurrentStrategyId(null);
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
    currentBroker,
    handleTradingToggle,
    handleModeChange,
    handleToggleLiveMode,
    handleOpenQuantityDialog,
    confirmModeChange,
    cancelModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    navigate
  };
};
