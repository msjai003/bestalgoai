
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Strategy } from "./types";

export const useLiveTrading = () => {
  const [timeFrame, setTimeFrame] = useState("1D");
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"all" | "live" | "paper">("all");
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [targetStrategyId, setTargetStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);

  useEffect(() => {
    const storedStrategies = localStorage.getItem('wishlistedStrategies');
    if (storedStrategies) {
      try {
        const parsedStrategies = JSON.parse(storedStrategies);
        setStrategies(parsedStrategies);
      } catch (error) {
        console.error("Error parsing wishlisted strategies:", error);
        setStrategies([]);
      }
    }
  }, []);

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
    
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === targetStrategyId) {
        const newLiveStatus = targetMode === 'live';
        return { ...strategy, isLive: newLiveStatus };
      }
      return strategy;
    });
    
    setStrategies(updatedStrategies);
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    
    const strategy = strategies.find(s => s.id === targetStrategyId);
    if (strategy) {
      toast({
        title: targetMode === 'live' ? "Switched to live trading" : "Switched to paper trading",
        description: `Strategy "${strategy.name}" is now in ${targetMode} trading mode`,
      });
    }
    
    // If switching to live mode, open quantity dialog
    if (targetMode === 'live') {
      setShowQuantityDialog(true);
    } else {
      setShowConfirmationDialog(false);
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
    
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === targetStrategyId) {
        return { ...strategy, quantity };
      }
      return strategy;
    });
    
    setStrategies(updatedStrategies);
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    
    toast({
      title: "Quantity updated",
      description: `Trading quantity set to ${quantity}`,
    });
    
    setShowQuantityDialog(false);
    setShowConfirmationDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
  };

  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    setTargetStrategyId(null);
    // If we were switching to live mode but canceled quantity, revert back to paper
    if (targetMode === 'live') {
      const updatedStrategies = strategies.map(strategy => {
        if (strategy.id === targetStrategyId) {
          return { ...strategy, isLive: false };
        }
        return strategy;
      });
      setStrategies(updatedStrategies);
      localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    }
    setTargetMode(null);
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
    navigate
  };
};
