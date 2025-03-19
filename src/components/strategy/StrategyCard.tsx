
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
  // Always set isFreeOrPaid to true to show all strategies as unlocked
  const isFreeOrPaid = true;

  // Debug logging to understand strategy state
  useEffect(() => {
    console.log("StrategyCard:", {
      id: strategy.id,
      name: strategy.name,
      isFreeOrPaid,
      paidStatus: strategy.paidStatus
    });
  }, [strategy]);

  const handleLiveModeClick = () => {
    if (!isAuthenticated) return;
    
    if (strategy.isLive) {
      // If already live, just toggle it off
      onToggleLiveMode();
    } else {
      // For all strategies, enable them directly without payment
      onToggleLiveMode();
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
                    isPremium={index !== 0} 
                    isPaid={true} // Always show as paid
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
