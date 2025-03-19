
import React from "react";
import { Strategy } from "@/hooks/strategy/types";

interface StrategyLiveStatusProps {
  strategy: Strategy;
}

export const StrategyLiveStatus: React.FC<StrategyLiveStatusProps> = ({ 
  strategy 
}) => {
  if (!strategy.isLive) return null;
  
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <div className="bg-gray-700/50 p-2 rounded">
        <p className="text-xs text-gray-400">Quantity</p>
        <p className="text-white font-medium">{strategy.quantity || 0}</p>
      </div>
      
      {strategy.selectedBroker && (
        <div className="bg-gray-700/50 p-2 rounded">
          <p className="text-xs text-gray-400">Broker</p>
          <p className="text-white font-medium">{strategy.selectedBroker}</p>
        </div>
      )}
    </div>
  );
};
