
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Code, Zap } from "lucide-react";

interface StrategyTabNavigationProps {
  selectedTab: "predefined" | "custom";
  onTabChange: (tab: "predefined" | "custom") => void;
}

export const StrategyTabNavigation: React.FC<StrategyTabNavigationProps> = ({
  selectedTab,
  onTabChange
}) => {
  return (
    <div className="bg-gradient-to-r from-charcoalSecondary to-charcoalSecondary/70 p-1.5 rounded-xl mb-4 shadow-lg border border-gray-700/30">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant={selectedTab === "predefined" ? "gradient" : "ghost"}
          className={cn(
            "py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300",
            selectedTab === "predefined" 
              ? "shadow-md shadow-cyan/20" 
              : "text-gray-400 hover:text-white hover:bg-charcoalSecondary/90"
          )}
          onClick={() => onTabChange("predefined")}
        >
          <Zap className="h-4 w-4 mr-2" />
          Predefined Strategies
        </Button>
        <Button 
          variant={selectedTab === "custom" ? "gradient" : "ghost"}
          className={cn(
            "py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300",
            selectedTab === "custom" 
              ? "shadow-md shadow-cyan/20" 
              : "text-gray-400 hover:text-white hover:bg-charcoalSecondary/90"
          )}
          onClick={() => onTabChange("custom")}
        >
          <Code className="h-4 w-4 mr-2" />
          Custom Strategy
        </Button>
      </div>
    </div>
  );
};
