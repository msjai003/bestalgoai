
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlayIcon, StopCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StrategyActionButtonsProps {
  isWishlisted: boolean;
  isLive: boolean;
  isFreeOrPaid: boolean;
  isAuthenticated: boolean;
  onToggleWishlist: () => void;
  onLiveModeClick: () => void;
  onShowPaymentDialog?: () => void;
}

export const StrategyActionButtons: React.FC<StrategyActionButtonsProps> = ({
  isWishlisted,
  isLive,
  isFreeOrPaid,
  isAuthenticated,
  onToggleWishlist,
  onLiveModeClick,
  onShowPaymentDialog
}) => {
  // Log the props to debug
  useEffect(() => {
    console.log("StrategyActionButtons props:", { 
      isLive, 
      isFreeOrPaid, 
      isAuthenticated 
    });
  }, [isLive, isFreeOrPaid, isAuthenticated]);

  // Always show play icon or stop icon based on isLive status
  const getLiveModeIcon = () => {
    console.log("getLiveModeIcon called with isLive:", isLive);
    
    if (isLive) {
      return <StopCircleIcon size={20} />;
    } else {
      // Always show play icon, never show lock icon
      return <PlayIcon size={20} />;
    }
  };

  // Determine tooltip text based on strategy status
  const getLiveModeTooltip = () => {
    if (isLive) {
      return "Disable live trading";
    } else {
      return "Enable live trading";
    }
  };

  // Handle live mode button click
  const handleLiveModeClick = () => {
    onLiveModeClick();
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
