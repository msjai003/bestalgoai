
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterOption = "all" | "intraday" | "btst" | "positional";

interface StrategyFilterProps {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export const StrategyFilter = ({
  selectedFilter,
  onFilterChange,
}: StrategyFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("all")}
        className={cn(
          "text-sm font-medium border-gray-700 bg-gray-800/50",
          selectedFilter === "all"
            ? "bg-gray-700 text-white border-gray-600"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("intraday")}
        className={cn(
          "text-sm font-medium border-gray-700 bg-gray-800/50",
          selectedFilter === "intraday"
            ? "bg-blue-900/50 text-blue-400 border-blue-800"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        Intraday
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("btst")}
        className={cn(
          "text-sm font-medium border-gray-700 bg-gray-800/50",
          selectedFilter === "btst"
            ? "bg-purple-900/50 text-purple-400 border-purple-800"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        BTST
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("positional")}
        className={cn(
          "text-sm font-medium border-gray-700 bg-gray-800/50",
          selectedFilter === "positional"
            ? "bg-green-900/50 text-green-400 border-green-800"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        )}
      >
        Positional
      </Button>
    </div>
  );
};
