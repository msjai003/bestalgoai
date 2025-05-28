
import React from "react";
import { BarChart3 } from "lucide-react";

interface StrategyMetricsProps {
  strategy: any;
}

export const StrategyMetrics = ({ strategy }: StrategyMetricsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center">
        <BarChart3 className="h-5 w-5 text-cyan mr-2" />
        Key Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
          <p className="text-gray-400 mb-1 text-sm">Win Rate</p>
          <p className="text-cyan font-semibold text-xl">{strategy.performance.winRate}</p>
        </div>
        <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
          <p className="text-gray-400 mb-1 text-sm">Average Return</p>
          <p className="text-cyan font-semibold text-xl">{strategy.performance.avgProfit}</p>
        </div>
        <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
          <p className="text-gray-400 mb-1 text-sm">Max Drawdown</p>
          <p className="text-cyan font-semibold text-xl">{strategy.performance.drawdown}</p>
        </div>
        <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
          <p className="text-gray-400 mb-1 text-sm">Risk Score</p>
          <p className="text-cyan font-semibold text-xl">
            {strategy.parameters?.find(p => p.name === "Risk Score")?.value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
