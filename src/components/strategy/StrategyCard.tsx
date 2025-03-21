
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
  const [showDetails, setShowDetails] = useState(false);
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

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
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
          
          {showDetails && canAccess && (
            <div className="mt-3 mb-3">
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
          )}
          
          <div className="flex justify-between items-center mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleShowDetails}
              className="text-gray-300 text-xs border-gray-700 hover:bg-gray-700 flex items-center gap-1"
            >
              {showDetails ? "Hide Details" : "View Details"}
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="text-green-400 text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-green-300"
            >
              Full Details
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
