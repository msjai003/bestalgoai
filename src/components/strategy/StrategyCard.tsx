
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/useStrategy";
import { HeartIcon, PlayIcon, BookmarkIcon, StopCircleIcon, LockIcon, UnlockIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface StrategyCardProps {
  strategy: Strategy;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  isAuthenticated: boolean;
  index: number;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggleWishlist,
  onToggleLiveMode,
  isAuthenticated,
  index
}) => {
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const isFreeStrategy = index === 0;
  const isPaid = strategy.paidStatus === 'paid';

  const toggleWishlist = () => {
    onToggleWishlist(strategy.id, !strategy.isWishlisted);
  };

  const handleLiveModeClick = () => {
    if (!isAuthenticated) return;
    
    if (strategy.isLive) {
      // If already live, just toggle it off
      onToggleLiveMode(strategy.id);
    } else if (isFreeStrategy || isPaid) {
      // If it's the free strategy or a paid strategy, enable it
      onToggleLiveMode(strategy.id);
    } else {
      // For non-free strategies that aren't paid, show payment dialog
      setShowPaymentDialog(true);
    }
  };

  const handleUpgradeClick = () => {
    setShowPaymentDialog(false);
    // Pass strategy ID to subscription page to track which strategy to unlock
    navigate(`/subscription?strategyId=${strategy.id}`);
  };

  // Determine which icon to show based on strategy status
  const getLiveModeIcon = () => {
    if (strategy.isLive) {
      return <StopCircleIcon size={20} />;
    } else if (!isFreeStrategy && !isPaid) {
      return <LockIcon size={20} />;
    } else {
      return <PlayIcon size={20} />;
    }
  };

  // Determine tooltip text based on strategy status
  const getLiveModeTooltip = () => {
    if (strategy.isLive) {
      return "Disable live trading";
    } else if (!isFreeStrategy && !isPaid) {
      return "Premium strategy - Upgrade to access";
    } else {
      return "Enable live trading";
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
                  {!isFreeStrategy && !isPaid && (
                    <Badge variant="outline" className="ml-2 bg-yellow-900/30 text-yellow-300 border-yellow-800">
                      Premium
                    </Badge>
                  )}
                  {!isFreeStrategy && isPaid && (
                    <Badge variant="outline" className="ml-2 bg-green-900/30 text-green-300 border-green-800">
                      Unlocked
                    </Badge>
                  )}
                </h3>
                <div className="flex gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className="bg-blue-900/30 text-blue-300 border-blue-800"
                  >
                    Win Rate: {strategy.performance.winRate}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-green-900/30 text-green-300 border-green-800"
                  >
                    Avg. Profit: {strategy.performance.avgProfit}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-red-900/30 text-red-300 border-red-800"
                  >
                    Max Drawdown: {strategy.performance.drawdown}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={strategy.isWishlisted ? "text-red-400" : "text-gray-400 hover:text-red-400"}
                        onClick={toggleWishlist}
                        disabled={!isAuthenticated}
                      >
                        <HeartIcon size={20} className={strategy.isWishlisted ? "fill-red-400" : ""} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={strategy.isLive 
                          ? "text-green-400" 
                          : (isPaid || isFreeStrategy) 
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
            </div>
            
            <p className="text-gray-300 text-sm mb-3">
              {isFreeStrategy || isPaid
                ? strategy.description 
                : "This premium strategy requires a subscription to access. Upgrade now to unlock powerful trading capabilities."}
            </p>
            
            {strategy.isLive && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-gray-700/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Quantity</p>
                  <p className="text-white font-medium">{strategy.quantity || 0}</p>
                </div>
                
                {strategy.selectedBroker && (
                  <div className="bg-gray-700/50 p-2 rounded">
                    <p className="text-xs text-gray-400">Broker</p>
                    <p className="text-white font-medium">{strategy.selectedBroker}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-gray-800 border border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Upgrade Required</DialogTitle>
            <DialogDescription className="text-gray-400 pt-2">
              This premium strategy requires a subscription to access.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2">{strategy.name}</h4>
              <p className="text-sm text-gray-300">
                Unlock powerful trading features with our premium subscription plan.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-700/50">
              <h4 className="font-semibold text-white flex items-center gap-2 mb-2">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Premium Benefits
                </span>
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Access to all premium strategies
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Advanced backtesting capabilities
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Priority customer support
                </li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowPaymentDialog(false)}
              className="w-full sm:w-auto border border-gray-700"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={handleUpgradeClick}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
            >
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
