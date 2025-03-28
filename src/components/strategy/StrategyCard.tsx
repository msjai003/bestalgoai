
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/strategy/types";
import { HeartIcon, PlayIcon, StopCircleIcon, LockIcon, Eye } from "lucide-react";
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

  const toggleWishlist = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.stopPropagation();
    
    // Only allow toggle if authenticated
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    onToggleWishlist(strategy.id, !strategy.isWishlisted);
  };

  const toggleLiveMode = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.stopPropagation();
    
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
    <Card className="bg-gradient-to-br from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary rounded-xl border border-gray-700/50 shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:shadow-cyan/10 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="p-5 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/5 to-cyan/0 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white hover:text-cyan transition-colors duration-300">
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
                      className={`${strategy.isWishlisted ? "text-red-400" : "text-gray-400 hover:text-red-400"} transition-all duration-300 bg-gray-800/50 border border-gray-700/50 rounded-full h-8 w-8 cursor-pointer`}
                      onClick={toggleWishlist}
                    >
                      <HeartIcon size={18} className={strategy.isWishlisted ? "fill-red-400" : ""} />
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
                    <div 
                      onClick={toggleLiveMode}
                      className={`${!canAccess ? "text-yellow-500" : (strategy.isLive ? "text-green-400" : "text-gray-400 hover:text-green-400")} 
                        transition-all duration-300 bg-gray-800/50 border border-gray-700/50 rounded-full h-8 w-8 
                        flex items-center justify-center cursor-pointer active:scale-95`}
                      role="button"
                      tabIndex={0}
                      aria-label={!canAccess ? "Unlock this premium strategy" : strategy.isLive ? "Disable live trading" : "Enable live trading"}
                    >
                      {!canAccess ? (
                        <LockIcon size={18} />
                      ) : (
                        strategy.isLive ? <StopCircleIcon size={18} /> : <PlayIcon size={18} />
                      )}
                    </div>
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
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {strategy.description}
            </p>
          ) : (
            <p className="text-gray-300 text-sm mb-4">
              This premium strategy requires a subscription. <span onClick={(e) => {e.stopPropagation(); toggleLiveMode(e);}} className="text-cyan cursor-pointer hover:underline transition-colors duration-300">Upgrade now</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-charcoalPrimary/50 backdrop-blur-sm border border-gray-700/30 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Success Rate</p>
              <p className="text-cyan text-lg font-semibold">{strategy.performance?.winRate || "N/A"}</p>
            </div>
            <div className="bg-charcoalPrimary/50 backdrop-blur-sm border border-gray-700/30 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Avg. Profit</p>
              <p className="text-emerald-400 text-lg font-semibold">{strategy.performance?.avgProfit || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              className="md:w-auto w-full bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary font-medium hover:from-cyan hover:to-blue-400 shadow-md shadow-cyan/10 hover:shadow-lg hover:shadow-cyan/20 transition-all duration-300"
              onClick={handleViewFullStrategy}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Full Strategy
            </Button>
          </div>
          
          {strategy.isLive && canAccess && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-charcoalPrimary/80 border border-gray-700/50 rounded-lg p-2">
                <p className="text-xs text-gray-400">Quantity</p>
                <p className="text-white font-medium">{strategy.quantity || 0}</p>
              </div>
              
              {strategy.selectedBroker && (
                <div className="bg-charcoalPrimary/80 border border-gray-700/50 rounded-lg p-2">
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
