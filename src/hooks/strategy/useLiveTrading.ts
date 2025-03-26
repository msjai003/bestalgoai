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
  const [isActive, setIsActive] = useState(false);
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

  const handleTradingToggle = () => {
    setIsActive(prev => !prev);
    toast({
      title: isActive ? "Trading Stopped" : "Trading Started",
      description: isActive ? "All positions have been squared off" : "Your strategies are now actively trading",
    });
  };

  const handleToggleLiveMode = (id: number, uniqueId?: string, rowId?: string) => {
    const strategy = strategies.find(s => s.id === id && 
      (s.uniqueId === uniqueId || (uniqueId === undefined && rowId === undefined)));
    
    if (strategy) {
      dialogState.setTargetStrategyId(id);
      if (uniqueId) {
        dialogState.setTargetUniqueId(uniqueId);
      }
      if (rowId) {
        dialogState.setTargetRowId(rowId);
      }
      
      if (!strategy.isLive) {
        dialogState.setTargetMode('live');
        dialogState.setShowConfirmationDialog(true);
      } else {
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
        if (user) {
          const { data: existingEntries, error: queryError } = await supabase
            .from('strategy_selections')
            .select('*')
            .eq('user_id', user.id)
            .eq('strategy_id', dialogState.targetStrategyId);
            
          if (queryError) throw queryError;
          
          if (!existingEntries || existingEntries.length === 0) {
            dialogState.setShowQuantityDialog(true);
          } else {
            dialogState.setShowQuantityDialog(true);
          }
        } else {
          dialogState.setShowQuantityDialog(true);
        }
      } else {
        const strategy = strategies.find(s => s.id === dialogState.targetStrategyId);
        if (strategy) {
          await updateLiveMode(
            dialogState.targetStrategyId, 
            false, 
            dialogState.targetUniqueId, 
            dialogState.targetRowId,
            strategy.name,
            strategy.description || ""
          );
          toast({
            title: "Success",
            description: "Strategy switched to paper trading mode",
          });
        }
        dialogState.resetDialogState();
      }
    } catch (error) {
      console.error("Error in confirmModeChange:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy mode",
        variant: "destructive"
      });
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
      
      const { data: brokerData, error: brokerError } = await supabase
        .from('broker_credentials')
        .select('username')
        .eq('id', brokerId)
        .single();
        
      if (brokerError) {
        console.error("Error fetching broker username:", brokerError);
        throw brokerError;
      }
      
      const brokerUsername = brokerData?.username || "";
      console.log("Found broker username:", brokerUsername);
      
      const strategy = strategies.find(s => s.id === dialogState.targetStrategyId);
      if (!strategy) throw new Error("Strategy not found");
      
      try {
        await updateStrategyLiveConfig(
          user.id,
          dialogState.targetStrategyId,
          dialogState.pendingQuantity,
          brokerName,
          brokerUsername,
          "live trade",
          strategy.name,
          strategy.description || ""
        );
        
        const loadedStrategies = await loadUserStrategies(user.id);
        setStrategies(loadedStrategies);
        
        toast({
          title: "Live Trading Enabled",
          description: `Strategy "${strategy.name}" is now trading live with ${brokerName}`,
        });
      } catch (error) {
        console.error("Error updating strategy configuration:", error);
        throw new Error("Failed to update strategy configuration");
      }
    } catch (error) {
      console.error("Error in handleBrokerSubmit:", error);
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
  
  const updateLiveMode = async (
    id: number, 
    isLive: boolean, 
    uniqueId?: string, 
    rowId?: string,
    strategyName: string = "",
    strategyDescription: string = ""
  ) => {
    if (!user) return;
    
    try {
      const strategy = strategies.find(s => s.id === id);
      if (!strategy) return;
      
      strategyName = strategyName || strategy.name;
      strategyDescription = strategyDescription || strategy.description || "";
      
      if (!isLive) {
        console.log("Updating specific strategy to paper trading mode:", {
          uniqueId,
          rowId,
          strategy_id: id
        });
        
        if (rowId) {
          console.log("Updating specific row with ID:", rowId);
          
          const { error: updateError } = await supabase
            .from('strategy_selections')
            .update({
              trade_type: "paper trade"
            })
            .eq('id', rowId);
            
          if (updateError) {
            console.error("Error updating specific strategy to paper mode:", updateError);
            throw updateError;
          }
        } else if (uniqueId) {
          const [strategyId, brokerName, brokerUsername] = uniqueId.split('-');
          
          console.log("Looking for record with:", {
            strategy_id: id,
            selected_broker: brokerName,
            broker_username: brokerUsername
          });
          
          const { data: matchingRows, error: fetchError } = await supabase
            .from('strategy_selections')
            .select('id')
            .eq('user_id', user.id)
            .eq('strategy_id', id)
            .eq('selected_broker', brokerName);
            
          if (fetchError) {
            console.error("Error fetching strategy by uniqueId:", fetchError);
            throw fetchError;
          }
          
          if (matchingRows && matchingRows.length > 0) {
            console.log(`Found ${matchingRows.length} matching rows by broker name`);
            
            let targetRowId = matchingRows[0].id;
            
            if (brokerUsername && matchingRows.length > 1) {
              const { data: exactMatches, error: exactMatchError } = await supabase
                .from('strategy_selections')
                .select('id')
                .eq('user_id', user.id)
                .eq('strategy_id', id)
                .eq('selected_broker', brokerName)
                .eq('broker_username', brokerUsername);
                
              if (exactMatchError) {
                console.error("Error finding exact match:", exactMatchError);
              } else if (exactMatches && exactMatches.length > 0) {
                targetRowId = exactMatches[0].id;
              }
            }
            
            console.log("Updating row with ID:", targetRowId);
            
            const { error: updateError } = await supabase
              .from('strategy_selections')
              .update({
                trade_type: "paper trade"
              })
              .eq('id', targetRowId);
              
            if (updateError) {
              console.error("Error updating strategy by uniqueId:", updateError);
              throw updateError;
            }
          } else {
            console.log("No matching records found for uniqueId:", uniqueId);
          }
        } else {
          console.log("No specific instance identifier provided. Finding first instance of strategy:", id);
          
          const { data, error: fetchError } = await supabase
            .from('strategy_selections')
            .select('id')
            .eq('user_id', user.id)
            .eq('strategy_id', id)
            .eq('trade_type', 'live trade')
            .limit(1);
            
          if (fetchError) {
            console.error("Error fetching strategy records:", fetchError);
            throw fetchError;
          }
          
          if (data && data.length > 0) {
            const recordId = data[0].id;
            
            console.log("Found record to update, ID:", recordId);
            
            const { error: updateError } = await supabase
              .from('strategy_selections')
              .update({
                trade_type: "paper trade"
              })
              .eq('id', recordId);
              
            if (updateError) {
              console.error("Error updating strategy to paper mode:", updateError);
              throw updateError;
            }
          } else {
            console.log("No existing record found for strategy:", id);
          }
        }
        
        toast({
          title: "Paper Trading Activated",
          description: `Strategy is now in paper trading mode`,
          variant: "default"
        });
      }
      
      const loadedStrategies = await loadUserStrategies(user.id);
      setStrategies(loadedStrategies);
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
    isActive,
    handleTradingToggle,
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
