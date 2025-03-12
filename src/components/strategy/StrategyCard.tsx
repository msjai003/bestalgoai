
import { ChevronRight, Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StrategyCardProps {
  strategy: {
    id: number;
    name: string;
    description: string;
    isWishlisted?: boolean;
    isLive?: boolean;
    isCustom?: boolean;
    performance?: {
      winRate: string;
      avgProfit: string;
      drawdown: string;
    };
  };
  onWishlist?: (id: number, isWishlisted: boolean) => void;
  onLiveMode?: (id: number) => void;
  onSelect?: () => void;
}

export const StrategyCard = ({ 
  strategy, 
  onWishlist, 
  onLiveMode, 
  onSelect 
}: StrategyCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStrategySelect = () => {
    navigate(`/strategy-details/${strategy.id}`);
    if (onSelect) {
      onSelect();
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!strategy.isWishlisted) {
        // Add to wishlist in Supabase
        const { error } = await supabase.from('strategy_selections')
          .insert({
            user_id: user.id,
            strategy_id: strategy.id,
            strategy_name: strategy.name,
            strategy_description: strategy.description
          });
          
        if (error) {
          console.error('Error adding strategy to wishlist:', error);
          throw error;
        }
        
        toast({
          title: "Added to wishlist",
          description: `${strategy.name} has been added to your wishlist`,
        });
      } else {
        // Remove from wishlist in Supabase
        const { error } = await supabase.from('strategy_selections')
          .delete()
          .eq('user_id', user.id)
          .eq('strategy_id', strategy.id);
          
        if (error) {
          console.error('Error removing strategy from wishlist:', error);
          throw error;
        }
        
        toast({
          title: "Removed from wishlist",
          description: `${strategy.name} has been removed from your wishlist`,
        });
      }
      
      // Notify parent component
      if (onWishlist) {
        onWishlist(strategy.id, !strategy.isWishlisted);
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className={`${strategy.isWishlisted ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={handleWishlist}
                disabled={isLoading}
              >
                <Heart className="h-5 w-5" fill={strategy.isWishlisted ? "currentColor" : "none"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{strategy.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className={`${strategy.isLive ? 'text-green-500' : 'text-gray-400'} hover:text-green-500`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLiveMode) {
                    onLiveMode(strategy.id);
                  }
                }}
              >
                <Play className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{strategy.isLive ? 'Switch to paper trading' : 'Click to live trade'}</p>
            </TooltipContent>
          </Tooltip>
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
