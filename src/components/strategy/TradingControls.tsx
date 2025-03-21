
import React from 'react';
import { Button } from "@/components/ui/button";

interface TradingControlsProps {
  isActive: boolean;
  onToggleTrading: () => void;
}

export const TradingControls: React.FC<TradingControlsProps> = ({ 
  isActive, 
  onToggleTrading 
}) => {
  return (
    <section className="space-y-4">
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 shadow-lg">
        <div className="space-y-3">
          {!isActive ? (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-lg font-medium shadow-lg"
              onClick={onToggleTrading}
            >
              Start Trading All
            </Button>
          ) : (
            <Button 
              variant="destructive"
              className="w-full py-6 rounded-lg font-medium"
              onClick={onToggleTrading}
            >
              Square Off All Positions
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
