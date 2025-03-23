
import { useState } from 'react';
import { Strategy } from './types';

type TradingModeFilter = "all" | "live" | "paper";

export const useStrategyFiltering = (strategies: Strategy[]) => {
  const [selectedMode, setSelectedMode] = useState<TradingModeFilter>("all");

  const handleModeChange = (mode: TradingModeFilter) => {
    setSelectedMode(mode);
  };

  // Change this from a function to a computed value
  const filteredStrategies = strategies.filter(strategy => {
    if (selectedMode === "all") return true;
    if (selectedMode === "live") return strategy.isLive;
    if (selectedMode === "paper") return !strategy.isLive;
    return true;
  });

  return {
    selectedMode,
    handleModeChange,
    filteredStrategies
  };
};
