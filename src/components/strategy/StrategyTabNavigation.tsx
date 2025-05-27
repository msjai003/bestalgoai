
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface StrategyTabNavigationProps {
  selectedTab: "predefined" | "custom";
  onTabChange: (tab: "predefined" | "custom") => void;
}

export const StrategyTabNavigation: React.FC<StrategyTabNavigationProps> = ({
  selectedTab,
  onTabChange
}) => {
  // Always ensure predefined is selected since we're hiding the custom tab
  React.useEffect(() => {
    if (selectedTab !== "predefined") {
      onTabChange("predefined");
    }
  }, [selectedTab, onTabChange]);

  return (
    <div className="bg-gradient-to-r from-charcoalSecondary to-charcoalSecondary/70 p-1.5 rounded-xl mb-4 shadow-lg border border-gray-700/30">
      <div className="grid grid-cols-1 gap-2">
        <Button 
          variant="cyan"
          className={cn(
            "py-2 rounded-xl text-xs font-medium transition-all duration-300 shadow-md shadow-cyan/20"
          )}
          size="sm"
        >
          <Zap className="h-3 w-3 mr-1.5" />
          Predefined Strategies
        </Button>
      </div>
    </div>
  );
};
