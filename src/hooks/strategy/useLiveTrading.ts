
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
        
        // Store the uniqueId or rowId of the specific strategy instance to update
        if (strategy.uniqueId) {
          dialogState.setTargetUniqueId(strategy.uniqueId);
        }
        if (strategy.rowId) {
          dialogState.setTargetRowId(strategy.rowId);
        }
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
        // Only update specific strategy instance when switching to paper trading
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
        // If switching to paper trading mode
        console.log("Updating strategy to paper trading mode:", {
          uniqueId,
          rowId,
          strategy_id: id
        });
        
        if (rowId) {
          // Update only the specific row if we have a row ID
          console.log("Updating specific row with ID:", rowId);
          
          const { error: updateError } = await supabase
            .from('strategy_selections')
            .update({
              trade_type: "paper trade",
              quantity: 0,
              selected_broker: "",
              broker_username: ""
            })
            .eq('id', rowId);
            
          if (updateError) {
            console.error("Error updating specific strategy to paper mode:", updateError);
            throw updateError;
          }
        } else if (uniqueId) {
          // If we have a uniqueId (strategy_id-broker-username), use it to find the record
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
            
            // Try to narrow down by broker username if it exists
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
                trade_type: "paper trade",
                quantity: 0,
                selected_broker: "",
                broker_username: ""
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
          // Fallback to updating by user_id and strategy_id if no uniqueId or rowId
          // This is the case that would update all instances, so we avoid it when possible
          console.log("WARNING: Unable to identify specific strategy instance. Updating based on user_id and strategy_id only.");
          
          const { data, error: fetchError } = await supabase
            .from('strategy_selections')
            .select('id')
            .eq('user_id', user.id)
            .eq('strategy_id', id);
            
          if (fetchError) {
            console.error("Error fetching strategy records:", fetchError);
            throw fetchError;
          }
          
          if (data && data.length > 0) {
            // Just update the first one we find to avoid changing all brokers
            const firstRecordId = data[0].id;
            
            console.log(`Updating first record out of ${data.length} matches. ID:`, firstRecordId);
            
            const { error: updateError } = await supabase
              .from('strategy_selections')
              .update({
                trade_type: "paper trade",
                quantity: 0,
                selected_broker: "",
                broker_username: ""
              })
              .eq('id', firstRecordId);
              
            if (updateError) {
              console.error("Error updating strategy to paper mode:", updateError);
              throw updateError;
            }
          } else {
            console.log("No existing record found, creating new record with paper trade mode");
            const { error: insertError } = await supabase
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
              
            if (insertError) {
              console.error("Error inserting strategy with paper mode:", insertError);
              throw insertError;
            }
          }
        }
        
        toast({
          title: "Paper Trading Activated Successfully",
          description: `Strategy "${strategy.name}" is now in paper trading mode with simulated funds`,
          variant: "default"
        });
      }
      
      // Reload strategies from database to get fresh data
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
