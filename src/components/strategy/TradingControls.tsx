
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
    <section className="space-y-4 mb-24">
      <div className="bg-charcoalSecondary/30 rounded-xl p-4 border border-gray-700 shadow-lg">
        <div className="space-y-3">
          {isActive ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 bg-cyan/20 rounded-lg border border-cyan/30">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan animate-pulse"></div>
                  <span className="text-cyan font-medium">Trading Active</span>
                </div>
                <span className="text-xs text-cyan bg-cyan/30 px-2 py-1 rounded-full">Live</span>
              </div>
              
              <Button 
                variant="destructive"
                className="w-full py-6 rounded-lg font-medium"
                onClick={onToggleTrading}
              >
                Deactivate Trading
              </Button>
            </div>
          ) : (
            <Button 
              variant="cyan"
              className="w-full py-6 rounded-lg font-medium text-charcoalPrimary"
              onClick={onToggleTrading}
            >
              Activate Trading
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
