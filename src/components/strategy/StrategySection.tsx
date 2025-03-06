
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Play, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StrategySectionProps {
  title: string;
  icon: React.ReactNode;
  strategies: any[];
  emptyMessage: string;
  actionButtonText: string;
  actionButtonPath: string;
  onDeleteStrategy: (id: number) => void;
  onToggleLiveMode: (id: number) => void;
  showEmptyStateButton?: boolean;
}

export const StrategySection = ({
  title,
  icon,
  strategies,
  emptyMessage,
  actionButtonText,
  actionButtonPath,
  onDeleteStrategy,
  onToggleLiveMode,
  showEmptyStateButton = true,
}: StrategySectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {actionButtonText && (
          <Button 
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-400 border-gray-700 bg-transparent hover:bg-gray-800"
            onClick={() => navigate(actionButtonPath)}
          >
            <Plus className="h-4 w-4 mr-1" />
            {actionButtonText}
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {strategies.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">{emptyMessage}</p>
            {showEmptyStateButton && actionButtonText && actionButtonPath && (
              <Button 
                onClick={() => navigate(actionButtonPath)}
                variant="outline"
                className="text-green-500 hover:text-green-400 border-gray-700 bg-transparent hover:bg-gray-800"
              >
                Browse Strategies
              </Button>
            )}
          </div>
        ) : (
          strategies.map((strategy) => (
            <div key={strategy.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">{strategy.name}</h3>
                  <p className="text-sm text-gray-400">{strategy.description}</p>
                </div>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-pink-500 hover:text-pink-400"
                        onClick={() => onDeleteStrategy(strategy.id)}
                        aria-label="Remove strategy"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Remove from wishlist</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`${strategy.isLive ? 'text-green-500' : 'text-gray-400'} hover:text-green-500`}
                        onClick={() => onToggleLiveMode(strategy.id)}
                        aria-label={strategy.isLive ? 'Switch to paper trading' : 'Switch to live trading'}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{strategy.isLive ? 'Switch to paper trading' : 'Click to live trade'}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {strategy.performance && (
                      <>
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-green-400">{strategy.performance.winRate}</span>
                      </>
                    )}
                  </div>
                  
                  <div className={`${strategy.isLive ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'} px-2 py-1 rounded-md text-xs font-medium`}>
                    {strategy.isLive ? 'Live Trading' : 'Paper Trading'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
