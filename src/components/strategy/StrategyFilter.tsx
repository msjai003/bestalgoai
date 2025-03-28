
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
    <div className="inline-flex items-center gap-1.5 p-1 bg-charcoalSecondary/30 rounded-lg border border-gray-700/50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("all")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0",
          selectedFilter === "all"
            ? "bg-charcoalSecondary text-white shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-charcoalSecondary/50"
        )}
      >
        All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("intraday")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0",
          selectedFilter === "intraday"
            ? "bg-cyan/20 text-cyan shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-charcoalSecondary/50"
        )}
      >
        Intraday
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("btst")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0",
          selectedFilter === "btst"
            ? "bg-cyan/30 text-cyan shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-charcoalSecondary/50"
        )}
      >
        BTST
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange("positional")}
        className={cn(
          "h-8 px-4 py-0 text-sm font-medium rounded-md border-0",
          selectedFilter === "positional"
            ? "bg-charcoalSuccess/20 text-charcoalSuccess shadow-sm"
            : "bg-transparent text-gray-400 hover:text-white hover:bg-charcoalSecondary/50"
        )}
      >
        Positional
      </Button>
    </div>
  );
};
