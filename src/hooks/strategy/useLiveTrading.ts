
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
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);
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
  
  const handleToggleLiveMode = async (
    id: number, 
    uniqueId?: string, 
    rowId?: string, 
    broker?: string
  ) => {
    const strategy = strategies.find(s => {
      if (s.id === id) {
        return rowId ? s.rowId === rowId : true;
      }
      return (uniqueId && s.uniqueId === uniqueId) || (rowId && s.rowId === rowId);
    });
    
    if (!strategy) {
      console.error("Strategy not found:", id, uniqueId, rowId);
      return;
    }
    
    setCurrentStrategyId(typeof id === 'number' ? id : parseInt(id as string, 10));
    setCurrentStrategyName(strategy.name || `Strategy ${id}`);
    setCurrentBrokerName(strategy.selectedBroker || null);
    setCurrentRowId(strategy.rowId || null);
    
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
        // Important: Use rowId for exact record targeting
        if (currentRowId) {
          console.log(`Updating specific strategy row (${currentRowId}) to paper trade mode`);
          
          if (currentCustomId) {
            // For custom strategies
            const { error } = await supabase
              .from('custom_strategies')
              .update({
                trade_type: 'paper trade'
              })
              .eq('id', currentCustomId)
              .eq('user_id', user.id);
              
            if (error) throw error;
          } else {
            // For predefined strategies - using rowId for exact matching
            const { error } = await supabase
              .from('strategy_selections')
              .update({
                trade_type: 'paper trade'
              })
              .eq('id', currentRowId)
              .eq('user_id', user.id);
              
            if (error) throw error;
          }
          
          // Update local state - carefully match the exact strategy by rowId
          setStrategies(prev => 
            prev.map(strategy => {
              if (strategy.rowId === currentRowId) {
                return {
                  ...strategy,
                  isLive: false,
                  tradeType: 'paper trade'
                };
              }
              return strategy;
            })
          );
          
          toast({
            title: "Paper Trading Enabled",
            description: `${currentStrategyName || 'Strategy'} is now in paper trading mode with ${currentBrokerName || 'broker'}`,
            duration: 3000,
          });
        } else {
          console.error("Missing rowId for paper trade update");
          toast({
            title: "Error",
            description: "Could not identify the specific strategy to update",
            variant: "destructive",
          });
        }
        
        setShowConfirmationDialog(false);
        resetState();
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
  
  const resetState = () => {
    setCurrentStrategyId(null);
    setCurrentCustomId(null);
    setCurrentStrategyName("");
    setCurrentBrokerName(null);
    setCurrentRowId(null);
    setTargetMode(null);
    setPendingQuantity(0);
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
      // This branch is for updating just the quantity of an existing strategy
      if (currentRowId) {
        if (currentCustomId) {
          // For custom strategies
          const { error } = await supabase
            .from('custom_strategies')
            .update({ quantity })
            .eq('id', currentCustomId)
            .eq('user_id', user.id);
            
          if (error) throw error;
        } else {
          // For predefined strategies - using rowId for exact matching
          const { error } = await supabase
            .from('strategy_selections')
            .update({ quantity })
            .eq('id', currentRowId)
            .eq('user_id', user.id);
            
          if (error) throw error;
        }
        
        // Update local state, matching by rowId
        setStrategies(prev => 
          prev.map(s => {
            if (s.rowId === currentRowId) {
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
      } else {
        console.error("Missing rowId for quantity update");
        toast({
          title: "Error",
          description: "Could not identify the specific strategy to update",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
    
    setShowQuantityDialog(false);
    resetState();
  };
  
  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    resetState();
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
      
      if (targetMode === "live" && pendingQuantity > 0 && currentStrategyId) {
        try {
          // Fetch the actual strategy name and description from predefined_strategies
          const { data: stratData } = await supabase
            .from('predefined_strategies')
            .select('name, description')
            .eq('id', currentStrategyId)
            .single();
            
          const strategyName = stratData?.name || currentStrategyName;
          const strategyDescription = stratData?.description || "";
          
          // Check if this strategy+broker combination already exists
          const { data: existingCombo, error: comboError } = await supabase
            .from('strategy_selections')
            .select('id')
            .eq('user_id', user.id)
            .eq('strategy_id', currentStrategyId)
            .eq('selected_broker', brokerName);
          
          if (comboError) throw comboError;
          
          let rowId;
          if (existingCombo && existingCombo.length > 0) {
            // Update existing record
            rowId = existingCombo[0].id;
            const { error } = await supabase
              .from('strategy_selections')
              .update({
                trade_type: 'live trade',
                quantity: pendingQuantity,
                broker_username: username,
                strategy_name: strategyName,
                strategy_description: strategyDescription
              })
              .eq('id', rowId);
              
            if (error) throw error;
          } else {
            // Insert new record
            const { data, error } = await supabase
              .from('strategy_selections')
              .insert({
                user_id: user.id,
                strategy_id: currentStrategyId,
                trade_type: 'live trade',
                quantity: pendingQuantity,
                selected_broker: brokerName,
                broker_username: username,
                strategy_name: strategyName,
                strategy_description: strategyDescription
              })
              .select();
              
            if (error) throw error;
            rowId = data?.[0]?.id;
          }
          
          // Reload strategies to get fresh data
          const updatedStrategies = await loadUserStrategies(user.id);
          
          // Merge with custom strategies
          const filteredCustomStrategies = customStrategies.filter(
            strategy => !strategy.name.includes("Evercrest")
          );
          
          setStrategies([...updatedStrategies, ...filteredCustomStrategies]);
          
          toast({
            title: "Live Trading Enabled",
            description: `${strategyName} is now live with broker ${brokerName} and quantity ${pendingQuantity}`,
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
        resetState();
        return;
      }
      
      if (currentRowId && currentStrategyId) {
        try {
          // Update broker for a specific strategy record (identified by rowId)
          const { error } = await supabase
            .from('strategy_selections')
            .update({
              selected_broker: brokerName,
              broker_username: username
            })
            .eq('id', currentRowId);
            
          if (error) throw error;
          
          // Update local state
          setStrategies(prev => 
            prev.map(s => {
              if (s.rowId === currentRowId) {
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
            description: `${currentStrategyName} broker set to ${brokerName}`,
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
      resetState();
    } catch (error) {
      console.error("Error in broker submission process:", error);
      toast({
        title: "Error",
        description: "Failed to process broker selection",
        variant: "destructive",
      });
      setShowBrokerDialog(false);
      resetState();
    }
  };
  
  const handleCancelBroker = () => {
    setShowBrokerDialog(false);
    resetState();
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
