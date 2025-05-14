import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/strategy/types";
import { HeartIcon, PlayIcon, StopCircleIcon, LockIcon, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const isPremium = strategy.id > 1;
  const canAccess = !isPremium || hasPremium || strategy.isPaid;

  console.log("Rendering strategy in StrategyCard:", {
    id: strategy.id,
    name: strategy.name,
    description: strategy.description,
    isPremium,
    canAccess,
    isWishlisted: strategy.isWishlisted
  });

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add strategies to your wishlist",
      });
      navigate('/auth');
      return;
    }
    
    console.log(`Toggling wishlist for strategy ${strategy.id}, current state: ${strategy.isWishlisted}`);
    onToggleWishlist(strategy.id, !strategy.isWishlisted);
  };

  const toggleLiveMode = (e: React.MouseEvent) => {
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

  const handleViewFullStrategy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/strategy-details/${strategy.id}`);
  };

  return (
    <Card className="bg-gradient-to-br from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary rounded-xl border border-gray-700/50 shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:shadow-cyan/10 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="p-5 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/5 to-cyan/0 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white hover:text-cyan transition-colors duration-300">
                {strategy.name}
              </h3>
            </div>
            <div className="flex gap-2 z-10 relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${strategy.isWishlisted ? "text-red-400" : "text-gray-400 hover:text-red-400"} transition-all duration-300 bg-gray-800/50 border border-gray-700/50 rounded-full h-10 w-10 cursor-pointer hover:bg-gray-700/50 hover:shadow-md`}
                      onClick={toggleWishlist}
                      aria-label={strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <HeartIcon 
                        size={24} 
                        className={`${strategy.isWishlisted ? "fill-red-400 filter drop-shadow-[0_0_3px_rgba(244,67,54,0.7)]" : ""} transform transition-all duration-300 hover:scale-110`} 
                      />
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
                      onClick={toggleLiveMode}
                      className={`${!canAccess ? "text-yellow-500 hover:text-yellow-400" : (strategy.isLive ? "text-green-400 hover:text-green-300" : "text-cyan hover:text-cyan/90")} 
                        transition-all duration-300 bg-gray-800/50 border border-gray-700/50 rounded-full h-10 w-10 
                        flex items-center justify-center cursor-pointer hover:bg-gray-700/50 hover:shadow-cyan/20 z-10`}
                      style={{ zIndex: 10 }}
                      aria-label={!canAccess ? "Unlock this premium strategy" : strategy.isLive ? "Configure live trading" : "Enable live trading"}
                    >
                      {!canAccess ? (
                        <LockIcon size={26} className="cursor-pointer animate-pulse-slow filter drop-shadow-[0_0_3px_rgba(255,193,7,0.7)]" />
                      ) : (
                        strategy.isLive ? 
                          <PlayIcon size={24} className="cursor-pointer text-green-400" /> : 
                          <PlayIcon size={24} className="cursor-pointer animate-pulse-slow filter drop-shadow-[0_0_3px_rgba(0,188,212,0.7)]" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!canAccess ? (
                      <p>Unlock this premium strategy</p>
                    ) : strategy.isLive ? (
                      <p>Configure live trading settings</p>
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
              {strategy.name} is a premium strategy that requires a subscription. <span onClick={(e) => {e.stopPropagation(); toggleLiveMode(e);}} className="text-cyan cursor-pointer hover:underline transition-colors duration-300">Upgrade now</span>
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
              className="md:w-auto w-full bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary font-medium 
                hover:from-cyan hover:to-blue-400 shadow-md shadow-cyan/10 hover:shadow-lg hover:shadow-cyan/20 
                transition-all duration-300 cursor-pointer"
              onClick={handleViewFullStrategy}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Full Strategy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
