
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/useStrategy";
import { HeartIcon, PlayIcon, BookmarkIcon, StopCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StrategyCardProps {
  strategy: Strategy;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  isAuthenticated: boolean;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggleWishlist,
  onToggleLiveMode,
  isAuthenticated
}) => {
  const toggleWishlist = () => {
    onToggleWishlist(strategy.id, !strategy.isWishlisted);
  };

  const toggleLiveMode = () => {
    onToggleLiveMode(strategy.id);
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
                      className={strategy.isLive ? "text-green-400" : "text-gray-400 hover:text-green-400"}
                      onClick={toggleLiveMode}
                      disabled={!isAuthenticated}
                    >
                      {strategy.isLive ? (
                        <StopCircleIcon size={20} />
                      ) : (
                        <PlayIcon size={20} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{strategy.isLive ? "Disable live trading" : "Enable live trading"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-3">
            {strategy.description}
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
  );
};
