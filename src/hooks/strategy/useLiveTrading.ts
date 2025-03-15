
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useLiveTrading = () => {
  const [timeFrame, setTimeFrame] = useState("1D");
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"all" | "live" | "paper">("all");
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Dialog states
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);
  const [targetStrategyId, setTargetStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState<number>(0);

  useEffect(() => {
    const loadStrategies = async () => {
      // First try to get from localStorage for immediate display
      const storedStrategies = localStorage.getItem('wishlistedStrategies');
      if (storedStrategies) {
        try {
          const parsedStrategies = JSON.parse(storedStrategies);
          setStrategies(parsedStrategies);
        } catch (error) {
          console.error("Error parsing wishlisted strategies:", error);
        }
      }
      
      // If user is logged in, fetch strategies from database
      if (user) {
        try {
          const { data, error } = await supabase
            .from('strategy_selections')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Map database data to Strategy type
            const dbStrategies: Strategy[] = data.map(item => ({
              id: item.strategy_id,
              name: item.strategy_name,
              description: item.strategy_description || "",
              isWishlisted: true,
              isLive: Boolean(item.quantity > 0 && item.selected_broker),
              quantity: item.quantity || 0,
              selectedBroker: item.selected_broker || "",
              performance: {
                winRate: "N/A",
                avgProfit: "N/A",
                drawdown: "N/A"
              }
            }));
            
            setStrategies(dbStrategies);
            localStorage.setItem('wishlistedStrategies', JSON.stringify(dbStrategies));
          }
        } catch (error) {
          console.error("Error fetching strategies from database:", error);
        }
      }
    };
    
    loadStrategies();
  }, [user]);

  const handleTradingToggle = () => {
    setIsActive(!isActive);
    
    toast({
      title: !isActive ? "Trading started" : "Trading stopped",
      description: !isActive ? "Your strategies are now actively trading" : "Your strategies are now paused",
    });
  };

  const handleModeChange = (mode: "all" | "live" | "paper") => {
    setSelectedMode(mode);
  };

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      setTargetStrategyId(id);
      setTargetMode(strategy.isLive ? 'paper' : 'live');
      setShowConfirmationDialog(true);
    }
  };

  const handleOpenQuantityDialog = (id: number) => {
    setTargetStrategyId(id);
    setShowQuantityDialog(true);
  };

  const confirmModeChange = () => {
    if (targetStrategyId === null || targetMode === null) return;
    
    setShowConfirmationDialog(false);
    
    // If switching to live mode, open quantity dialog
    if (targetMode === 'live') {
      setShowQuantityDialog(true);
    } else {
      // Switching to paper mode
      updateLiveMode(targetStrategyId, false);
      setTargetStrategyId(null);
      setTargetMode(null);
    }
  };

  const cancelModeChange = () => {
    setShowConfirmationDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
  };

  const handleQuantitySubmit = (quantity: number) => {
    if (targetStrategyId === null) return;
    
    setPendingQuantity(quantity);
    setShowQuantityDialog(false);
    setShowBrokerDialog(true);
  };

  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
  };
  
  const handleBrokerSubmit = async (brokerId: string) => {
    if (targetStrategyId === null || !user) return;
    
    try {
      // Get broker name for display
      const { data: brokerData, error: brokerError } = await supabase
        .from('broker_credentials')
        .select('broker_name')
        .eq('id', brokerId)
        .single();
        
      if (brokerError) {
        console.error('Error fetching broker name:', brokerError);
        throw brokerError;
      }
      
      const brokerName = brokerData?.broker_name || "Unknown Broker";
      console.log("Selected broker:", brokerName);
      
      // Update strategy in database
      const strategy = strategies.find(s => s.id === targetStrategyId);
      if (!strategy) throw new Error("Strategy not found");
      
      const { error } = await supabase
        .from('strategy_selections')
        .upsert({
          user_id: user.id,
          strategy_id: targetStrategyId,
          strategy_name: strategy.name,
          strategy_description: strategy.description,
          quantity: pendingQuantity,
          selected_broker: brokerId
        });
        
      if (error) throw error;
      
      // Update local state
      const updatedStrategies = strategies.map(s => {
        if (s.id === targetStrategyId) {
          return { 
            ...s, 
            isLive: true, 
            quantity: pendingQuantity, 
            selectedBroker: brokerName 
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
      setShowBrokerDialog(false);
      setTargetStrategyId(null);
      setTargetMode(null);
      setPendingQuantity(0);
    }
  };
  
  const handleCancelBroker = () => {
    setShowBrokerDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
    setPendingQuantity(0);
  };
  
  const updateLiveMode = async (id: number, isLive: boolean) => {
    if (!user) return;
    
    try {
      const strategy = strategies.find(s => s.id === id);
      if (!strategy) return;
      
      if (!isLive) {
        // Update database
        const { error } = await supabase
          .from('strategy_selections')
          .update({ 
            quantity: 0,
            selected_broker: null 
          })
          .eq('user_id', user.id)
          .eq('strategy_id', id);
          
        if (error) throw error;
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

  const filteredStrategies = selectedMode === "all" 
    ? strategies 
    : strategies.filter(strategy => 
        (selectedMode === "live" && strategy.isLive) || 
        (selectedMode === "paper" && !strategy.isLive)
      );

  return {
    timeFrame,
    setTimeFrame,
    isActive,
    selectedMode,
    strategies: filteredStrategies,
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog,
    setShowBrokerDialog,
    targetStrategyId,
    targetMode,
    handleTradingToggle,
    handleModeChange,
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
