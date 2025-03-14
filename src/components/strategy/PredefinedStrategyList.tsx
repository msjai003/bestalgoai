
import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StrategyPerformance {
  winRate: string;
  avgProfit: string;
  drawdown: string;
}

interface Strategy {
  id: number;
  name: string;
  description: string;
  performance: StrategyPerformance;
  isWishlisted: boolean;
  isLive: boolean;
  quantity: number;
}

interface PredefinedStrategyListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  user: any;
}

export const PredefinedStrategyList: React.FC<PredefinedStrategyListProps> = ({
  strategies, 
  isLoading, 
  onToggleWishlist, 
  onToggleLiveMode,
  user
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return <div className="text-center py-8 text-gray-400">Loading strategies...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 gap-3 pb-4">
      {strategies.map((strategy) => (
        <StrategyListItem 
          key={strategy.id}
          strategy={strategy}
          onToggleWishlist={onToggleWishlist}
          onToggleLiveMode={onToggleLiveMode}
          onViewDetails={() => navigate(`/strategy-details/${strategy.id}`)}
          user={user}
        />
      ))}
    </div>
  );
};

interface StrategyListItemProps {
  strategy: Strategy;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  onViewDetails: () => void;
  user: any;
}

const StrategyListItem: React.FC<StrategyListItemProps> = ({
  strategy,
  onToggleWishlist,
  onToggleLiveMode,
  onViewDetails,
  user
}) => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white">{strategy.name}</h3>
          <p className="text-sm text-gray-400">{strategy.description}</p>
        </div>
        <div className="flex gap-2">
          {user && (
            <Button 
              size="icon" 
              variant="ghost" 
              className={`${strategy.isWishlisted ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-400`}
              onClick={() => onToggleWishlist(strategy.id, !strategy.isWishlisted)}
              aria-label={strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className="h-4 w-4" fill={strategy.isWishlisted ? "currentColor" : "none"} />
            </Button>
          )}
          
          <Button 
            size="icon" 
            variant="ghost" 
            className={`${strategy.isLive ? 'text-green-500' : 'text-gray-400'} hover:text-green-400`}
            onClick={() => onToggleLiveMode(strategy.id)}
            aria-label={strategy.isLive ? "Switch to paper trading" : "Switch to live trading"}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Win Rate:</span>
            <span className="text-green-400">{strategy.performance.winRate}</span>
          </div>
          
          <div>
            <Button
              size="sm"
              variant="outline"
              className="text-green-500 hover:text-green-400 bg-gray-700 hover:bg-gray-600 border-gray-600"
              onClick={onViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
