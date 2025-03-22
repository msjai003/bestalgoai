
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
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
        <div className="space-y-3">
          {!isActive ? (
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-6 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity"
              onClick={onToggleTrading}
            >
              Start Trading All
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-400 font-medium">Trading Active</span>
                </div>
                <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full">Live</span>
              </div>
              
              <Button 
                variant="destructive"
                className="w-full py-6 rounded-lg font-medium"
                onClick={onToggleTrading}
              >
                Square Off All Positions
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
