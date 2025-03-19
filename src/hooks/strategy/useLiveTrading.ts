import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./types";
import { useStrategyDialogs } from "./useStrategyDialogs";
import { useStrategyFiltering } from "./useStrategyFiltering";
import { 
  loadUserStrategies, 
  updateStrategyLiveConfig,
  fetchBrokerById,
  fetchUserBrokers
} from "./useStrategyDatabase";
import { saveStrategyConfiguration } from "./useStrategyConfiguration";
import { supabase } from "@/integrations/supabase/client";

export const useLiveTrading = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [availableBrokers, setAvailableBrokers] = useState<Array<{id: string, broker_name: string}>>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const dialogState = useStrategyDialogs();
  const filterState = useStrategyFiltering(strategies);
  
  useEffect(() => {
    const fetchStrategies = async () => {
      if (user) {
        const loadedStrategies = await loadUserStrategies(user.id);
        setStrategies(loadedStrategies);
        
        // Also fetch available brokers
        try {
          const brokers = await fetchUserBrokers(user.id);
          setAvailableBrokers(brokers);
        } catch (error) {
          console.error("Error fetching brokers:", error);
        }
      }
    };
    
    fetchStrategies();
  }, [user]);

  const handleToggleLiveMode = (id: number, brokerId?: string) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      if (!strategy.isLive) {
        // If strategy is currently in paper mode and user wants to switch to live mode
        dialogState.setTargetStrategyId(id);
        dialogState.setTargetMode('live');
        dialogState.setShowConfirmationDialog(true);
      } else {
        // If strategy is currently in live mode and user wants to switch to paper mode
        dialogState.setTargetStrategyId(id);
        dialogState.setTargetMode('paper');
        // If a broker ID is provided, set it to ensure we're toggling the correct broker config
        if (brokerId) {
          dialogState.setTargetBrokerId(brokerId);
        }
        dialogState.setShowConfirmationDialog(true);
      }
    }
  };

  const handleOpenQuantityDialog = (id: number) => {
    dialogState.setTargetStrategyId(id);
    dialogState.setShowQuantityDialog(true);
  };

  const confirmModeChange = async () => {
    if (dialogState.targetStrategyId === null || dialogState.targetMode === null) return;
    
    dialogState.setShowConfirmationDialog(false);
    
    if (dialogState.targetMode === 'live') {
      // User is switching from paper to live mode
      dialogState.setShowQuantityDialog(true);
    } else {
      try {
        // If we have a specific broker ID, use it to target the correct configuration
        if (dialogState.targetBrokerId) {
          await updateLiveMode(dialogState.targetStrategyId, false, dialogState.targetBrokerId);
        } else {
          // Otherwise, fall back to the legacy behavior
          await updateLiveMode(dialogState.targetStrategyId, false);
        }
        
        toast({
          title: "Success",
          description: "Strategy switched to paper trading mode",
        });
        dialogState.resetDialogState();
      } catch (error) {
        console.error("Error in confirmModeChange:", error);
        toast({
          title: "Error",
          description: "Failed to update strategy mode",
          variant: "destructive"
        });
      }
    }
  };

  const cancelModeChange = () => {
    dialogState.resetDialogState();
  };

  const handleQuantitySubmit = (quantity: number) => {
    if (dialogState.targetStrategyId === null) return;
    
    dialogState.openBrokerDialogAfterQuantity(quantity);
  };

  const handleCancelQuantity = () => {
    dialogState.setShowQuantityDialog(false);
    dialogState.resetDialogState();
  };
  
  const handleBrokerSubmit = async (brokerId: string, brokerName: string) => {
    if (dialogState.targetStrategyId === null || !user) return;
    
    try {
      console.log("Processing broker selection:", brokerId, "with name:", brokerName);
      
      const strategy = strategies.find(s => s.id === dialogState.targetStrategyId);
      if (!strategy) throw new Error("Strategy not found");
      
      // Save the strategy with the specific broker
      await saveStrategyConfiguration(
        user.id,
        dialogState.targetStrategyId,
        strategy.name,
        strategy.description,
        dialogState.pendingQuantity,
        brokerName,
        brokerId,
        "live trade"  // Explicitly set to live trade
      );

      // Update local state after successful database update
      const updatedStrategies = await loadUserStrategies(user.id);
      setStrategies(updatedStrategies);
      
      toast({
        title: "Live Trading Enabled",
        description: `Strategy "${strategy.name}" is now trading live with ${brokerName}`,
      });
    } catch (error) {
      console.error("Error saving strategy configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save strategy configuration",
        variant: "destructive"
      });
    } finally {
      dialogState.resetDialogState();
    }
  };
  
  const handleCancelBroker = () => {
    dialogState.resetDialogState();
  };
  
  const updateLiveMode = async (id: number, isLive: boolean, brokerId?: string) => {
    if (!user) return;
    
    try {
      const strategy = strategies.find(s => s.id === id);
      if (!strategy) return;
      
      if (!isLive) {
        // For paper trading with a specific broker ID
        if (brokerId) {
          console.log("Updating strategy-broker combination to paper trading mode:", {
            user_id: user.id,
            strategy_id: id,
            broker_id: brokerId,
            trade_type: "paper trade"
          });
          
          const { data, error: checkError } = await supabase
            .from('strategy_selections')
            .select('id')
            .eq('user_id', user.id)
            .eq('strategy_id', id)
            .eq('broker_id', brokerId)
            .single();
            
          if (checkError) {
            console.error("Error checking strategy-broker record:", checkError);
            throw checkError;
          }
          
          const { error } = await supabase
            .from('strategy_selections')
            .update({
              trade_type: "paper trade"
            })
            .eq('id', data.id);
            
          if (error) {
            console.error("Error updating strategy-broker to paper mode:", error);
            throw error;
          }
        } else {
          // For paper trading without a specific broker ID (legacy behavior)
          console.log("Updating strategy to paper trading mode in database:", {
            user_id: user.id,
            strategy_id: id,
            trade_type: "paper trade"
          });
          
          const { data, error: checkError } = await supabase
            .from('strategy_selections')
            .select('id')
            .eq('user_id', user.id)
            .eq('strategy_id', id)
            .maybeSingle();
            
          if (checkError) {
            console.error("Error checking strategy record:", checkError);
            throw checkError;
          }
          
          if (data) {
            const { error } = await supabase
              .from('strategy_selections')
              .update({
                trade_type: "paper trade",
                quantity: 0,
                selected_broker: ""
              })
              .eq('id', data.id);
              
            if (error) {
              console.error("Error updating strategy to paper mode:", error);
              throw error;
            }
          } else {
            const { error } = await supabase
              .from('strategy_selections')
              .insert({
                user_id: user.id,
                strategy_id: id,
                strategy_name: strategy.name,
                strategy_description: strategy.description || "",
                trade_type: "paper trade",
                quantity: 0,
                selected_broker: ""
              });
              
            if (error) {
              console.error("Error inserting strategy with paper mode:", error);
              throw error;
            }
          }
        }
        
        toast({
          title: "Paper Trading Activated",
          description: `Strategy "${strategy.name}" is now in paper trading mode`,
          variant: "default"
        });
      }
      
      // Update the local state
      const updatedStrategies = await loadUserStrategies(user.id);
      setStrategies(updatedStrategies);
      
    } catch (error) {
      console.error("Error updating strategy mode:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy mode",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    ...filterState,
    strategies: filterState.filteredStrategies,
    ...dialogState,
    availableBrokers,
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
