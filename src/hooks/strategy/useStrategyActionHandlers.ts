
import { useToast } from "@/hooks/use-toast";
import { Strategy } from "./types";

export const useStrategyActionHandlers = (
  isActive: boolean,
  toggleTradingActive: () => void
) => {
  const { toast } = useToast();

  const handleTradingToggle = () => {
    toggleTradingActive();
    toast({
      title: !isActive ? "Trading Activated" : "Trading Deactivated",
      description: !isActive 
        ? "Your strategies are now live and will execute trades based on your settings." 
        : "Trading has been paused. No new trades will be executed.",
      duration: 3000,
    });
  };
  
  const handleToggleLiveMode = (
    id: number, 
    uniqueId: string | undefined, 
    rowId: string | undefined, 
    broker: string | undefined,
    strategies: Strategy[],
    setCurrentStrategyId: (id: number | null) => void,
    setCurrentBroker: (broker: string | null) => void,
    setCurrentCustomId: (id: string | null) => void,
    setTargetMode: (mode: "live" | "paper" | null) => void,
    setShowConfirmationDialog: (show: boolean) => void
  ) => {
    // Find the specific strategy based on these identifiers
    const strategy = strategies.find(s => {
      if (s.id === id) {
        // For predefined strategies, also check the broker if provided
        if (broker && s.selectedBroker) {
          return s.selectedBroker === broker;
        }
        // If no broker is provided, or the strategy doesn't have a broker, match by id
        return true;
      }
      // Also check uniqueId or rowId for custom strategies
      return (uniqueId && s.uniqueId === uniqueId) || (rowId && s.rowId === rowId);
    });
    
    if (!strategy) {
      console.error("Strategy not found:", id, uniqueId, rowId, broker);
      return;
    }
    
    setCurrentStrategyId(typeof id === 'number' ? id : parseInt(id as string, 10));
    setCurrentBroker(broker || strategy.selectedBroker || null);
    
    if (strategy.isCustom && rowId) {
      setCurrentCustomId(rowId);
    } else {
      setCurrentCustomId(null);
    }
    
    // Always toggle the current state for the specific broker
    // If it's currently live, set target to paper, and vice versa
    setTargetMode(strategy.isLive ? "paper" : "live");
    setShowConfirmationDialog(true);
  };
  
  const handleOpenQuantityDialog = (
    id: number,
    setCurrentStrategyId: (id: number | null) => void,
    setShowQuantityDialog: (show: boolean) => void
  ) => {
    setCurrentStrategyId(id);
    setShowQuantityDialog(true);
  };

  return {
    handleTradingToggle,
    handleToggleLiveMode,
    handleOpenQuantityDialog
  };
};
