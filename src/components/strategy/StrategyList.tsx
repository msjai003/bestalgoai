
import React from 'react';
import { Strategy } from "@/hooks/strategy/types";
import { StrategyCard } from "@/components/strategy/LiveTradingStrategyCard";

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
    <section className="space-y-4 mb-6">
      {strategies.map(strategy => (
        <StrategyCard 
          key={strategy.rowId || strategy.uniqueId || `strategy-${strategy.id}-${Date.now()}-${Math.random()}`}
          strategy={strategy}
          onToggleLiveMode={() => onToggleLiveMode(strategy.id, strategy.uniqueId, strategy.rowId)}
          onEditQuantity={() => onEditQuantity(strategy.id)}
          onViewDetails={() => onViewDetails(strategy.id)}
        />
      ))}
    </section>
  );
};
