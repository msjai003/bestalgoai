
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
    <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-gray-800/50 rounded-md border border-gray-700/30 shadow-sm">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModeChange("all")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0",
          selectedMode === "all"
            ? "bg-gray-700 text-white shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModeChange("live")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0",
          selectedMode === "live"
            ? "bg-green-900/50 text-green-400 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        Live Trading
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModeChange("paper")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0",
          selectedMode === "paper"
            ? "bg-blue-900/50 text-blue-400 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        Paper Trading
      </Button>
    </div>
  );
};
