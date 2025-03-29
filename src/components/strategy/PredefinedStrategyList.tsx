
import React from "react";
import { Strategy } from "@/hooks/strategy/types";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { Loader } from "lucide-react";

interface PredefinedStrategyListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  user: any;
}

export const PredefinedStrategyList: React.FC<PredefinedStrategyListProps> = ({
  strategies,
  isLoading,
  onToggleWishlist,
  onToggleLiveMode,
  user
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader className="animate-spin text-cyan h-8 w-8" />
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="text-center p-8 border border-gray-700 rounded-lg bg-charcoalSecondary">
        <p className="text-gray-400">No strategies available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 pb-4">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onToggleWishlist={onToggleWishlist}
          onToggleLiveMode={onToggleLiveMode}
          isAuthenticated={!!user}
          hasPremium={false} // This should be determined by user's subscription status
        />
      ))}
    </div>
  );
};
