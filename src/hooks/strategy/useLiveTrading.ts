
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

export const useLiveTrading = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use our custom hooks
  const dialogState = useStrategyDialogs();
  const filterState = useStrategyFiltering(strategies);
  
  // Load strategies on component mount
  useEffect(() => {
    const fetchStrategies = async () => {
      if (user) {
        const loadedStrategies = await loadUserStrategies(user.id);
        setStrategies(loadedStrategies);
      }
    };
    
    fetchStrategies();
  }, [user]);

  // Handler functions for strategy actions
  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      dialogState.setTargetStrategyId(id);
      dialogState.setTargetMode(strategy.isLive ? 'paper' : 'live');
      dialogState.setShowConfirmationDialog(true);
    }
  };

  const handleOpenQuantityDialog = (id: number) => {
    dialogState.setTargetStrategyId(id);
    dialogState.setShowQuantityDialog(true);
  };

  const confirmModeChange = () => {
    if (dialogState.targetStrategyId === null || dialogState.targetMode === null) return;
    
    dialogState.setShowConfirmationDialog(false);
    
    // If switching to live mode, open quantity dialog
    if (dialogState.targetMode === 'live') {
      dialogState.setShowQuantityDialog(true);
    } else {
      // Switching to paper mode
      updateLiveMode(dialogState.targetStrategyId, false);
      dialogState.resetDialogState();
    }
  };

  const cancelModeChange = () => {
    dialogState.resetDialogState();
  };

  const handleQuantitySubmit = (quantity: number) => {
    if (dialogState.targetStrategyId === null) return;
    
    // Use the helper method from useStrategyDialogs to transition from quantity to broker dialog
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
      
      // Update strategy in database - now pass the brokerName directly
      const strategy = strategies.find(s => s.id === dialogState.targetStrategyId);
      if (!strategy) throw new Error("Strategy not found");
      
      console.log("Updating strategy in database:", {
        user_id: user.id,
        strategy_id: dialogState.targetStrategyId,
        quantity: dialogState.pendingQuantity,
        broker_name: brokerName
      });
      
      // Pass brokerName directly to the broker name parameter instead of brokerId
      await updateStrategyLiveConfig(
        user.id,
        dialogState.targetStrategyId,
        strategy.name,
        strategy.description,
        dialogState.pendingQuantity,
        brokerName // Use broker name directly instead of ID
      );
      
      // Update local state
      const updatedStrategies = strategies.map(s => {
        if (s.id === dialogState.targetStrategyId) {
          return { 
            ...s, 
            isLive: true, 
            quantity: dialogState.pendingQuantity, 
            selectedBroker: brokerName // Use broker name directly
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
        // Update database
        await updateStrategyLiveConfig(
          user.id,
          id,
          strategy.name,
          strategy.description,
          0,
          null
        );
      }
      
      // Update local state
      const updatedStrategies = strategies.map(s => {
        if (s.id === id) {
          return { 
            ...s, 
            isLive,
            ...(!isLive && { quantity: 0, selectedBroker: "" })
          };
        }
        return s;
      });
      
      setStrategies(updatedStrategies);
      localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
      
      toast({
        title: isLive ? "Strategy set to live mode" : "Strategy set to paper mode",
        description: `Strategy is now in ${isLive ? 'live' : 'paper'} trading mode`,
      });
    } catch (error) {
      console.error("Error updating strategy mode:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy mode",
        variant: "destructive"
      });
    }
  };

  return {
    // Combine states and methods from both hooks
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
