
import React from "react";
import { BarChart2, ChevronRight, Settings, ToggleLeft, ToggleRight } from "lucide-react";
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
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-medium">{strategy.name}</h3>
          {strategy.description && (
            <p className="text-xs text-gray-400 mt-1">{strategy.description}</p>
          )}
        </div>
        <Badge className={`${strategy.isLive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'} px-2 py-1 rounded-md text-xs font-medium`}>
          {strategy.isLive ? 'Live Trading' : 'Paper Trading'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs mb-1">Current P&L</p>
          <p className="text-emerald-400 text-lg font-semibold">{strategy.pnl || "+₹0"}</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-gray-800/50 p-3 rounded-lg cursor-pointer" onClick={onViewDetails}>
                <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                <div className="flex items-center">
                  <p className="text-white text-lg font-semibold">{strategy.successRate || strategy.performance?.winRate || "N/A"}</p>
                  <BarChart2 className="w-4 h-4 text-gray-400 ml-1" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-700">
              <p>Based on latest backtest results</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">Quantity</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{strategy.quantity || 0}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white p-1 h-auto"
              onClick={onEditQuantity}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {strategy.selectedBroker && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Broker</span>
            <span className="text-white font-medium">{strategy.selectedBroker}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Status</span>
          <div className="flex items-center gap-2">
            <span className={strategy.isLive ? "text-emerald-400" : "text-blue-400"}>
              {strategy.isLive ? "Active" : "Inactive"}
            </span>
            {strategy.isLive && (
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="text-white border-gray-700 hover:bg-gray-700"
        >
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={strategy.isLive ? "outline" : "secondary"}
                size="sm"
                onClick={onToggleLiveMode}
                className={`flex items-center ${
                  strategy.isLive 
                    ? 'text-blue-400 border-blue-900/50 hover:bg-blue-900/20' 
                    : 'text-green-400 bg-green-900/20 border-green-900/50 hover:bg-green-900/30'
                }`}
              >
                {strategy.isLive ? (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-1" />
                    Switch to Paper
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4 mr-1" />
                    Switch to Live
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-700">
              <p>Switch to {strategy.isLive ? 'paper' : 'live'} trading</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
