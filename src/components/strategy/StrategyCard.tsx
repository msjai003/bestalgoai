
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/strategy/types";
import { HeartIcon, PlayIcon, StopCircleIcon, LockIcon } from "lucide-react";
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

  const toggleWishlist = () => {
    // Only allow toggle if authenticated
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    onToggleWishlist(strategy.id, !strategy.isWishlisted);
  };

  const toggleLiveMode = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!canAccess) {
      sessionStorage.setItem('selectedStrategyId', strategy.id.toString());
      sessionStorage.setItem('redirectAfterPayment', '/live-trading');
      navigate('/pricing');
      return;
    }
    
    onToggleLiveMode(strategy.id);
  };

  const handleViewFullStrategy = () => {
    navigate(`/strategy-details/${strategy.id}`);
  };

  return (
    <Card className="pro-card overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10">
      <CardContent className="p-0">
        <div className="p-5">
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
                      className={`${strategy.isWishlisted ? "text-red-400" : "text-gray-400 hover:text-red-400"} transition-transform hover:scale-110 active:scale-95 glass`}
                      onClick={toggleWishlist}
                      disabled={!isAuthenticated}
                    >
                      <HeartIcon size={20} className={strategy.isWishlisted ? "fill-red-400 animate-micro-bounce" : ""} />
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
                      className={`${!canAccess ? "text-yellow-500" : (strategy.isLive ? "text-green-400" : "text-gray-400 hover:text-green-400")} transition-transform hover:scale-110 active:scale-95 glass`}
                      onClick={toggleLiveMode}
                      disabled={!isAuthenticated}
                    >
                      {!canAccess ? (
                        <LockIcon size={20} className="animate-soft-rotate" />
                      ) : (
                        strategy.isLive ? <StopCircleIcon size={20} className="animate-pulse" /> : <PlayIcon size={20} />
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
              This premium strategy requires a subscription. <span onClick={toggleLiveMode} className="text-[#FF00D4] cursor-pointer hover:underline">Upgrade now</span>
            </p>
          )}

          <div className="glass-card p-3 mt-3 transition-all duration-300 hover:bg-gray-700/30">
            <Button 
              className="w-full gradient-button hover:from-[#FF00D4]/90 hover:to-purple-600/90 text-white hover:animate-micro-glow"
              onClick={handleViewFullStrategy}
            >
              View Full Strategy
            </Button>
          </div>
          
          {strategy.isLive && canAccess && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="glass-card p-2 transition-colors duration-300 hover:bg-gray-700/70">
                <p className="text-xs text-gray-400">Quantity</p>
                <p className="text-white font-medium">{strategy.quantity || 0}</p>
              </div>
              
              {strategy.selectedBroker && (
                <div className="glass-card p-2 transition-colors duration-300 hover:bg-gray-700/70">
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
