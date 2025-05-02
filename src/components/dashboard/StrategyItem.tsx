
import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrategyItemProps {
  strategy: {
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
    isPaid?: boolean;
  };
  hasPremium: boolean;
  onPremiumClick: () => void;
}

const StrategyItem = ({ strategy, hasPremium, onPremiumClick }: StrategyItemProps) => {
  // A strategy is accessible if:
  // - it's not premium, OR
  // - the user has premium access (hasPremium), OR
  // - this specific strategy has been paid for (isPaid)
  const isAccessible = !strategy.isPremium || hasPremium || strategy.isPaid;
  
  return (
    <Link 
      to={`/strategy-details/${strategy.id}`}
      className="block mb-3"
      onClick={!isAccessible ? (e) => {
        e.preventDefault();
        onPremiumClick();
      } : undefined}
    >
      <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 hover:border-cyan/30 transition-all">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-white">{strategy.name}</h3>
          {strategy.isPremium && !isAccessible && (
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
