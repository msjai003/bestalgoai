
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
        dialogState.setShowQuantityDialog(true);
      } else {
        await updateLiveMode(
          dialogState.targetStrategyId, 
          false, 
          dialogState.targetUniqueId, 
          dialogState.targetRowId
        );
        toast({
          title: "Success",
          description: "Strategy switched to paper trading mode",
        });
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
      
      // First check if there's an existing record for this strategy + broker combination
      const { data: existingRecords, error: searchError } = await supabase
        .from('strategy_selections')
        .select('id')
        .eq('user_id', user.id)
        .eq('strategy_id', dialogState.targetStrategyId)
        .eq('selected_broker', brokerName)
        .eq('broker_username', brokerUsername);
        
      if (searchError) {
        console.error("Error searching for existing strategy records:", searchError);
        throw searchError;
      }
      
      if (existingRecords && existingRecords.length > 0) {
        // Update existing record instead of creating a new one
        console.log("Found existing record, updating to live trading mode:", existingRecords[0].id);
        
        const { error: updateError } = await supabase
          .from('strategy_selections')
          .update({
            quantity: dialogState.pendingQuantity,
            trade_type: "live trade"
          })
          .eq('id', existingRecords[0].id);
          
        if (updateError) {
          console.error("Error updating existing strategy to live mode:", updateError);
          throw updateError;
        }
      } else {
        // Create a new record only if one doesn't exist yet
        console.log("Creating new strategy selection for live trading:", {
          user_id: user.id,
          strategy_id: dialogState.targetStrategyId,
          quantity: dialogState.pendingQuantity,
          broker_name: brokerName,
          broker_username: brokerUsername,
          trade_type: "live trade"
        });
        
        const { error: insertError } = await supabase
          .from('strategy_selections')
          .insert({
            user_id: user.id,
            strategy_id: dialogState.targetStrategyId,
            strategy_name: strategy.name,
            strategy_description: strategy.description || "",
            quantity: dialogState.pendingQuantity,
            selected_broker: brokerName,
            broker_username: brokerUsername,
            trade_type: "live trade"
          });
            
        if (insertError) {
          console.error("Database insert error:", insertError);
          throw insertError;
        }
      }
      
      const loadedStrategies = await loadUserStrategies(user.id);
      setStrategies(loadedStrategies);
      
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
  
  const updateLiveMode = async (
    id: number, 
    isLive: boolean, 
    uniqueId?: string, 
    rowId?: string
  ) => {
    if (!user) return;
    
    try {
      const strategy = strategies.find(s => s.id === id);
      if (!strategy) return;
      
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
