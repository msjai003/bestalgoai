
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/strategy/types";
import { HeartIcon, PlayIcon, BookmarkIcon, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StrategyCardProps {
  strategy: Strategy;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onDeployStrategy: (id: number) => void;
  isAuthenticated: boolean;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggleWishlist,
  onDeployStrategy,
  isAuthenticated
}) => {
  const toggleWishlist = () => {
    onToggleWishlist(strategy.id, !strategy.isWishlisted);
  };

  const handleDeployClick = () => {
    onDeployStrategy(strategy.id);
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
                      className="text-gray-400 hover:text-green-400"
                      onClick={handleDeployClick}
                      disabled={!isAuthenticated}
                    >
                      <PlayIcon size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deploy Strategy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-3">
            {strategy.description}
          </p>
          
          {(strategy.quantity > 0 || strategy.selectedBroker || strategy.tradeType) && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {strategy.quantity > 0 && (
                <div className="bg-gray-700/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Quantity</p>
                  <p className="text-white font-medium">{strategy.quantity}</p>
                </div>
              )}
              
              {strategy.selectedBroker && (
                <div className="bg-gray-700/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Broker</p>
                  <p className="text-white font-medium">{strategy.selectedBroker}</p>
                </div>
              )}
              
              {strategy.tradeType && (
                <div className="bg-gray-700/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Trade Type</p>
                  <Badge variant="outline" className={`${strategy.tradeType === 'live trade' ? 'text-emerald-400 border-emerald-400/30' : 'text-blue-400 border-blue-400/30'}`}>
                    {strategy.tradeType === 'live trade' ? 'Live' : 'Paper'}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
