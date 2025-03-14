
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
    <div className="bg-gray-800/50 p-1 rounded-xl mb-3">
      <div className="grid grid-cols-2 gap-1">
        <button 
          className={`py-2 px-4 rounded-lg text-sm font-medium text-center ${
            selectedTab === "predefined" 
              ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white" 
              : "text-gray-400"
          }`}
          onClick={() => onTabChange("predefined")}
        >
          Predefined Strategies
        </button>
        <button 
          className={`py-2 px-4 rounded-lg text-sm font-medium text-center ${
            selectedTab === "custom" 
              ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white" 
              : "text-gray-400"
          }`}
          onClick={() => onTabChange("custom")}
        >
          Custom Strategy
        </button>
      </div>
    </div>
  );
};
