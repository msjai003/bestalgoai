
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Strategy } from "@/hooks/strategy/types";
import { NoStrategiesFound } from "./NoStrategiesFound";
import { StrategyCard } from "./StrategyCard";
import { StrategyStatusBadge } from "./StrategyStatusBadge";
import { StrategyActionButtons } from "./StrategyActionButtons";

interface PredefinedStrategyListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  onShowPaymentDialog?: (strategy: Strategy) => void;
  user: any | null;
}

export const PredefinedStrategyList: React.FC<PredefinedStrategyListProps> = ({
  strategies,
  isLoading,
  onToggleWishlist,
  onToggleLiveMode,
  onShowPaymentDialog,
  user
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-6 w-1/2 bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-gray-700/50 mb-3" />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Skeleton className="h-12 w-full bg-gray-700/30" />
                  <Skeleton className="h-12 w-full bg-gray-700/30" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                  </div>
                  <Skeleton className="h-8 w-24 bg-gray-700/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!strategies.length) {
    return <NoStrategiesFound />;
  }

  return (
    <div className="space-y-4">
      {strategies.map((strategy) => {
        // Check if strategy is free or paid (unlocked)
        const isFreeOrPaid = strategy.paidStatus === 'free' || strategy.paidStatus === 'paid';
        
        return (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            actionButtons={
              <StrategyActionButtons
                isWishlisted={strategy.isWishlisted}
                isLive={strategy.isLive}
                isFreeOrPaid={isFreeOrPaid}
                isAuthenticated={!!user}
                onToggleWishlist={() => onToggleWishlist(strategy.id, !strategy.isWishlisted)}
                onLiveModeClick={() => onToggleLiveMode(strategy.id)}
                onShowPaymentDialog={
                  !isFreeOrPaid && onShowPaymentDialog 
                    ? () => onShowPaymentDialog(strategy)
                    : undefined
                }
              />
            }
          />
        );
      })}
    </div>
  );
};
