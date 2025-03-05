
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrategyCardProps {
  strategy: {
    id: number;
    name: string;
    description: string;
    performance?: {
      winRate: string;
      avgProfit: string;
      drawdown: string;
    };
  };
  onSelect: () => void;
}

export const StrategyCard = ({ strategy, onSelect }: StrategyCardProps) => {
  return (
    <div 
      className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-pink-500 transition-colors"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white">{strategy.name}</h3>
        <Button size="icon" variant="ghost" onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{strategy.description}</p>
      
      {strategy.performance && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-gray-800/50 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Win Rate</p>
            <p className="text-white text-sm font-medium">{strategy.performance.winRate}</p>
          </div>
          <div className="bg-gray-800/50 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Avg Profit</p>
            <p className="text-green-400 text-sm font-medium">{strategy.performance.avgProfit}</p>
          </div>
          <div className="bg-gray-800/50 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Drawdown</p>
            <p className="text-red-400 text-sm font-medium">{strategy.performance.drawdown}</p>
          </div>
        </div>
      )}
    </div>
  );
};
