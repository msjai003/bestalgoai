
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { updateStrategyLiveConfig, updateStrategyTradeType } from "./useStrategyDatabase";
import { useToast } from "@/hooks/use-toast";
import { Strategy } from "./types";

export const useStrategyDialogHandlers = (
  strategies: Strategy[],
  setStrategies: React.Dispatch<React.SetStateAction<Strategy[]>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const confirmModeChange = async (
    currentStrategyId: number | null,
    currentCustomId: string | null,
    targetMode: "live" | "paper" | null,
    currentBroker: string | null
  ) => {
    if (!user || (currentStrategyId === null && currentCustomId === null) || targetMode === null) return;
    
    try {
      if (currentCustomId) {
        // Update custom strategy in custom_strategies table
        const { error } = await supabase
          .from('custom_strategies')
          .update({
            trade_type: targetMode === "live" ? "live trade" : "paper trade"
          })
          .eq('id', currentCustomId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else if (currentStrategyId !== null && currentBroker) {
        // For predefined strategies, update the specific broker's record
        await updateStrategyTradeType(
          user.id,
          currentStrategyId,
          targetMode === "live" ? "live trade" : "paper trade",
          currentBroker
        );
      }
      
      // Update local state - but only for the specific broker-strategy combination
      setStrategies(prev => 
        prev.map(strategy => {
          // Match by strategy ID and broker name (if applicable)
          if (strategy.id === currentStrategyId) {
            // For predefined strategies with brokers, make sure we only update the correct broker record
            if (strategy.selectedBroker && currentBroker) {
              if (strategy.selectedBroker === currentBroker) {
                return { ...strategy, isLive: targetMode === "live" };
              }
              // Different broker for same strategy ID, don't update
              return strategy;
            }
            // No broker specificity, update based on ID
            return { ...strategy, isLive: targetMode === "live" };
          } else if (strategy.rowId === currentCustomId) {
            // Custom strategy match by rowId
            return { ...strategy, isLive: targetMode === "live" };
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
  };

  const handleQuantitySubmit = async (
    quantity: number, 
    currentStrategyId: number | null
  ) => {
    if (!user || currentStrategyId === null) return;
    
    try {
      const strategy = strategies.find(s => s.id === currentStrategyId);
      
      if (strategy?.isCustom && strategy.rowId) {
        // Update custom strategy quantity
        const { error } = await supabase
          .from('custom_strategies')
          .update({ quantity })
          .eq('id', strategy.rowId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Update predefined strategy quantity
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          quantity,
          strategy?.selectedBroker || "",
          strategy?.brokerUsername || "",
          strategy?.isLive ? "live trade" : "paper trade"
        );
      }
      
      // Update local state
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
  };

  const handleBrokerSubmit = async (
    broker: string, 
    username: string, 
    currentStrategyId: number | null
  ) => {
    if (!user || currentStrategyId === null) return;
    
    try {
      const strategy = strategies.find(s => s.id === currentStrategyId);
      
      if (strategy?.isCustom && strategy.rowId) {
        // Update custom strategy broker info
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
        // Update predefined strategy broker info
        await updateStrategyLiveConfig(
          user.id,
          currentStrategyId,
          strategy?.quantity || 0,
          broker,
          username,
          strategy?.isLive ? "live trade" : "paper trade"
        );
      }
      
      // Update local state
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
  };

  return {
    confirmModeChange,
    handleQuantitySubmit,
    handleBrokerSubmit
  };
};
