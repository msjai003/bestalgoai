
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Strategy } from "@/hooks/strategy/types";
import { StrategyStatusBadge } from "./StrategyStatusBadge";
import { StrategyPerformanceBadges } from "./StrategyPerformanceBadges";
import { StrategyActionButtons } from "./StrategyActionButtons";
import { StrategyLiveStatus } from "./StrategyLiveStatus";
import { StrategyPaymentDialog } from "./StrategyPaymentDialog";

interface StrategyCardProps {
  strategy: Strategy;
  onToggleWishlist: () => void;
  onToggleLiveMode: () => void;
  onShowPaymentDialog?: () => void;
  isAuthenticated: boolean;
  index: number;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggleWishlist,
  onToggleLiveMode,
  onShowPaymentDialog,
  isAuthenticated,
  index
}) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  // Determine if the strategy is paid or free based on the paidStatus field
  const isPaid = strategy.paidStatus === "paid";
  const isPremium = index !== 0; // First strategy is free, others are premium

  // Debug logging to understand strategy state
  useEffect(() => {
    console.log("StrategyCard:", {
      id: strategy.id,
      name: strategy.name,
      isPremium,
      isPaid,
      paidStatus: strategy.paidStatus
    });
  }, [strategy, isPremium, isPaid]);

  const handleLiveModeClick = () => {
    if (!isAuthenticated) return;
    
    if (strategy.isLive) {
      // If already live, just toggle it off
      onToggleLiveMode();
    } else if (index === 0 || isPaid) {
      // First strategy (free) or already paid strategies can be enabled directly
      onToggleLiveMode();
    } else {
      // Premium strategies need payment first
      if (onShowPaymentDialog) {
        onShowPaymentDialog();
      }
    }
  };

  return (
    <>
      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {strategy.name}
                  <StrategyStatusBadge 
                    isPremium={isPremium} 
                    isPaid={isPaid} 
                  />
                </h3>
                <StrategyPerformanceBadges performance={strategy.performance} />
              </div>
              
              <StrategyActionButtons 
                isWishlisted={strategy.isWishlisted}
                isLive={strategy.isLive}
                isPremium={isPremium}
                isPaid={isPaid}
                isAuthenticated={isAuthenticated}
                onToggleWishlist={onToggleWishlist}
                onLiveModeClick={handleLiveModeClick}
                onShowPaymentDialog={onShowPaymentDialog}
                paidStatus={strategy.paidStatus}
                strategyName={strategy.name}
              />
            </div>
            
            <p className="text-gray-300 text-sm mb-3">
              {strategy.description}
            </p>
            
            <StrategyLiveStatus strategy={strategy} />
          </div>
        </CardContent>
      </Card>

      {showPaymentDialog && (
        <StrategyPaymentDialog 
          open={showPaymentDialog} 
          onOpenChange={setShowPaymentDialog} 
          strategy={strategy} 
        />
      )}
    </>
  );
};
