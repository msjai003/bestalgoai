import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./types";
import { loadUserStrategies, updateStrategyLiveConfig, updateStrategyTradeType, fetchBrokerById } from "./useStrategyDatabase";
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
  const [currentStrategyName, setCurrentStrategyName] = useState<string>("");
  const [currentCustomId, setCurrentCustomId] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [currentBroker, setCurrentBroker] = useState<string | null>(null);
  const [currentBrokerName, setCurrentBrokerName] = useState<string | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState<number>(0);
  
  const { customStrategies } = useCustomStrategies();
  
  useEffect(() => {
    const fetchStrategies = async () => {
      if (!user) return;
      
      try {
        const userStrategies = await loadUserStrategies(user.id);
        
        // Filter out any strategies with "Evercrest" in their name
        const filteredCustomStrategies = customStrategies.filter(
          strategy => !strategy.name.includes("Evercrest")
        );
        
        setStrategies(prev => {
          const combinedStrategies = [...userStrategies, ...filteredCustomStrategies];
          
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
  
  const handleToggleLiveMode = async (id: number, uniqueId?: string, rowId?: string, broker?: string) => {
    const strategy = strategies.find(s => {
      if (s.id === id) return true;
      return (uniqueId && s.uniqueId === uniqueId) || (rowId && s.rowId === rowId);
    });
    
    if (!strategy) {
      console.error("Strategy not found:", id, uniqueId, rowId);
      return;
    }
    
    setCurrentStrategyId(typeof id === 'number' ? id : parseInt(id as string, 10));
    setCurrentStrategyName(strategy.name || `Strategy ${id}`);
    setCurrentBrokerName(strategy.selectedBroker || null);
    
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
      if (targetMode === "live") {
        setShowConfirmationDialog(false);
        setShowQuantityDialog(true);
      } else {
        if (currentCustomId) {
          const { error } = await supabase
            .from('custom_strategies')
            .update({
              trade_type: 'paper trade',
              quantity: 0,
              selected_broker: null,
              broker_username: null
            })
            .eq('id', currentCustomId)
            .eq('user_id', user.id);
            
          if (error) throw error;
        } else if (currentStrategyId !== null) {
          const { error } = await supabase
            .from('strategy_selections')
            .update({
              trade_type: 'paper trade',
              quantity: 0,
              selected_broker: null,
              broker_username: null
            })
            .eq('strategy_id', currentStrategyId)
            .eq('user_id', user.id);
            
          if (error) throw error;
        }
        
        setStrategies(prev => 
          prev.map(strategy => {
            if (strategy.id === currentStrategyId || strategy.rowId === currentCustomId) {
              return {
                ...strategy,
                isLive: false,
                quantity: 0,
                selectedBroker: null,
                brokerUsername: null,
                tradeType: 'paper trade'
              };
            }
            return strategy;
          })
        );
        
        toast({
          title: "Paper Trading Enabled",
          description: `${currentStrategyName || 'Strategy'} is now in paper trading mode`,
          duration: 3000,
        });
        
        setShowConfirmationDialog(false);
        setCurrentStrategyId(null);
        setCurrentCustomId(null);
        setCurrentStrategyName("");
        setCurrentBrokerName(null);
        setTargetMode(null);
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
    if (!user || (currentStrategyId === null && currentCustomId === null)) return;
    
    if (targetMode === "live") {
      setShowQuantityDialog(false);
      setShowBrokerDialog(true);
      setPendingQuantity(quantity);
      return;
    }
    
    try {
      const strategy = strategies.find(s => s.id === currentStrategyId || s.rowId === currentCustomId);
      
      if (strategy?.isCustom && strategy.rowId) {
        const { error } = await supabase
          .from('custom_strategies')
          .update({ quantity })
          .eq('id', strategy.rowId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else if (strategy && currentStrategyId !== null) {
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          quantity,
          strategy.selectedBroker || "",
          strategy.brokerUsername || "",
          strategy.isLive ? "live trade" : "paper trade"
        );
      }
      
      setStrategies(prev => 
        prev.map(s => {
          if (s.id === currentStrategyId || s.rowId === currentCustomId) {
            return { ...s, quantity };
          }
          return s;
        })
      );
      
      toast({
        title: "Quantity Updated",
        description: `${currentStrategyName || 'Strategy'} quantity set to ${quantity}`,
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
    setCurrentCustomId(null);
    setCurrentStrategyName("");
  };
  
  const handleBrokerSubmit = async (brokerId: string, accountName: string) => {
    if (!user) return;
    
    try {
      // Fetch broker details to get the broker_name
      const { data: brokerData, error: brokerError } = await supabase
        .from('broker_credentials')
        .select('broker_name, username')
        .eq('id', brokerId)
        .single();
      
      if (brokerError) {
        console.error("Error fetching broker details:", brokerError);
        throw brokerError;
      }
      
      const brokerName = brokerData.broker_name;
      const username = brokerData.username;
      setCurrentBrokerName(brokerName);
      
      if (targetMode === "live" && pendingQuantity > 0) {
        try {
          if (currentCustomId) {
            const { error } = await supabase
              .from('custom_strategies')
              .update({
                trade_type: 'live trade',
                quantity: pendingQuantity,
                selected_broker: brokerName,
                broker_username: username
              })
              .eq('id', currentCustomId)
              .eq('user_id', user.id);
              
            if (error) throw error;
          } else if (currentStrategyId !== null) {
            // This part is critical - it saves the data to strategy_selections table
            // with strategy name, description, quantity, broker info
            const { error } = await supabase
              .from('strategy_selections')
              .update({
                trade_type: 'live trade',
                quantity: pendingQuantity,
                selected_broker: brokerName,
                broker_username: username
              })
              .eq('strategy_id', currentStrategyId)
              .eq('user_id', user.id);
              
            if (error) throw error;
          }
          
          setStrategies(prev => 
            prev.map(strategy => {
              if (strategy.id === currentStrategyId || strategy.rowId === currentCustomId) {
                return {
                  ...strategy,
                  isLive: true,
                  quantity: pendingQuantity,
                  selectedBroker: brokerName,
                  brokerUsername: username,
                  tradeType: 'live trade'
                };
              }
              return strategy;
            })
          );
          
          toast({
            title: "Live Trading Enabled",
            description: `${currentStrategyName || 'Strategy'} is now live with broker ${brokerName} and quantity ${pendingQuantity}`,
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
        
        setShowBrokerDialog(false);
        setPendingQuantity(0);
        setCurrentStrategyId(null);
        setCurrentCustomId(null);
        setCurrentStrategyName("");
        setTargetMode(null);
        return;
      }
      
      if (currentStrategyId !== null) {
        try {
          const strategy = strategies.find(s => s.id === currentStrategyId);
          
          if (strategy?.isCustom && strategy.rowId) {
            const { error } = await supabase
              .from('custom_strategies')
              .update({
                selected_broker: brokerName,
                broker_username: username
              })
              .eq('id', strategy.rowId)
              .eq('user_id', user.id);
              
            if (error) throw error;
          } else if (strategy) {
            await updateStrategyLiveConfig(
              user.id,
              currentStrategyId,
              strategy.quantity || 0,
              brokerName,
              username,
              strategy.isLive ? "live trade" : "paper trade"
            );
          }
          
          setStrategies(prev => 
            prev.map(s => {
              if (s.id === currentStrategyId) {
                return { 
                  ...s, 
                  selectedBroker: brokerName,
                  brokerUsername: username
                };
              }
              return s;
            })
          );
          
          toast({
            title: "Broker Settings Updated",
            description: `${currentStrategyName || 'Strategy'} broker set to ${brokerName}`,
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
      }
      
      setShowBrokerDialog(false);
      setCurrentStrategyId(null);
      setCurrentCustomId(null);
      setCurrentStrategyName("");
      setCurrentBrokerName(null);
    } catch (error) {
      console.error("Error in broker submission process:", error);
      toast({
        title: "Error",
        description: "Failed to process broker selection",
        variant: "destructive",
      });
      setShowBrokerDialog(false);
    }
  };
  
  const handleCancelBroker = () => {
    setShowBrokerDialog(false);
    setCurrentStrategyId(null);
    setCurrentCustomId(null);
    setCurrentStrategyName("");
    setCurrentBrokerName(null);
    setTargetMode(null);
    setPendingQuantity(0);
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
    currentBrokerName,
    currentStrategyId,
    currentStrategyName,
    setCurrentStrategyId,
    handleTradingToggle,
    handleModeChange,
    handleToggleLiveMode,
    confirmModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    navigate
  };
};
