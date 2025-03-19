
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlayIcon, StopCircleIcon, LockIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StrategyActionButtonsProps {
  isWishlisted: boolean;
  isLive: boolean;
  isFreeOrPaid: boolean;
  isAuthenticated: boolean;
  onToggleWishlist: () => void;
  onLiveModeClick: () => void;
  onShowPaymentDialog?: () => void;
  paidStatus?: string;
  strategyName?: string;
}

export const StrategyActionButtons: React.FC<StrategyActionButtonsProps> = ({
  isWishlisted,
  isLive,
  isFreeOrPaid,
  isAuthenticated,
  onToggleWishlist,
  onLiveModeClick,
  onShowPaymentDialog,
  paidStatus,
  strategyName
}) => {
  // Log the props to debug
  useEffect(() => {
    console.log("StrategyActionButtons props:", { 
      isLive, 
      isFreeOrPaid, 
      isAuthenticated,
      paidStatus,
      strategyName
    });
  }, [isLive, isFreeOrPaid, isAuthenticated, paidStatus, strategyName]);

  // Get the live mode icon based on strategy status
  const getLiveModeIcon = () => {
    console.log(`getLiveModeIcon for ${strategyName}: isLive=${isLive}, paidStatus=${paidStatus}`);
    
    if (isLive) {
      return <StopCircleIcon size={20} />;
    } else if (paidStatus === "premium") {
      // Show lock icon for premium unpaid strategies
      return <LockIcon size={20} />;
    } else {
      // Show play icon for free or paid strategies
      return <PlayIcon size={20} />;
    }
  };

  // Determine tooltip text based on strategy status
  const getLiveModeTooltip = () => {
    if (isLive) {
      return "Disable live trading";
    } else if (paidStatus === "premium") {
      return "Unlock with subscription";
    } else {
      return "Enable live trading";
    }
  };

  // Handle live mode button click
  const handleLiveModeClick = () => {
    console.log(`handleLiveModeClick for ${strategyName}: paidStatus=${paidStatus}`);
    
    // If it's a premium strategy that's not paid yet, show payment dialog
    if (paidStatus === "premium" && onShowPaymentDialog) {
      console.log("Showing payment dialog for premium strategy");
      onShowPaymentDialog();
    } else {
      // Otherwise, proceed with enabling/disabling live mode
      console.log("Proceeding with live mode toggle");
      onLiveModeClick();
    }
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={isWishlisted ? "text-red-400" : "text-gray-400 hover:text-red-400"}
              onClick={onToggleWishlist}
              disabled={!isAuthenticated}
            >
              <HeartIcon size={20} className={isWishlisted ? "fill-red-400" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={isLive 
                ? "text-green-400" 
                : paidStatus === "premium"
                  ? "text-yellow-400 hover:text-green-400"
                  : "text-gray-400 hover:text-green-400"}
              onClick={handleLiveModeClick}
              disabled={!isAuthenticated}
            >
              {getLiveModeIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getLiveModeTooltip()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
