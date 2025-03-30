
import React from "react";
import { Strategy } from "@/hooks/strategy/types";
import { StrategyCard } from "./LiveTradingStrategyCard";

interface StrategyListProps {
  strategies: Strategy[];
  onToggleLiveMode: (id: number, uniqueId?: string, rowId?: string) => void;
  onEditQuantity: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const StrategyList: React.FC<StrategyListProps> = ({
  strategies,
  onToggleLiveMode,
  onEditQuantity,
  onViewDetails
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id || strategy.uniqueId || strategy.rowId}
          strategy={strategy}
          onToggleLiveMode={() => 
            onToggleLiveMode(
              strategy.id || 0, 
              strategy.uniqueId, 
              strategy.rowId
            )
          }
          onEditQuantity={() => onEditQuantity(strategy.id || 0)}
          onViewDetails={() => onViewDetails(strategy.id || 0)}
        />
      ))}
    </div>
  );
};
