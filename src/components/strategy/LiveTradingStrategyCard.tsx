
import React from "react";
import { BarChart2, ChevronRight, Settings, Power, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Strategy } from "@/hooks/strategy/types";
import { useNavigate } from "react-router-dom";

interface StrategyCardProps {
  strategy: Strategy;
  onToggleLiveMode: () => void;
  onEditQuantity: () => void;
  onViewDetails: () => void;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggleLiveMode,
  onEditQuantity,
  onViewDetails
}) => {
  const navigate = useNavigate();
  
  // Determine the correct button text based on strategy.isLive
  const buttonText = strategy.isLive ? "Switch to Paper" : "Enable Live";
  
  // Check if this is specifically Evercrest (always premium)
  const isEvercrest = strategy.name && strategy.name.toLowerCase().includes('evercrest');
  
  // Check if this is specifically Zenflow (always free)
  const isZenflow = strategy.name && strategy.name.toLowerCase().includes('zen');
  
  // Check if this is specifically Speed Up (always premium)
  const isSpeedUp = strategy.name && strategy.name.toLowerCase().includes('speed up');
  
  // Check if this is specifically Velox Edge (always premium)
  const isVeloxEdge = strategy.name && strategy.name.toLowerCase().includes('velox');
  
  // Check if this is specifically NovaGlide (always premium)
  const isNovaGlide = strategy.name && strategy.name.toLowerCase().includes('nova');
  
  // A strategy is premium if it's specifically Evercrest, Speed Up, Velox, NovaGlide,
  // has premium package or has the premium flag
  // But not if it's Zenflow
  const isPremium = (strategy.package === 'premium' || 
                     strategy.isPremium === true || 
                     isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && !isZenflow;
  
  // A strategy is accessible if:
  // - it's not premium, OR
  // - the user has premium access (checked by isPaid flag), OR
  // - this specific strategy has been paid for
  const isAccessible = !isPremium || strategy.isPaid === true;
  
  // When the unlock button is clicked for premium strategies
  const handlePremiumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Save strategy ID and redirect path to session storage
    sessionStorage.setItem('selectedStrategyId', strategy.id?.toString() || '');
    sessionStorage.setItem('redirectAfterPayment', '/live-trading');
    // Navigate to pricing page
    navigate('/pricing');
  };
  
  console.log(`StrategyCard rendering ${strategy.name}:`, {
    isPremium,
    isAccessible,
    isPaid: strategy.isPaid,
    hasPremium: strategy.isPaid, // If strategy is accessible, user has premium
    name: strategy.name,
    description: strategy.description,
    selectedBroker: strategy.selectedBroker,
    brokerUsername: strategy.brokerUsername
  });
  
  return (
    <div className="premium-card p-5 relative z-10 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-medium">{strategy.name || `Strategy ${strategy.id}`}</h3>
            {strategy.description && (
              <p className="text-xs text-gray-400 mt-1">{strategy.description}</p>
            )}
          </div>
          
          {/* Show premium badge only if not paid for */}
          {(isPremium && !isAccessible) && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Premium
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="glass-card p-3">
            <p className="text-gray-400 text-xs mb-1">Current P&L</p>
            <p className="text-emerald-400 text-lg font-semibold">{strategy.pnl || "+₹0"}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="glass-card p-3 cursor-pointer transition-all duration-300 hover:bg-gray-800/60" onClick={onViewDetails}>
                  <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                  <div className="flex items-center">
                    <p className="text-white text-lg font-semibold">{strategy.successRate || (strategy.performance && strategy.performance.winRate) || "N/A"}</p>
                    <BarChart2 className="w-4 h-4 text-gray-400 ml-1 cursor-pointer pointer-events-auto" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-charcoalSecondary text-white border-gray-700">
                <p>Based on latest backtest results</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Quantity</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{strategy.quantity || 0}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white p-1 h-auto glass hover:bg-gray-700/50 cursor-pointer"
                onClick={onEditQuantity}
              >
                <Settings className="w-4 h-4 cursor-pointer pointer-events-auto" />
              </Button>
            </div>
          </div>
          
          {strategy.selectedBroker && (
            <div className="glass-card p-3 mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Broker</span>
                <span className="text-white font-medium">{strategy.selectedBroker}</span>
              </div>
              
              {strategy.brokerUsername && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Account</span>
                  <Badge variant="outline" className="text-cyan border-cyan bg-cyan/10">
                    {strategy.brokerUsername}
                  </Badge>
                </div>
              )}
            </div>
          )}
          
          {strategy.tradeType && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Trade Type</span>
              <Badge variant="outline" className={`${strategy.tradeType === 'live trade' ? 'text-emerald-400 border-emerald-400 bg-emerald-400/10' : 'text-cyan border-cyan bg-cyan/10'}`}>
                {strategy.tradeType}
              </Badge>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Status</span>
            <div className="flex items-center gap-2">
              <span className={strategy.isLive ? "text-emerald-400" : "text-cyan"}>
                {strategy.isLive ? "Active" : "Inactive"}
              </span>
              {strategy.isLive && (
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {strategy.isLive ? "Live" : "Paper"}
            </span>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  {(isPremium && !isAccessible) ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handlePremiumClick}
                      className="min-w-[90px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-opacity-30 cursor-pointer flex items-center justify-center gap-1 px-3"
                    >
                      <Lock className="h-3.5 w-3.5 cursor-pointer pointer-events-auto" />
                      Unlock
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={onToggleLiveMode}
                      className={`min-w-[90px] ${strategy.isLive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-cyan/20 text-cyan border-cyan/30'} hover:bg-opacity-30 cursor-pointer flex items-center justify-center gap-1 px-3`}
                    >
                      <Power className="h-3.5 w-3.5 cursor-pointer pointer-events-auto" />
                      {buttonText}
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="center"
                  className="z-50 bg-charcoalSecondary border border-gray-700 text-white shadow-lg"
                  sideOffset={5}
                >
                  <p className="whitespace-nowrap px-2 py-1">
                    {(isPremium && !isAccessible) ? 
                      "Unlock premium strategy" : 
                      (strategy.isLive ? "Switch to paper trading" : "Enable live trading")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="text-cyan bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:text-cyan md:flex-grow-0 glass-card cursor-pointer"
          >
            View Details
            <ChevronRight className="ml-1 h-4 w-4 cursor-pointer pointer-events-auto" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
