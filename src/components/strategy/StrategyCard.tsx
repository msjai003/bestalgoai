
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, Play, Lock } from "lucide-react";
import { Strategy } from "@/hooks/strategy/types";

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

  const handleStrategyClick = () => {
    navigate(`/strategy-details/${strategy.id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent strategy click
    onToggleWishlist(Number(strategy.id), !!strategy.isWishlisted);
  };

  const handleLiveModeToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent strategy click
    onToggleLiveMode(Number(strategy.id));
  };

  // Check if strategy is premium (based on package or name for special cases)
  const isEvercrest = strategy.name?.toLowerCase().includes('evercrest');
  const isZenflow = strategy.name?.toLowerCase().includes('zen');
  const isSpeedUp = strategy.name?.toLowerCase().includes('speed up');
  const isVeloxEdge = strategy.name?.toLowerCase().includes('velox');
  const isNovaGlide = strategy.name?.toLowerCase().includes('nova');
  
  // Determine if strategy is actually premium based on multiple criteria
  const isPremium = (strategy.package === 'premium' || strategy.isPremium === true ||
                    isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && !isZenflow;
  
  // Determine if user has access to this strategy
  // If user has premium access (hasPremium), they can access ALL premium strategies
  const hasAccess = !isPremium || hasPremium || strategy.isPaid;

  return (
    <div 
      className={`relative bg-gradient-to-br from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary rounded-xl border border-gray-700/50 shadow-lg hover:shadow-cyan/10 hover:border-gray-600 transition-all duration-300 cursor-pointer ${!hasAccess ? 'bg-opacity-60' : ''}`}
      onClick={handleStrategyClick}
    >
      {/* Content of the StrategyCard component */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-white hover:text-cyan transition-colors duration-300">{strategy.name}</h3>
            <p className="text-gray-300 text-sm mt-1">{strategy.description}</p>
          </div>
          <div className="flex flex-col items-end">
            {isPremium && !hasAccess && (
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-xs font-medium mb-2">
                Premium
              </span>
            )}
            <div className="flex space-x-1">
              {isAuthenticated && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`${strategy.isWishlisted ? 'text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20' : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'} rounded-full h-7 w-7 p-0 border-none`}
                      onClick={handleWishlistToggle}
                      aria-label={strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {strategy.isWishlisted ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  </TooltipContent>
                </Tooltip>
              )}
              
              {isAuthenticated && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`${isPremium && !hasAccess ? 'text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20' : (strategy.isLive ? 'text-green-500 hover:text-green-400 bg-green-500/10 hover:bg-green-500/20' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5')} rounded-full h-7 w-7 p-0 border-none`}
                      onClick={handleLiveModeToggle}
                      aria-label={isPremium && !hasAccess ? "Premium strategy" : (strategy.isLive ? "Switch to paper trading" : "Switch to live trading")}
                    >
                      {isPremium && !hasAccess ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isPremium && !hasAccess ? 
                      "Unlock premium strategy" : 
                      (strategy.isLive ? "Switch to paper trading" : "Switch to live trading")
                    }
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-charcoalPrimary rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Win Rate</p>
            <p className="text-sm font-medium text-cyan">{strategy.performance?.winRate || 'N/A'}</p>
          </div>
          <div className="text-center p-2 bg-charcoalPrimary rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Avg Profit</p>
            <p className="text-sm font-medium text-green-400">{strategy.performance?.avgProfit || 'N/A'}</p>
          </div>
          <div className="text-center p-2 bg-charcoalPrimary rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Drawdown</p>
            <p className="text-sm font-medium text-red-400">{strategy.performance?.drawdown || 'N/A'}</p>
          </div>
        </div>
        
        {isPremium && !hasAccess && (
          <div className="mt-3 flex justify-center">
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-cyan/20 to-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20 rounded-full px-4 py-1 text-xs shadow-sm hover:shadow-cyan/20 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                sessionStorage.setItem('selectedStrategyId', strategy.id.toString());
                sessionStorage.setItem('redirectAfterPayment', '/strategy-selection');
                navigate('/pricing');
              }}
            >
              <Lock className="h-3 w-3 mr-1" /> Unlock Strategy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
