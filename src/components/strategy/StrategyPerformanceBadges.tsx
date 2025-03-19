
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/hooks/strategy/types";

interface StrategyPerformanceBadgesProps {
  performance: Strategy['performance'];
}

export const StrategyPerformanceBadges: React.FC<StrategyPerformanceBadgesProps> = ({ 
  performance 
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <Badge 
        variant="outline" 
        className="bg-blue-900/30 text-blue-300 border-blue-800"
      >
        Win Rate: {performance.winRate}
      </Badge>
      <Badge 
        variant="outline" 
        className="bg-green-900/30 text-green-300 border-green-800"
      >
        Avg. Profit: {performance.avgProfit}
      </Badge>
      <Badge 
        variant="outline" 
        className="bg-red-900/30 text-red-300 border-red-800"
      >
        Max Drawdown: {performance.drawdown}
      </Badge>
    </div>
  );
};
