
import React from "react";
import { StrategyCard } from "./StrategyCard";
import { UserData } from "@/types/user";
import { Strategy } from "@/hooks/strategy/types";

interface PredefinedStrategyListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  user: UserData | null;
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
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!strategies.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No strategies available at the moment
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {strategies.map((strategy, index) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onToggleWishlist={onToggleWishlist}
          onToggleLiveMode={onToggleLiveMode}
          isAuthenticated={!!user}
          index={index} // Pass the index to identify the first (free) strategy
        />
      ))}
    </div>
  );
};
