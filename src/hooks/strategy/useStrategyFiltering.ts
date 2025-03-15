
import { useState } from "react";
import { Strategy } from "./types";

export const useStrategyFiltering = (strategies: Strategy[]) => {
  const [timeFrame, setTimeFrame] = useState("1D");
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"all" | "live" | "paper">("all");

  const handleTradingToggle = () => {
    setIsActive(!isActive);
  };

  const handleModeChange = (mode: "all" | "live" | "paper") => {
    setSelectedMode(mode);
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
    setIsActive,
    selectedMode,
    setSelectedMode,
    filteredStrategies,
    handleTradingToggle,
    handleModeChange
  };
};
