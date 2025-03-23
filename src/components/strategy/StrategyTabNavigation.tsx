
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StrategyTabNavigationProps {
  selectedTab: "predefined" | "custom";
  onTabChange: (tab: "predefined" | "custom") => void;
}

export const StrategyTabNavigation: React.FC<StrategyTabNavigationProps> = ({
  selectedTab,
  onTabChange
}) => {
  return (
    <div className="bg-charcoalSecondary/50 p-1 rounded-xl mb-3">
      <div className="grid grid-cols-2 gap-1">
        <Button 
          variant={selectedTab === "predefined" ? "cyan" : "ghost"}
          className={cn(
            "py-2 px-4 rounded-lg text-sm font-medium text-center",
            selectedTab !== "predefined" && "text-gray-400"
          )}
          onClick={() => onTabChange("predefined")}
        >
          Predefined Strategies
        </Button>
        <Button 
          variant={selectedTab === "custom" ? "cyan" : "ghost"}
          className={cn(
            "py-2 px-4 rounded-lg text-sm font-medium text-center",
            selectedTab !== "custom" && "text-gray-400"
          )}
          onClick={() => onTabChange("custom")}
        >
          Custom Strategy
        </Button>
      </div>
    </div>
  );
};
