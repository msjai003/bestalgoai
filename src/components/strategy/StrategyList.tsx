import React from 'react';
import { Strategy } from "@/hooks/strategy/types";
import { Button } from "@/components/ui/button";
import { PencilIcon, Eye } from "lucide-react";

interface StrategyListProps {
  strategies: Strategy[];
  onToggleLiveMode: (id: number, uniqueId?: string, rowId?: string, broker?: string, brokerUsername?: string) => void;
  onEditQuantity: (id: number | string, broker?: string, brokerUsername?: string) => void;
  onViewDetails: (id: number | string) => void;
}

export const StrategyList: React.FC<StrategyListProps> = ({
  strategies,
  onToggleLiveMode,
  onEditQuantity,
  onViewDetails
}) => {
  return (
    <div className="space-y-4 mb-6">
      {strategies.map((strategy) => {
        // Check if this strategy has broker-specific configurations
        const hasBrokerConfigs = strategy.brokerConfigs && strategy.brokerConfigs.length > 0;
        
        return (
          <div 
            key={strategy.uniqueId || strategy.id} 
            className="bg-charcoalSecondary/30 rounded-xl p-4 border border-gray-700 shadow-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-white">{strategy.name}</h3>
                <p className="text-sm text-gray-400">{strategy.description || "No description available"}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white"
                onClick={() => onViewDetails(strategy.id)}
              >
                <Eye className="h-4 w-4 mr-1" /> Details
              </Button>
            </div>
            
            <div className="space-y-4">
              {hasBrokerConfigs ? (
                // If the strategy has broker configs, show each broker separately
                strategy.brokerConfigs.map((config, index) => (
                  <div key={`${strategy.id}-${config.brokerName}-${index}`} className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-white font-medium">{config.brokerName}</span>
                        <span className="text-xs text-gray-400 ml-2">({config.brokerUsername})</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={config.tradeType === 'live trade' ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => onToggleLiveMode(
                            strategy.id as number, 
                            strategy.uniqueId, 
                            strategy.rowId || undefined,
                            config.brokerName,
                            config.brokerUsername
                          )}
                        >
                          {config.tradeType === 'live trade' ? 'Switch to Paper' : 'Go Live'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditQuantity(
                            strategy.id, 
                            config.brokerName, 
                            config.brokerUsername
                          )}
                        >
                          <PencilIcon className="h-3 w-3 mr-1" />
                          Qty: {config.quantity || 0}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Mode:</span>
                      <span 
                        className={`font-medium ${
                          config.tradeType === 'live trade' ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {config.tradeType === 'live trade' ? 'Live Trading' : 'Paper Trading'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                // If no broker configs, show the default view
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant={strategy.isLive ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => onToggleLiveMode(
                          strategy.id as number, 
                          strategy.uniqueId, 
                          strategy.rowId || undefined
                        )}
                      >
                        {strategy.isLive ? 'Switch to Paper' : 'Go Live'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditQuantity(strategy.id)}
                      >
                        <PencilIcon className="h-3 w-3 mr-1" />
                        Qty: {strategy.quantity || 0}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Mode:</span>
                    <span 
                      className={`font-medium ${
                        strategy.isLive ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {strategy.isLive ? 'Live Trading' : 'Paper Trading'}
                    </span>
                  </div>
                  {strategy.selectedBroker && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Broker:</span>
                      <span className="text-white">{strategy.selectedBroker}</span>
                    </div>
                  )}
                </>
              )}
              
              {/* Performance metrics remain the same */}
              <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Win Rate</p>
                  <p className="text-sm font-medium text-white">
                    {strategy.performance?.winRate || "N/A"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Avg. Profit</p>
                  <p className="text-sm font-medium text-white">
                    {strategy.performance?.avgProfit || "N/A"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Max Drawdown</p>
                  <p className="text-sm font-medium text-white">
                    {strategy.performance?.drawdown || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
