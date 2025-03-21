
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/strategy/types";
import { HeartIcon, PlayIcon, StopCircleIcon, LockIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface StrategyCardProps {
  strategy: Strategy;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  isAuthenticated: boolean;
  hasPremium?: boolean;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggleWishlist,
  onToggleLiveMode,
  isAuthenticated,
  hasPremium = false
}) => {
  const navigate = useNavigate();
  const [showPerformance, setShowPerformance] = useState(false);
  const isPremium = strategy.id > 1; // First strategy is free, others are premium
  const canAccess = !isPremium || hasPremium || strategy.isPaid;

  const toggleWishlist = () => {
    onToggleWishlist(strategy.id, !strategy.isWishlisted);
  };

  const toggleLiveMode = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!canAccess) {
      // Store the strategy ID and return path in sessionStorage before redirecting
      sessionStorage.setItem('selectedStrategyId', strategy.id.toString());
      sessionStorage.setItem('redirectAfterPayment', '/live-trading');
      navigate('/pricing');
      return;
    }
    
    onToggleLiveMode(strategy.id);
  };

  const handleViewDetails = () => {
    navigate(`/strategy-details/${strategy.id}`);
  };

  const togglePerformance = () => {
    setShowPerformance(!showPerformance);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="cursor-pointer" onClick={handleViewDetails}>
              <h3 className="text-xl font-semibold text-white mb-1">
                {strategy.name}
              </h3>
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
                      className={!canAccess ? "text-yellow-500" : (strategy.isLive ? "text-green-400" : "text-gray-400 hover:text-green-400")}
                      onClick={toggleLiveMode}
                      disabled={!isAuthenticated}
                    >
                      {!canAccess ? (
                        <LockIcon size={20} />
                      ) : (
                        strategy.isLive ? <StopCircleIcon size={20} /> : <PlayIcon size={20} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!canAccess ? (
                      <p>Unlock this premium strategy</p>
                    ) : strategy.isLive ? (
                      <p>Disable live trading</p>
                    ) : (
                      <p>Enable live trading</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {canAccess ? (
            <p className="text-gray-300 text-sm mb-3">
              {strategy.description}
            </p>
          ) : (
            <p className="text-gray-300 text-sm mb-3">
              This premium strategy requires a subscription. <span onClick={toggleLiveMode} className="text-[#FF00D4] cursor-pointer">Upgrade now</span>
            </p>
          )}
          
          {showPerformance && canAccess && (
            <div className="mt-3 mb-3 p-3 bg-gray-700/30 rounded-md border border-gray-700">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Performance Metrics</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-900/30 p-2 rounded-md border border-blue-800">
                  <p className="text-xs text-blue-300 font-medium">Win Rate</p>
                  <p className="text-blue-200 font-bold">{strategy.performance.winRate}</p>
                </div>
                <div className="bg-green-900/30 p-2 rounded-md border border-green-800">
                  <p className="text-xs text-green-300 font-medium">Avg. Profit</p>
                  <p className="text-green-200 font-bold">{strategy.performance.avgProfit}</p>
                </div>
                <div className="bg-red-900/30 p-2 rounded-md border border-red-800">
                  <p className="text-xs text-red-300 font-medium">Max Drawdown</p>
                  <p className="text-red-200 font-bold">{strategy.performance.drawdown}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePerformance}
              className="text-green-400 text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-green-300 w-full"
            >
              View Details
              {showPerformance ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDown className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
          
          {strategy.isLive && canAccess && (
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
  );
};
