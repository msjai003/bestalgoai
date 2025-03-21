
import React from "react";

interface StrategyTabNavigationProps {
  selectedTab: "predefined" | "custom";
  onTabChange: (tab: "predefined" | "custom") => void;
}

export const StrategyTabNavigation: React.FC<StrategyTabNavigationProps> = ({
  selectedTab,
  onTabChange
}) => {
  return (
    <div className="bg-gray-800/50 p-1 rounded-lg mb-3 shadow-sm border border-gray-700/30">
      <div className="grid grid-cols-2 gap-1">
        <button 
          className={`py-2 px-4 rounded-md text-sm font-medium text-center transition-colors ${
            selectedTab === "predefined" 
              ? "bg-primary/90 text-primary-foreground" 
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
          }`}
          onClick={() => onTabChange("predefined")}
        >
          Predefined Strategies
        </button>
        <button 
          className={`py-2 px-4 rounded-md text-sm font-medium text-center transition-colors ${
            selectedTab === "custom" 
              ? "bg-primary/90 text-primary-foreground" 
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
          }`}
          onClick={() => onTabChange("custom")}
        >
          Custom Strategy
        </button>
      </div>
    </div>
  );
};
