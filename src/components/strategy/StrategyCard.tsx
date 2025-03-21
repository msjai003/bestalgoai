
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
  const isPremium = strategy.id > 1; // First strategy is free, others are premium
  const canAccess = !isPremium || hasPremium || strategy.isPaid;
  const [showDetails, setShowDetails] = useState(false);

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

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
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

          <div className="mt-3">
            <Button 
              variant="outline" 
              className="w-full justify-between border-gray-600 bg-gray-700/50 hover:bg-gray-700"
              onClick={toggleDetails}
            >
              View Details
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          
          {showDetails && (
            <div className="mt-3 bg-gray-700/20 p-3 rounded-md border border-gray-700">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex flex-col items-center p-2 bg-blue-900/30 rounded-md border border-blue-800">
                  <span className="text-xs text-blue-300 mb-1">Win Rate</span>
                  <span className="text-blue-300 font-medium">{strategy.performance.winRate}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-green-900/30 rounded-md border border-green-800">
                  <span className="text-xs text-green-300 mb-1">Avg. Profit</span>
                  <span className="text-green-300 font-medium">{strategy.performance.avgProfit}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-red-900/30 rounded-md border border-red-800">
                  <span className="text-xs text-red-300 mb-1">Max Drawdown</span>
                  <span className="text-red-300 font-medium">{strategy.performance.drawdown}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-[#FF00D4] hover:bg-[#FF00D4]/90"
                onClick={handleViewDetails}
              >
                View Full Strategy
              </Button>
            </div>
          )}
          
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
