
import React from "react";
import { Link } from "react-router-dom";
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
  // All strategies are now accessible, regardless of premium status
  const isAccessible = true;
  
  console.log("Rendering strategy in StrategyItem:", {
    id: strategy.id,
    name: strategy.name,
    description: strategy.description,
    isPremium: strategy.isPremium,
    isAccessible
  });
  
  return (
    <Link 
      to={`/strategy-details/${strategy.id}`}
      className="block mb-3"
    >
      <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 hover:border-cyan/30 transition-all">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-white">{strategy.name}</h3>
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
