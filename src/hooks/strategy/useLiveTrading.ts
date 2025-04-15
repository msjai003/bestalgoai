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
  const [pendingQuantity, setPendingQuantity] = useState<number>(0);
  
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
    
    setTargetMode(strategy.isLive ? "paper" : "live");
    setShowConfirmationDialog(true);
  };
  
  const confirmModeChange = async () => {
    if (!user || (currentStrategyId === null && currentCustomId === null) || targetMode === null) return;
    
    try {
      if (targetMode === "live") {
        // For live mode, show quantity dialog first
        setShowConfirmationDialog(false);
        setShowQuantityDialog(true);
      } else {
        // For paper mode, update directly
        if (currentCustomId) {
          const { error } = await supabase
            .from('custom_strategies')
            .update({
              trade_type: 'paper trade',
              quantity: 0,
              selected_broker: '',
              broker_username: ''
            })
            .eq('id', currentCustomId)
            .eq('user_id', user.id);
            
          if (error) throw error;
        } else if (currentStrategyId !== null && currentBroker) {
          await updateStrategyTradeType(
            user.id,
            currentStrategyId,
            'paper trade',
            currentBroker
          );
        }
        
        // Update local state for paper trading
        setStrategies(prev => 
          prev.map(strategy => {
            if ((strategy.id === currentStrategyId && strategy.selectedBroker === currentBroker) ||
                strategy.rowId === currentCustomId) {
              return {
                ...strategy,
                isLive: false,
                quantity: 0,
                selectedBroker: '',
                brokerUsername: ''
              };
            }
            return strategy;
          })
        );
        
        toast({
          title: "Paper Trading Enabled",
          description: "Strategy is now in paper trading mode",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating strategy mode:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy mode",
        variant: "destructive",
      });
    }
  };
  
  const handleQuantitySubmit = async (quantity: number) => {
    if (!user || currentStrategyId === null) return;
    
    // After quantity is set, show broker selection
    setShowQuantityDialog(false);
    setShowBrokerDialog(true);
    setPendingQuantity(quantity);
  };
  
  const handleBrokerSubmit = async (brokerId: string, username: string) => {
    if (!user || currentStrategyId === null || pendingQuantity === 0) return;
    
    try {
      if (currentCustomId) {
        const { error } = await supabase
          .from('custom_strategies')
          .update({
            trade_type: 'live trade',
            quantity: pendingQuantity,
            selected_broker: brokerId,
            broker_username: username
          })
          .eq('id', currentCustomId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          pendingQuantity,
          brokerId,
          username,
          'live trade'
        );
      }
      
      // Update local state
      setStrategies(prev => 
        prev.map(strategy => {
          if ((strategy.id === currentStrategyId) || 
              (strategy.rowId === currentCustomId)) {
            return {
              ...strategy,
              isLive: true,
              quantity: pendingQuantity,
              selectedBroker: brokerId,
              brokerUsername: username
            };
          }
          return strategy;
        })
      );
      
      toast({
        title: "Live Trading Enabled",
        description: `Strategy is now live with quantity ${pendingQuantity} and broker ${brokerId}`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error updating strategy configuration:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy configuration",
        variant: "destructive",
      });
    }
    
    // Reset all dialogs and temporary states
    setShowBrokerDialog(false);
    setPendingQuantity(0);
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
