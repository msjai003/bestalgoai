
import React, { useMemo } from 'react';
import { BacktestResult } from '@/hooks/strategy/useBacktestResults';
import LineChartWithColoredSegments from '@/components/charts/LineChartWithColoredSegments';

interface BacktestResultsChartProps {
  results: BacktestResult[];
}

export const BacktestResultsChart = ({ results }: BacktestResultsChartProps) => {
  // Transform backtest results into chart data
  const chartData = useMemo(() => {
    if (!results || results.length === 0) return [];
    
    // Sort results by entry date
    const sortedResults = [...results].sort((a, b) => {
      const dateA = a.entryDate ? new Date(a.entryDate).getTime() : 0;
      const dateB = b.entryDate ? new Date(b.entryDate).getTime() : 0;
      return dateA - dateB;
    });
    
    // Calculate cumulative P&L
    let cumulativePL = 0;
    return sortedResults.map(result => {
      cumulativePL += result.pl || 0;
      return {
        time: result.entryDate ? new Date(result.entryDate).toLocaleDateString() : 'N/A',
        value: cumulativePL,
        position: result.position,
        strategy: result.strategyName
      };
    });
  }, [results]);
  
  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 bg-charcoalSecondary/30 rounded-lg border border-gray-700">
        <p className="text-charcoalTextSecondary">No data available for visualization</p>
      </div>
    );
  }

  return (
    <div className="bg-charcoalSecondary/30 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Performance Chart</h3>
      <div className="h-60">
        <LineChartWithColoredSegments
          data={chartData}
          positiveColor="#00BCD4" // Cyan color for positive trends
          negativeColor="#FF5252" // Red for negative trends
          dataKey="value"
          dot={true}
          activeDot={{ r: 6, fill: "#00BCD4", stroke: "#fff", strokeWidth: 2 }}
        />
      </div>
      <div className="flex justify-between mt-4 text-xs text-charcoalTextSecondary">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#00BCD4] rounded-full mr-1"></span>
          <span>Positive Trend</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#FF5252] rounded-full mr-1"></span>
          <span>Negative Trend</span>
        </div>
      </div>
    </div>
  );
};
