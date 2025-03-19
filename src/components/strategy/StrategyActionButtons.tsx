
import React from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlayIcon, LockIcon, UnlockIcon, StopCircleIcon } from "lucide-react";
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
  // Determine which icon to show based on strategy status
  const getLiveModeIcon = () => {
    if (isLive) {
      return <StopCircleIcon size={20} />;
    } else if (!isFreeOrPaid) {
      return <LockIcon size={20} />;
    } else {
      return <PlayIcon size={20} />;
    }
  };

  // Determine tooltip text based on strategy status
  const getLiveModeTooltip = () => {
    if (isLive) {
      return "Disable live trading";
    } else if (!isFreeOrPaid) {
      return "Premium strategy - Upgrade to access";
    } else {
      return "Enable live trading";
    }
  };

  // Handle live mode button click
  const handleLiveModeClick = () => {
    if (!isFreeOrPaid && onShowPaymentDialog) {
      onShowPaymentDialog();
    } else {
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
                : (isFreeOrPaid) 
                  ? "text-gray-400 hover:text-green-400" 
                  : "text-gray-400 hover:text-gray-300"}
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
