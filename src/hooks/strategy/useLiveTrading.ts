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
import { TradeType } from "@/types/strategy";

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
  
  const { customStrategies } = useCustomStrategies();
  
  useEffect(() => {
    const fetchStrategies = async () => {
      if (!user) return;
      
      try {
        const userStrategies = await loadUserStrategies(user.id);
        
        // Type-safe combination of strategies
        const combinedStrategies = [
          ...userStrategies,
          ...customStrategies
        ];
        
        // Filter strategies based on selectedMode
        const filteredStrategies = selectedMode !== "all" 
          ? combinedStrategies.filter(strategy => 
              (selectedMode === "live" && strategy.isLive) || 
              (selectedMode === "paper" && !strategy.isLive)
            )
          : combinedStrategies;
        
        setStrategies(filteredStrategies);
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
        if (broker && s.selectedBroker) {
          return s.selectedBroker === broker;
        }
        return true;
      }
      return (uniqueId && s.uniqueId === uniqueId) || (rowId && s.rowId === rowId);
    });
    
    if (!strategy) {
      console.error("Strategy not found:", id, uniqueId, rowId, broker);
      return;
    }
    
    setCurrentStrategyId(typeof id === 'number' ? id : parseInt(id as string, 10));
    setCurrentBroker(broker || strategy.selectedBroker || null);
    
    if (strategy.isCustom && strategy.rowId) {
      setCurrentCustomId(strategy.rowId);
    } else {
      setCurrentCustomId(null);
    }
    
    setTargetMode(strategy.isLive ? "paper" : "live");
    setShowConfirmationDialog(true);
  };
  
  const confirmModeChange = async () => {
    if (!user || (currentStrategyId === null && currentCustomId === null) || targetMode === null) return;
    
    try {
      if (currentCustomId) {
        const tradeTypeValue: TradeType = targetMode === "live" ? "live trade" : "paper";
        
        const { error } = await supabase
          .from('custom_strategies')
          .update({
            trade_type: tradeTypeValue
          })
          .eq('id', currentCustomId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else if (currentStrategyId !== null && currentBroker) {
        const tradeTypeValue: TradeType = targetMode === "live" ? "live trade" : "paper";
        
        await updateStrategyTradeType(
          user.id,
          currentStrategyId,
          tradeTypeValue,
          currentBroker
        );
      }
      
      setStrategies(prev => 
        prev.map(strategy => {
          if (strategy.id === currentStrategyId) {
            if (strategy.selectedBroker && currentBroker) {
              if (strategy.selectedBroker === currentBroker) {
                const newTradeType: TradeType = targetMode === "live" ? "live trade" : "paper";
                return { ...strategy, isLive: targetMode === "live", tradeType: newTradeType };
              }
              return strategy;
            }
            const newTradeType: TradeType = targetMode === "live" ? "live trade" : "paper";
            return { ...strategy, isLive: targetMode === "live", tradeType: newTradeType };
          } else if (strategy.rowId === currentCustomId) {
            const newTradeType: TradeType = targetMode === "live" ? "live trade" : "paper";
            return { ...strategy, isLive: targetMode === "live", tradeType: newTradeType };
          }
          return strategy;
        })
      );
      
      toast({
        title: targetMode === "live" ? "Live Trading Enabled" : "Paper Trading Enabled",
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
  
  const handleOpenQuantityDialog = (id: number) => {
    setCurrentStrategyId(id);
    setShowQuantityDialog(true);
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
        const { error } = await supabase
          .from('custom_strategies')
          .update({ quantity })
          .eq('id', strategy.rowId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          quantity,
          strategy?.selectedBroker || "",
          strategy?.brokerUsername || "",
          strategy?.isLive ? "live trade" : "paper"
        );
      }
      
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
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          strategy?.quantity || 0,
          broker,
          username,
          strategy?.isLive ? "live trade" : "paper"
        );
      }
      
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
