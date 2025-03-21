
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TradingModeOption = "all" | "live" | "paper";

interface TradingModeFilterProps {
  selectedMode: TradingModeOption;
  onModeChange: (mode: TradingModeOption) => void;
}

export const TradingModeFilter = ({
  selectedMode,
  onModeChange,
}: TradingModeFilterProps) => {
  return (
    <div className="menu-frame inline-flex flex-wrap items-center gap-1.5 p-1 rounded-lg">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModeChange("all")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0 transition-all duration-300",
          selectedMode === "all"
            ? "bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-white shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModeChange("live")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0 transition-all duration-300",
          selectedMode === "live"
            ? "bg-gradient-to-r from-green-600/30 to-green-800/30 text-green-400 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        Live Trading
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModeChange("paper")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0 transition-all duration-300",
          selectedMode === "paper"
            ? "bg-gradient-to-r from-blue-600/30 to-blue-800/30 text-blue-400 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        Paper Trading
      </Button>
    </div>
  );
};
