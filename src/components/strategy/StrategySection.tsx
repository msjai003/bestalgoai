
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Play, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StrategySectionProps {
  title: string;
  icon: React.ReactNode;
  strategies: any[];
  emptyMessage: string;
  actionButtonText: string;
  actionButtonPath: string;
  onDeleteStrategy: (id: number) => void;
  onToggleLiveMode: (id: number) => void;
  showEmptyStateButton?: boolean;
}

export const StrategySection = ({
  title,
  icon,
  strategies,
  emptyMessage,
  actionButtonText,
  actionButtonPath,
  onDeleteStrategy,
  onToggleLiveMode,
  showEmptyStateButton = true,
}: StrategySectionProps) => {
  const navigate = useNavigate();

  // Helper function to determine if a strategy is premium based on its ID
  const isPremiumStrategy = (strategyId: number | string) => {
    // Use the same logic as in StrategyCard component
    return Number(strategyId) > 1;
  };

  // Helper to check if a premium strategy has been paid for
  const isPaidStrategy = (strategy: any) => {
    return strategy.isPaid === true;
  };

  const handlePremiumClick = (strategyId: number | string) => {
    // Store the strategy ID in sessionStorage before redirecting
    sessionStorage.setItem('selectedStrategyId', strategyId.toString());
    sessionStorage.setItem('redirectAfterPayment', '/strategy-management');
    navigate('/pricing');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {actionButtonText && (
          <Button 
            variant="outline"
            size="sm"
            className="bg-gray-600 hover:bg-gray-500 border border-gray-500 text-green-500"
            onClick={() => navigate(actionButtonPath)}
          >
            <Plus className="h-4 w-4 mr-1 text-green-500" />
            {actionButtonText}
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {strategies.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">
              {title === "Predefined Strategies" 
                ? "Click \"Add Strategy\" to view strategies. Tap the ❤️ heart icon to add a strategy to your wishlist." 
                : emptyMessage}
            </p>
            {title !== "Predefined Strategies" && showEmptyStateButton && actionButtonText && actionButtonPath && (
              <Button 
                onClick={() => navigate(actionButtonPath)}
                variant="outline"
                className="bg-gray-600 hover:bg-gray-500 border border-gray-500 text-green-500"
              >
                <Plus className="h-4 w-4 mr-1 text-green-500" />
                Browse Strategies
              </Button>
            )}
          </div>
        ) : (
          strategies.map((strategy) => (
            <div key={strategy.uniqueId || strategy.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">{strategy.name}</h3>
                  {/* Show description only if it's not a premium strategy OR if it's a premium strategy that has been paid for */}
                  {(!isPremiumStrategy(strategy.id) || isPaidStrategy(strategy)) && strategy.description && (
                    <p className="text-gray-300 text-sm mt-1">{strategy.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-pink-500 hover:text-pink-400"
                        onClick={() => onDeleteStrategy(strategy.id)}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Remove from wishlist</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={isPremiumStrategy(strategy.id) && !isPaidStrategy(strategy) ? "text-yellow-500" : (strategy.isLive ? "text-green-500" : "text-gray-400 hover:text-green-500")}
                        onClick={() => isPremiumStrategy(strategy.id) && !isPaidStrategy(strategy) ? handlePremiumClick(strategy.id) : onToggleLiveMode(strategy.id)}
                        aria-label={isPremiumStrategy(strategy.id) && !isPaidStrategy(strategy) ? "Premium strategy" : (strategy.isLive ? "Switch to paper trading" : "Switch to live trading")}
                      >
                        {isPremiumStrategy(strategy.id) && !isPaidStrategy(strategy) ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isPremiumStrategy(strategy.id) && !isPaidStrategy(strategy) ? (
                        <p>Unlock this premium strategy</p>
                      ) : strategy.isLive ? (
                        <p>Switch to paper trading</p>
                      ) : (
                        <p>Click to live trade</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {strategy.performance && (
                      <>
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-green-400">{strategy.performance.winRate}</span>
                      </>
                    )}
                  </div>
                  
                  <div className={`${isPremiumStrategy(strategy.id) && !isPaidStrategy(strategy) ? 'bg-yellow-500/20 text-yellow-400' : (strategy.isLive ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400')} px-2 py-1 rounded-md text-xs font-medium`}>
                    {isPremiumStrategy(strategy.id) && !isPaidStrategy(strategy) ? 'Premium' : (strategy.isLive ? 'Live Trading' : 'Paper Trading')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
