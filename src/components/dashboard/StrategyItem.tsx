
import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrategyItemProps {
  strategy: {
    id: string | number;
    name: string;
    description: string;
    isPremium?: boolean;
    isPaid?: boolean;
    package?: string;
  };
  hasPremium: boolean;
  onPremiumClick: () => void;
}

const StrategyItem = ({ strategy, hasPremium, onPremiumClick }: StrategyItemProps) => {
  // Always convert ID to number for comparison
  const strategyIdNumber = typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : Number(strategy.id);
  
  // Check if this is specifically the Apexflow strategy (by name)
  const isApexflow = strategy.name.toLowerCase().includes('apex');
  
  // Check if this is specifically the Evercrest strategy (by name)
  const isEvercrest = strategy.name.toLowerCase().includes('evercrest');
  
  // Check if this is specifically the Zenflow strategy (by name)
  const isZenflow = strategy.name.toLowerCase().includes('zen');
  
  // Check if this is specifically the Speed Up strategy (by name)
  const isSpeedUp = strategy.name.toLowerCase().includes('speed up');
  
  // Update isPremium check:
  // - Package is 'premium'
  // - OR isPremium flag is true
  // - OR it's Apexflow
  // - OR it's Evercrest
  // - OR it's Speed Up
  // - BUT NOT if it's Zenflow (Zenflow is free)
  const isActuallyPremium = (strategy.package === 'premium' || strategy.isPremium === true || isApexflow || isEvercrest || isSpeedUp) && !isZenflow;
  
  // A strategy is accessible if:
  // - it's not premium, OR
  // - the user has premium access (hasPremium), OR
  // - this specific strategy has been paid for (isPaid)
  const isAccessible = !isActuallyPremium || hasPremium || strategy.isPaid;
  
  // Show lock icon for premium strategies that are not accessible
  const shouldShowLock = isActuallyPremium && !isAccessible;
  
  console.log("Rendering strategy in StrategyItem:", {
    id: strategy.id,
    idType: typeof strategy.id,
    numericalId: strategyIdNumber,
    name: strategy.name,
    description: strategy.description,
    isPremium: isActuallyPremium,
    isApexflow,
    isEvercrest,
    isZenflow,
    isSpeedUp,
    package: strategy.package,
    isAccessible,
    hasPremium,
    shouldShowLock
  });
  
  // Handle clicks on the strategy - for premium strategies, show the premium dialog
  const handleStrategyClick = (e: React.MouseEvent) => {
    if (!isAccessible) {
      e.preventDefault();
      onPremiumClick();
    }
  };
  
  return (
    <Link 
      to={`/strategy-details/${strategy.id}`}
      className="block mb-3"
      onClick={handleStrategyClick}
    >
      <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 hover:border-cyan/30 transition-all">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-white">{strategy.name}</h3>
          {shouldShowLock && (
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-cyan/20 to-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20 rounded-full px-3 py-1 text-xs shadow-sm hover:shadow-cyan/20 transition-all"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPremiumClick();
              }}
            >
              <Lock className="h-3 w-3 mr-1" /> Unlock
            </Button>
          )}
        </div>
        <p className="text-gray-400 text-sm">{strategy.description}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-3">
            <div className="text-xs">
              <div className="text-gray-500 mb-1">Success Rate</div>
              <div className="text-cyan font-medium">N/A</div>
            </div>
            <div className="text-xs">
              <div className="text-gray-500 mb-1">Avg. Profit</div>
              <div className="text-green-400 font-medium">N/A</div>
            </div>
          </div>
          <span className="text-cyan text-xs">View Details</span>
        </div>
      </div>
    </Link>
  );
};

export default StrategyItem;
