
import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  // Always convert ID to number for comparison
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
  
  // Update isPremium check to include all premium strategies:
  // - Package is 'premium'
  // - OR isPremium flag is true
  // - OR it's one of the specific premium strategies (Evercrest, Speed Up, Velox Edge, NovaGlide)
  // - BUT NOT if it's Zenflow (Zenflow is always free)
  const isActuallyPremium = (strategy.package === 'premium' || strategy.isPremium === true || 
    isEvercrest || isSpeedUp || isVeloxEdge || isNovaGlide) && !isZenflow;
  
  // A strategy is accessible if:
  // - it's not premium, OR
  // - the user has premium access (hasPremium), OR
  // - this specific strategy has been paid for (isPaid)
  const isAccessible = !isActuallyPremium || hasPremium || strategy.isPaid === true;
  
  // Show lock icon for premium strategies that are not accessible
  const shouldShowLock = isActuallyPremium && !isAccessible;
  
  console.log("Rendering strategy in StrategyItem:", {
    id: strategy.id,
    idType: typeof strategy.id,
    numericalId: strategyIdNumber,
    name: strategy.name,
    description: strategy.description,
    isPremium: isActuallyPremium,
    isEvercrest,
    isZenflow,
    isSpeedUp,
    isVeloxEdge,
    isNovaGlide,
    package: strategy.package,
    isAccessible,
    hasPremium,
    isPaid: strategy.isPaid,
    shouldShowLock
  });
  
  // Handle clicks on the strategy - for premium strategies when not accessible, show the premium dialog
  const handleStrategyClick = (e: React.MouseEvent) => {
    if (!isAccessible) {
      e.preventDefault();
      onPremiumClick();
    }
  };
  
  // Handle unlock button click - navigate to pricing
  const handleUnlockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Store the strategy ID in session storage so the pricing page knows which strategy to unlock
    if (strategy.id) {
      sessionStorage.setItem('selectedStrategyId', String(strategyIdNumber));
      
      // Set a path to return to after payment
      sessionStorage.setItem('redirectAfterPayment', `/strategy-details/${strategyIdNumber}`);
    }
    
    onPremiumClick();
  };

  // Handle view details click separately
  const handleViewDetailsClick = (e: React.MouseEvent) => {
    if (!isAccessible) {
      e.preventDefault();
      e.stopPropagation();
      
      // Store the strategy ID in session storage so the pricing page knows which strategy to unlock
      if (strategy.id) {
        sessionStorage.setItem('selectedStrategyId', String(strategyIdNumber));
        
        // Set a path to return to after payment
        sessionStorage.setItem('redirectAfterPayment', `/strategy-details/${strategyIdNumber}`);
      }
      
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
              onClick={handleUnlockClick}
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
          <span 
            className="text-cyan text-xs cursor-pointer" 
            onClick={!isAccessible ? handleViewDetailsClick : undefined}
          >
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StrategyItem;
