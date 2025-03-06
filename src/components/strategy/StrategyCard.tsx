
import { ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StrategyCardProps {
  strategy: {
    id: number;
    name: string;
    description: string;
    isWishlisted?: boolean;
    performance?: {
      winRate: string;
      avgProfit: string;
      drawdown: string;
    };
  };
  onWishlist?: (id: number) => void;
  onSelect?: () => void;
}

export const StrategyCard = ({ strategy, onWishlist, onSelect }: StrategyCardProps) => {
  const navigate = useNavigate();
  
  const handleStrategySelect = () => {
    navigate(`/strategy-details/${strategy.id}`);
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div 
      className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-pink-500 transition-colors cursor-pointer relative"
      onClick={handleStrategySelect}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white">{strategy.name}</h3>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className={`${strategy.isWishlisted ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-500`}
            onClick={(e) => {
              e.stopPropagation();
              if (onWishlist) {
                onWishlist(strategy.id);
              }
            }}
          >
            <Heart className="h-5 w-5" fill={strategy.isWishlisted ? "currentColor" : "none"} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={(e) => {
              e.stopPropagation();
              handleStrategySelect();
            }}
          >
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{strategy.description}</p>
      
      {strategy.performance && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-gray-800/50 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Win Rate</p>
            <p className="text-white text-sm font-medium">{strategy.performance.winRate}</p>
          </div>
          <div className="bg-gray-800/50 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Avg Profit</p>
            <p className="text-green-400 text-sm font-medium">{strategy.performance.avgProfit}</p>
          </div>
          <div className="bg-gray-800/50 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Drawdown</p>
            <p className="text-red-400 text-sm font-medium">{strategy.performance.drawdown}</p>
          </div>
        </div>
      )}
    </div>
  );
};
