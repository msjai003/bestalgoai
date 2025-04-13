
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TradingModeFilterProps {
  selectedMode: "all" | "live" | "paper";
  onModeChange: (mode: "all" | "live" | "paper") => void;
}

export const TradingModeFilter: React.FC<TradingModeFilterProps> = ({
  selectedMode,
  onModeChange
}) => {
  return (
    <div className="bg-charcoalSecondary rounded-lg p-1.5 flex shadow-lg border border-gray-800/30">
      <Button
        variant="ghost"
        onClick={() => onModeChange("all")}
        className={cn(
          "flex-1 rounded-md text-sm font-medium transition-all",
          selectedMode === "all" 
            ? "bg-cyan text-charcoalPrimary shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        All
      </Button>
      <Button
        variant="ghost"
        onClick={() => onModeChange("live")}
        className={cn(
          "flex-1 rounded-md text-sm font-medium transition-all mx-1",
          selectedMode === "live" 
            ? "bg-emerald-500 text-charcoalPrimary shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        Live
      </Button>
      <Button
        variant="ghost"
        onClick={() => onModeChange("paper")}
        className={cn(
          "flex-1 rounded-md text-sm font-medium transition-all",
          selectedMode === "paper" 
            ? "bg-cyan text-charcoalPrimary shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        Paper
      </Button>
    </div>
  );
};
