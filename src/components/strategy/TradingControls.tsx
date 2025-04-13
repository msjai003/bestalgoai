
import React from 'react';
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

interface TradingControlsProps {
  isActive: boolean;
  onToggleTrading: () => void;
}

export const TradingControls: React.FC<TradingControlsProps> = ({ 
  isActive, 
  onToggleTrading 
}) => {
  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 z-40">
      <div className="glass-card rounded-[24px] p-4 border border-gray-700/40 shadow-2xl backdrop-blur-xl mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-1">Trading Status</h3>
            <p className="text-small text-gray-400">Turn on to enable live trading across all active strategies</p>
          </div>
          <Button
            onClick={onToggleTrading}
            size="lg"
            className={`h-12 w-24 rounded-pill ${isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'} transition-all duration-300`}
          >
            <Power className={`mr-2 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-300'}`} />
            <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
              {isActive ? 'ON' : 'OFF'}
            </span>
          </Button>
        </div>
        {isActive && (
          <div className="mt-2 bg-green-500/10 border border-green-500/20 rounded-[16px] p-2">
            <p className="text-small text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              Live trading is active. Your strategies are executing trades.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
