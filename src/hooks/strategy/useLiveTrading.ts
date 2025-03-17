
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
  fetchBrokerById
} from "./useStrategyDatabase";
import { saveStrategyConfiguration } from "./useStrategyConfiguration";
import { supabase } from "@/integrations/supabase/client";

export const useLiveTrading = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
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
      }
    };
    
    fetchStrategies();
  }, [user]);

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      if (!strategy.isLive) {
        dialogState.setTargetStrategyId(id);
        dialogState.setTargetMode('live');
        dialogState.setShowConfirmationDialog(true);
      } else {
        dialogState.setTargetStrategyId(id);
        dialogState.setTargetMode('paper');
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
    
    try {
      if (dialogState.targetMode === 'live') {
        dialogState.setShowQuantityDialog(true);
      } else {
        await updateLiveMode(dialogState.targetStrategyId, false);
        toast({
          title: "Success",
          description: "Strategy switched to paper trading mode",
        });
      }
    } catch (error) {
      console.error("Error in confirmModeChange:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy mode",
        variant: "destructive"
      });
    } finally {
      if (dialogState.targetMode !== 'live') {
        dialogState.resetDialogState();
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
      
      console.log("Updating strategy in database for live trading:", {
        user_id: user.id,
        strategy_id: dialogState.targetStrategyId,
        quantity: dialogState.pendingQuantity,
        broker_name: brokerName,
        trade_type: "live trade"
      });
      
      const { data: existingRecord, error: checkError } = await supabase
        .from('strategy_selections')
        .select('id')
        .eq('user_id', user.id)
        .eq('strategy_id', dialogState.targetStrategyId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking existing record:", checkError);
        throw checkError;
      }
      
      let updateResult;
      
      if (existingRecord) {
        updateResult = await supabase
          .from('strategy_selections')
          .update({
            strategy_name: strategy.name,
            strategy_description: strategy.description,
            quantity: dialogState.pendingQuantity,
            selected_broker: brokerName,
            trade_type: "live trade"
          })
          .eq('user_id', user.id)
          .eq('strategy_id', dialogState.targetStrategyId);
          
        console.log("Updated existing record for live trading:", updateResult);
      } else {
        updateResult = await supabase
          .from('strategy_selections')
          .insert({
            user_id: user.id,
            strategy_id: dialogState.targetStrategyId,
            strategy_name: strategy.name,
            strategy_description: strategy.description || "",
            quantity: dialogState.pendingQuantity,
            selected_broker: brokerName,
            trade_type: "live trade"
          });
          
        console.log("Inserted new record for live trading:", updateResult);
      }
        
      if (updateResult.error) {
        console.error("Database update error:", updateResult.error);
        throw updateResult.error;
      }
      
      // Update the local state immediately to reflect changes
      const updatedStrategies = strategies.map(s => {
        if (s.id === dialogState.targetStrategyId) {
          return { 
            ...s, 
            isLive: true, 
            quantity: dialogState.pendingQuantity, 
            selectedBroker: brokerName,
            tradeType: "live trade"
          };
        }
        return s;
      });
      
      setStrategies(updatedStrategies);
      localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
      
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
  
  const updateLiveMode = async (id: number, isLive: boolean) => {
    if (!user) return;
    
    try {
      const strategy = strategies.find(s => s.id === id);
      if (!strategy) return;
      
      if (!isLive) {
        console.log("Updating strategy to paper trading mode in database:", {
          user_id: user.id,
          strategy_id: id,
          trade_type: "paper trade",
          quantity: 0,
          selected_broker: ""
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
        
        let updateResult;
        
        if (data) {
          updateResult = await supabase
            .from('strategy_selections')
            .update({
              trade_type: "paper trade",
              quantity: 0,
              selected_broker: ""
            })
            .eq('user_id', user.id)
            .eq('strategy_id', id);
            
          console.log("Update result:", updateResult);
        } else {
          updateResult = await supabase
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
            
          console.log("Insert result:", updateResult);
        }
        
        if (updateResult.error) {
          console.error("Error updating strategy to paper mode:", updateResult.error);
          throw updateResult.error;
        }
        
        toast({
          title: "Paper Trading Activated Successfully",
          description: `Strategy "${strategy.name}" is now in paper trading mode with simulated funds`,
          variant: "default"
        });
      }
      
      // Immediately update UI to reflect changes
      const updatedStrategies = strategies.map(s => {
        if (s.id === id) {
          return { 
            ...s, 
            isLive: isLive,
            tradeType: isLive ? "live trade" : "paper trade",
            ...(!isLive && { quantity: 0, selectedBroker: "" })
          };
        }
        return s;
      });
      
      setStrategies(updatedStrategies);
      localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
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
