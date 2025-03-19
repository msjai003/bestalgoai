
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
  
  // Add state to track already selected brokers
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([]);
  
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
        // If strategy is currently in paper mode and user wants to switch to live mode
        dialogState.setTargetStrategyId(id);
        dialogState.setTargetMode('live');
        dialogState.setShowConfirmationDialog(true);
      } else {
        // If strategy is currently in live mode and user wants to switch to paper mode
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
    
    if (dialogState.targetMode === 'live') {
      // Before opening quantity dialog, prepare the list of already selected brokers
      const strategy = strategies.find(s => s.id === dialogState.targetStrategyId);
      if (strategy && strategy.selectedBrokers) {
        const brokerIds = strategy.selectedBrokers.map(b => b.brokerId);
        const brokerNames = strategy.selectedBrokers.map(b => b.brokerName);
        setSelectedBrokers([...brokerIds, ...brokerNames]);
      } else {
        setSelectedBrokers([]);
      }
      
      // User is switching from paper to live mode
      dialogState.setShowQuantityDialog(true);
    } else {
      try {
        // Ensure we await the update to complete
        await updateLiveMode(dialogState.targetStrategyId, false);
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
      
      // Explicitly set trade_type to "live trade" for clarity
      console.log("Updating strategy in database for live trading:", {
        user_id: user.id,
        strategy_id: dialogState.targetStrategyId,
        quantity: dialogState.pendingQuantity,
        broker_name: brokerName,
        broker_id: brokerId,
        trade_type: "live trade"
      });
      
      // Direct update to add new broker to strategy
      const { error: updateError } = await supabase
        .from('strategy_selections')
        .insert({
          user_id: user.id,
          strategy_id: dialogState.targetStrategyId,
          strategy_name: strategy.name,
          strategy_description: strategy.description || "",
          quantity: dialogState.pendingQuantity,
          selected_broker: brokerName,
          broker_id: brokerId,
          trade_type: "live trade"
        });
        
      if (updateError) {
        console.error("Database update error:", updateError);
        throw updateError;
      }
      
      // Update local state after successful database update
      const updatedStrategies = strategies.map(s => {
        if (s.id === dialogState.targetStrategyId) {
          // Create a new selectedBrokers array or update the existing one
          const selectedBrokers = s.selectedBrokers || [];
          const newBroker = {
            brokerId: brokerId,
            brokerName: brokerName,
            quantity: dialogState.pendingQuantity
          };
          
          // Check if this broker already exists
          const brokerExists = selectedBrokers.some(
            b => b.brokerId === brokerId || b.brokerName === brokerName
          );
          
          const updatedBrokers = brokerExists 
            ? selectedBrokers.map(b => (b.brokerId === brokerId || b.brokerName === brokerName) 
                ? newBroker : b)
            : [...selectedBrokers, newBroker];
            
          return { 
            ...s, 
            isLive: true, 
            quantity: dialogState.pendingQuantity, 
            selectedBroker: brokerName, // Keep for backward compatibility
            selectedBrokers: updatedBrokers,
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
      
      // Reset selected brokers
      setSelectedBrokers([]);
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
    setSelectedBrokers([]);
  };
  
  const updateLiveMode = async (id: number, isLive: boolean) => {
    if (!user) return;
    
    try {
      const strategy = strategies.find(s => s.id === id);
      if (!strategy) return;
      
      if (!isLive) {
        // For paper trading, directly update the database
        console.log("Updating strategy to paper trading mode in database:", {
          user_id: user.id,
          strategy_id: id,
          trade_type: "paper trade",
          quantity: 0,
          selected_broker: ""
        });
        
        // First check if the record exists
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
        
        // If the record exists, update it; otherwise, insert it
        let updateResult;
        
        if (data) {
          console.log("Existing record found, updating to paper trade mode");
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
          // If no record exists, create one with paper trading defaults
          console.log("No existing record found, creating new record with paper trade mode");
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
      // Update for switching back to Live mode is handled in handleBrokerSubmit
      
      // Update the local state to reflect the changes
      const updatedStrategies = strategies.map(s => {
        if (s.id === id) {
          return { 
            ...s, 
            isLive,
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
      throw error; // Re-throw so caller can handle if needed
    }
  };

  return {
    ...filterState,
    strategies: filterState.filteredStrategies,
    ...dialogState,
    selectedBrokers, // Add selectedBrokers to return object
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
