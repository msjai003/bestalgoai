
import React from "react";
import { ChevronRight, Settings, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Strategy } from "@/hooks/strategy/types";

interface StrategyCardProps {
  strategy: Strategy;
  onToggleLiveMode: () => void;
  onEditQuantity: () => void;
  onViewDetails: () => void;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggleLiveMode,
  onEditQuantity,
  onViewDetails
}) => {
  // Determine the correct button text based on strategy.isLive
  const buttonText = strategy.isLive ? "Switch to Paper" : "Enable Live";
  
  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 mb-4">
      <h3 className="text-white text-xl font-medium mb-2">{strategy.name}</h3>
      <p className="text-gray-400 text-sm mb-5">
        {strategy.description || "Uses volume and price action to identify breakouts from consolidation patterns, entering positions in the direction of the breakout."}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-[#121212] rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Current P&L</p>
          <p className="text-emerald-400 text-2xl font-semibold">{strategy.pnl || "+₹0"}</p>
        </div>
        <div className="bg-[#121212] rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Success Rate</p>
          <div className="flex items-center">
            <p className="text-white text-2xl font-semibold">{strategy.successRate || "N/A"}</p>
            {!strategy.successRate && (
              <div className="ml-2 mt-1">
                <div className="h-4 w-1 bg-gray-600 inline-block mx-[1px]"></div>
                <div className="h-6 w-1 bg-gray-600 inline-block mx-[1px]"></div>
                <div className="h-3 w-1 bg-gray-600 inline-block mx-[1px]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-300 text-base">Quantity</span>
          <div className="flex items-center gap-2">
            <span className="text-white text-xl font-medium">{strategy.quantity || 450}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white p-1 h-auto"
              onClick={onEditQuantity}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="bg-[#121212] p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Broker</span>
            <span className="text-white font-medium text-right">{strategy.selectedBroker || "Aliceblue"}</span>
          </div>
          
          {(strategy.brokerUsername || "ab065072") && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Account</span>
              <Badge variant="outline" className="text-cyan border-cyan bg-transparent">
                {strategy.brokerUsername || "ab065072"}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Trade Type</span>
          <Badge className="bg-[#0B362E] text-emerald-400 border-0">
            {strategy.tradeType || "live trade"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-5">
          <span className="text-gray-300">Status</span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-medium">
              {strategy.isLive ? "Active" : "Inactive"}
            </span>
            {strategy.isLive && (
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">
              {strategy.isLive ? "Live" : "Paper"}
            </span>
            <Button 
              variant={strategy.isLive ? "outline" : "secondary"}
              size="sm"
              onClick={onToggleLiveMode}
              className={`${strategy.isLive ? 'bg-[#0B362E] text-green-400 border-green-500/30 hover:bg-[#0B362E]/80' : 'bg-[#121212] border-[#2A2A2A]'}`}
            >
              <Power className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="bg-[#1E2D3D] text-cyan border-0 hover:bg-[#1E2D3D]/80"
          >
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
