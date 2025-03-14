
import React from 'react';
import { CreditCard, MoreVertical, Play, Trash2, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';

interface StrategyCardProps {
  id: number | string;
  name: string;
  description: string;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  isLive: boolean;
  isCustom: boolean;
  createdBy?: string;
  onDelete: (id: number | string) => void;
  onToggleLiveMode: (id: number | string) => void;
}

export const StrategyCard = ({
  id,
  name,
  description,
  performance,
  isLive,
  isCustom,
  createdBy,
  onDelete,
  onToggleLiveMode
}: StrategyCardProps) => {
  const navigate = useNavigate();
  
  const handleSelect = () => {
    navigate(`/backtest?strategyId=${id}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 relative">
      <div className="flex justify-between items-start">
        <h3 className="text-white font-medium">{name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem 
              onClick={() => onToggleLiveMode(id)}
              className="cursor-pointer focus:bg-gray-700"
            >
              <Play className="mr-2 h-4 w-4" />
              {isLive ? "Switch to Paper Trading" : "Switch to Live Trading"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(id)}
              className="cursor-pointer focus:bg-gray-700 text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove from Wishlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
      
      {createdBy && (
        <div className="mt-2 text-xs text-gray-400">
          <span>Created by: {createdBy}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-700/50 p-1 rounded">
          <p className="text-xs text-gray-400">Win Rate</p>
          <p className="text-xs font-medium text-white">{performance.winRate}</p>
        </div>
        <div className="bg-gray-700/50 p-1 rounded">
          <p className="text-xs text-gray-400">Avg. Profit</p>
          <p className="text-xs font-medium text-white">{performance.avgProfit}</p>
        </div>
        <div className="bg-gray-700/50 p-1 rounded">
          <p className="text-xs text-gray-400">Drawdown</p>
          <p className="text-xs font-medium text-white">{performance.drawdown}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSelect}
          className="bg-gray-800 text-green-500 hover:bg-gray-700 border border-gray-600"
          size="sm"
        >
          Select
        </Button>
      </div>
      
      <div className="absolute top-2 right-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 border-gray-700">
            <p className="text-xs">{isLive ? "Live Trading" : "Paper Trading"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {isCustom && (
        <div className="absolute bottom-4 right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 border-gray-700">
              <p className="text-xs">Custom Strategy</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
