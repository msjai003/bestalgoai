
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
    <div className="menu-frame inline-flex flex-wrap items-center gap-1.5 p-1 rounded-lg">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("all")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0 transition-all duration-300",
          selectedFilter === "all"
            ? "bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-white shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("intraday")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0 transition-all duration-300",
          selectedFilter === "intraday"
            ? "bg-gradient-to-r from-blue-600/30 to-blue-800/30 text-blue-400 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        Intraday
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("btst")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0 transition-all duration-300",
          selectedFilter === "btst"
            ? "bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-purple-400 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        BTST
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("positional")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0 transition-all duration-300",
          selectedFilter === "positional"
            ? "bg-gradient-to-r from-green-600/30 to-green-800/30 text-green-400 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        Positional
      </Button>
    </div>
  );
};
