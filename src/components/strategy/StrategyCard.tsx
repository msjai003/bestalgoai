
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
  const isFreeStrategy = index === 0;
  const isPaid = strategy.paidStatus === 'paid';
  const isFreeOrPaid = isFreeStrategy || isPaid;

  // Debug logging to understand strategy state
  useEffect(() => {
    console.log("StrategyCard:", {
      id: strategy.id,
      name: strategy.name,
      isFreeStrategy,
      isPaid,
      paidStatus: strategy.paidStatus,
      isFreeOrPaid
    });
  }, [strategy, isFreeStrategy, isPaid]);

  const handleLiveModeClick = () => {
    if (!isAuthenticated) return;
    
    if (strategy.isLive) {
      // If already live, just toggle it off
      onToggleLiveMode();
    } else if (isFreeOrPaid) {
      // If it's the free strategy or a paid strategy, enable it
      onToggleLiveMode();
    } else {
      // For non-free strategies that aren't paid, show payment dialog
      if (onShowPaymentDialog) {
        onShowPaymentDialog();
      } else {
        setShowPaymentDialog(true);
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
                    isPremium={!isFreeStrategy} 
                    isPaid={isPaid} 
                  />
                </h3>
                <StrategyPerformanceBadges performance={strategy.performance} />
              </div>
              
              <StrategyActionButtons 
                isWishlisted={strategy.isWishlisted}
                isLive={strategy.isLive}
                isFreeOrPaid={isFreeOrPaid}
                isAuthenticated={isAuthenticated}
                onToggleWishlist={onToggleWishlist}
                onLiveModeClick={handleLiveModeClick}
                onShowPaymentDialog={onShowPaymentDialog}
              />
            </div>
            
            <p className="text-gray-300 text-sm mb-3">
              {isFreeOrPaid
                ? strategy.description 
                : "This premium strategy requires a subscription to access. Upgrade now to unlock powerful trading capabilities."}
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
