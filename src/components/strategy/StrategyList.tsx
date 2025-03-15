
import React from 'react';
import { Strategy } from "@/hooks/strategy/types";
import { StrategyCard } from "@/components/strategy/LiveTradingStrategyCard";

interface StrategyListProps {
  strategies: Strategy[];
  onEditQuantity: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const StrategyList: React.FC<StrategyListProps> = ({
  strategies,
  onEditQuantity,
  onViewDetails
}) => {
  return (
    <section className="space-y-4 mb-6">
      {strategies.map(strategy => (
        <StrategyCard 
          key={strategy.id}
          strategy={strategy}
          onEditQuantity={() => onEditQuantity(strategy.id)}
          onViewDetails={() => onViewDetails(strategy.id)}
        />
      ))}
    </section>
  );
};
