
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Strategy } from "@/hooks/strategy/types";
import { Button } from "@/components/ui/button";
import { Heart, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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
  hasPremium = false,
}) => {
  const navigate = useNavigate();

  // Convert ID to number for consistent comparisons
  const strategyIdNumber = typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : Number(strategy.id);
  
  // Check if this is specifically the Evercrest strategy (by name)
  const isEvercrest = strategy.name.toLowerCase().includes('evercrest');
  
  // Check if this is specifically the Zenflow strategy (by name)
  const isZenflow = strategy.name.toLowerCase().includes('zen');
  
  // Check if this is specifically the Speed Up strategy (by name)
  const isSpeedUp = strategy.name.toLowerCase().includes('speed up');
  
  // Check if this is specifically the Velox Edge strategy (by name)
  const isVeloxEdge = strategy.name.toLowerCase().includes('velox');
  
  // Check if this is specifically the NovaGlide strategy (by name)
  const isNovaGlide = strategy.name.toLowerCase().includes('nova');
  
  // Now, determine if this is a premium strategy that should be locked
  // 'package' can be 'premium' or 'free', and we also check for specific known premium strategies
  const isPremium = (strategy.package === 'premium' || isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && !isZenflow;
  
  // A strategy is accessible if it's not premium OR the user has premium access
  const isAccessible = !isPremium || hasPremium || strategy.isPaid;
  
  // Only show lock if strategy is premium and user doesn't have premium access and hasn't specifically paid for this strategy
  const shouldShowLock = isPremium && !isAccessible;
  
  console.log("Rendering strategy:", {
    id: strategy.id,
    numericalId: strategyIdNumber,
    name: strategy.name,
    description: strategy.description,
    isPremium,
    isEvercrest,
    isZenflow,
    isSpeedUp,
    isVeloxEdge,
    isNovaGlide,
    package: strategy.package,
    hasPremium,
    isPaid: strategy.isPaid,
    isAccessible,
    shouldShowLock
  });

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      onToggleWishlist(strategyIdNumber, !strategy.isWishlisted);
    } else {
      navigate('/auth');
    }
  };

  const handleCardClick = () => {
    navigate(`/strategy-details/${strategy.id}`);
  };

  const handleUnlockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Store the strategy ID in session storage before redirecting to pricing
    sessionStorage.setItem('selectedStrategyId', strategy.id.toString());
    sessionStorage.setItem('redirectAfterPayment', '/strategy-selection');
    
    navigate('/pricing');
  };

  return (
    <div 
      className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 hover:border-cyan/30 transition-all duration-300 cursor-pointer shadow-md"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-white font-medium">{strategy.name}</h2>
          <p className="text-gray-400 text-sm">
            {shouldShowLock ? 
              <span className="text-yellow-400">Premium strategy - Upgrade to unlock</span> : 
              strategy.description
            }
          </p>
        </div>

        <div className="flex items-center">
          <Button 
            onClick={handleWishlistToggle} 
            variant="ghost" 
            size="sm" 
            className={cn(
              "text-gray-400 hover:text-gray-300 hover:bg-transparent p-0 h-auto",
              strategy.isWishlisted && "text-red-500 hover:text-red-400"
            )}
            aria-label="Add to wishlist"
          >
            <Heart 
              className={cn(
                "h-5 w-5", 
                strategy.isWishlisted && "fill-red-500"
              )} 
            />
          </Button>
          
          {shouldShowLock && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center space-x-1 px-2 py-1 text-yellow-500 hover:text-yellow-400 hover:bg-transparent rounded-full text-xs"
              onClick={handleUnlockClick}
            >
              <Lock className="h-3 w-3 mr-1" />
              <span>Unlock</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {strategy.parameters?.tags?.map((tag: string, index: number) => (
          <span key={index} className="bg-charcoalPrimary/60 text-gray-300 text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-800/40">
        <div className="text-xs">
          {isPremium ? (
            <span className={shouldShowLock ? "text-yellow-400" : "text-green-400"}>
              {shouldShowLock ? "Premium" : "Premium (Unlocked)"}
            </span>
          ) : (
            <span className="text-cyan">Free</span>
          )}
        </div>

        <span className="text-gray-400 text-xs">
          {strategy.performance?.winRate || "Win Rate: N/A"}
        </span>
      </div>
    </div>
  );
};
