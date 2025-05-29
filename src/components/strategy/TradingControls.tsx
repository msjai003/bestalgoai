
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
          {!isActive && (
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
