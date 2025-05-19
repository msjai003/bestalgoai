
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

  // Helper function to determine if a strategy is premium based on its package field or isPremium flag
  // or if it's specifically the Apexflow strategy (by name)
  const isPremiumStrategy = (strategy: any) => {
    // Special case for Apexflow - always show as premium
    if (strategy.name?.toLowerCase().includes('apex') || strategy.name?.toLowerCase().includes('flow')) {
      return true;
    }
    return strategy.package === 'premium' || strategy.isPremium === true;
  };

  // Helper to check if a premium strategy has been paid for
  const isPaidStrategy = (strategy: any) => {
    return strategy.isPaid === true;
  };

  const handlePremiumClick = (strategyId: number | string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from propagating
    
    // Store the strategy ID in sessionStorage before redirecting
    sessionStorage.setItem('selectedStrategyId', strategyId.toString());
    sessionStorage.setItem('redirectAfterPayment', '/strategy-management');
    navigate('/pricing');
  };
  
  const handleToggleLiveMode = (strategyId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from propagating
    
    // Get the strategy
    const strategy = strategies.find(s => s.id === strategyId);
    if (!strategy) return;
    
    // If it's a premium strategy (including Apexflow) and not paid for, redirect to pricing
    const isPremium = isPremiumStrategy(strategy);
    const hasPaidAccess = isPaidStrategy(strategy);
    
    if (isPremium && !hasPaidAccess) {
      handlePremiumClick(strategyId, e);
    } else {
      onToggleLiveMode(strategyId);
    }
  };
  
  const handleDeleteStrategy = (strategyId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from propagating
    onDeleteStrategy(strategyId);
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
            className="bg-charcoalSecondary hover:bg-charcoalSecondary/90 border border-gray-700/50 text-cyan hover:text-cyan/90 cursor-pointer transition-all duration-300"
            onClick={() => navigate(actionButtonPath)}
          >
            <Plus className="h-4 w-4 mr-1 text-cyan" />
            {actionButtonText}
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {strategies.length === 0 ? (
          <div className="bg-gradient-to-br from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary rounded-xl p-6 border border-gray-700/50 flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">
              {title === "Predefined Strategies" 
                ? "Click \"Add Strategy\" to view strategies. Tap the ❤️ heart icon to add a strategy to your wishlist." 
                : emptyMessage}
            </p>
            {title !== "Predefined Strategies" && showEmptyStateButton && actionButtonText && actionButtonPath && (
              <Button 
                onClick={() => navigate(actionButtonPath)}
                variant="outline"
                size="sm"
                className="bg-charcoalSecondary hover:bg-charcoalSecondary/90 border border-gray-700/50 text-cyan hover:text-cyan/90 cursor-pointer transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-1 text-cyan" />
                Browse Strategies
              </Button>
            )}
          </div>
        ) : (
          strategies.map((strategy) => {
            // Check if this is a premium strategy using the package field or if it's Apexflow
            const isPremium = isPremiumStrategy(strategy);
            // Check if user has access to this premium strategy
            const canAccess = !isPremium || isPaidStrategy(strategy);
            
            return (
              <div key={strategy.uniqueId || strategy.id} className="bg-gradient-to-br from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary rounded-xl p-4 border border-gray-700/50 shadow-lg hover:shadow-cyan/10 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/strategy-details/${strategy.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white hover:text-cyan transition-colors duration-300">{strategy.name}</h3>
                    {/* Show description only if it's not a premium strategy OR if it's a premium strategy that has been paid for */}
                    {(!isPremium || isPaidStrategy(strategy)) && strategy.description && (
                      <p className="text-gray-300 text-sm mt-1">{strategy.description}</p>
                    )}
                    {/* Show locked message for premium strategies */}
                    {isPremium && !isPaidStrategy(strategy) && (
                      <p className="text-gray-300 text-sm mt-1">
                        <span className="text-yellow-400">Premium strategy</span> - Upgrade to unlock
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer p-2 transition-colors duration-300"
                          onClick={(e) => handleDeleteStrategy(strategy.id, e)}
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
                        {isPremium && !isPaidStrategy(strategy) ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 p-2 cursor-pointer transition-colors duration-300"
                            onClick={(e) => handlePremiumClick(strategy.id, e)}
                            aria-label="Premium strategy"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`${strategy.isLive ? "text-green-500 hover:text-green-400 hover:bg-green-500/10" : "text-gray-400 hover:text-gray-300 hover:bg-white/5"} p-2 cursor-pointer transition-colors duration-300`}
                            onClick={(e) => handleToggleLiveMode(strategy.id, e)}
                            aria-label={strategy.isLive ? "Switch to paper trading" : "Switch to live trading"}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {isPremium && !isPaidStrategy(strategy) ? (
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
                    
                    <div className={`${isPremium && !isPaidStrategy(strategy) ? 'bg-yellow-500/20 text-yellow-400' : (strategy.isLive ? 'bg-green-500/20 text-green-400' : 'bg-cyan/20 text-cyan')} px-2 py-1 rounded-md text-xs font-medium`}>
                      {isPremium && !isPaidStrategy(strategy) ? 'Premium' : (strategy.isLive ? 'Live Trading' : 'Paper Trading')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StrategySection;
