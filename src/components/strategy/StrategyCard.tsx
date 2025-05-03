
import React from "react";
import { Button } from "@/components/ui/button";
import { Strategy } from "@/hooks/strategy/types";
import { Heart, LockKeyhole, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const isPaid = strategy.isPaid || hasPremium;
  const isPaidLocked = !isPaid && strategy.name?.toLowerCase().includes("premium");

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to wishlist strategies");
      return;
    }
    onToggleWishlist(strategy.id, strategy.isWishlisted || false);
  };

  const handlePlayClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to use strategies");
      return;
    }
    
    // Check for premium restriction
    if (isPaidLocked) {
      toast.error("This is a premium strategy. Please upgrade to access it.");
      return;
    }
    
    // Proceed with playing the strategy
    console.log("Playing strategy:", strategy.id, strategy.name);
    onToggleLiveMode(strategy.id);
  };

  return (
    <div className="bg-charcoalSecondary border border-gray-700/50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4 relative">
        {/* Header with title and wishlist button */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
          <button 
            onClick={handleWishlistClick}
            className="p-1.5 rounded-full hover:bg-gray-700/40 transition-colors"
            aria-label={strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`h-5 w-5 ${strategy.isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-400"}`} 
            />
          </button>
        </div>
        
        {/* Strategy description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{strategy.description}</p>
        
        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-charcoalPrimary/50 rounded p-2 text-center">
            <span className="text-xs text-gray-400 block">Win Rate</span>
            <span className="text-cyan font-medium">{strategy.performance?.winRate || "N/A"}</span>
          </div>
          <div className="bg-charcoalPrimary/50 rounded p-2 text-center">
            <span className="text-xs text-gray-400 block">Avg. Profit</span>
            <span className="text-cyan font-medium">{strategy.performance?.avgProfit || "N/A"}</span>
          </div>
          <div className="bg-charcoalPrimary/50 rounded p-2 text-center">
            <span className="text-xs text-gray-400 block">Drawdown</span>
            <span className="text-cyan font-medium">{strategy.performance?.drawdown || "N/A"}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {}}
            className="bg-charcoalPrimary/70 border border-gray-700/50 hover:bg-gray-700/50"
          >
            Details
          </Button>
          <Button 
            variant="cyan" 
            size="sm" 
            onClick={handlePlayClick}
            className="relative z-10"
            disabled={isPaidLocked && !hasPremium}
          >
            {isPaidLocked && !hasPremium ? (
              <>
                <LockKeyhole className="h-4 w-4 mr-1" />
                Premium
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Use
              </>
            )}
          </Button>
        </div>
        
        {/* Premium badge overlay */}
        {isPaidLocked && !hasPremium && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-xs text-black font-medium px-2 py-0.5 rounded-bl-md rounded-tr-md">
            Premium
          </div>
        )}
      </div>
    </div>
  );
};
