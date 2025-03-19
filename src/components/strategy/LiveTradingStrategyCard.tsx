
import React from "react";
import { BarChart2, ChevronRight, Settings, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
        
        {/* Display broker information with better separation */}
        {strategy.selectedBroker && (
          <div className="bg-gray-800/50 p-3 rounded-lg mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-300 text-sm">Broker</span>
              <span className="text-white font-medium">{strategy.selectedBroker}</span>
            </div>
            
            {strategy.brokerUsername && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Account</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {strategy.brokerUsername}
                </Badge>
              </div>
            )}
          </div>
        )}
        
        {/* Trade type display */}
        {strategy.tradeType && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Trade Type</span>
            <Badge variant="outline" className={`${strategy.tradeType === 'live trade' ? 'text-emerald-400 border-emerald-400' : 'text-blue-400 border-blue-400'}`}>
              {strategy.tradeType}
            </Badge>
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
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {strategy.isLive ? "Live" : "Paper"}
          </span>
          <Switch
            checked={strategy.isLive}
            onCheckedChange={onToggleLiveMode}
            className={`${strategy.isLive ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-gray-600'}`}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="text-green-400 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-green-300 flex-1"
        >
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
