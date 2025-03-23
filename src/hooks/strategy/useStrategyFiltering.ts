
import { useState, useMemo } from 'react';
import { Strategy } from './types';

type TradingModeFilter = "all" | "live" | "paper";

export const useStrategyFiltering = (strategies: Strategy[]) => {
  const [selectedMode, setSelectedMode] = useState<TradingModeFilter>("all");

  const handleModeChange = (mode: TradingModeFilter) => {
    setSelectedMode(mode);
  };

  // Using useMemo to compute filtered strategies
  const filteredStrategies = useMemo(() => {
    return strategies.filter(strategy => {
      if (selectedMode === "all") return true;
      if (selectedMode === "live") return strategy.isLive;
      if (selectedMode === "paper") return !strategy.isLive;
      return true;
    });
  }, [strategies, selectedMode]);

  return {
    selectedMode,
    handleModeChange,
    filteredStrategies
  };
};
