
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStrategyBacktestData, type StrategyType } from '@/hooks/strategy/useStrategyBacktestData';
import { cn } from '@/lib/utils';

interface BacktestStrategyChartProps {
  strategyType: StrategyType;
  className?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-charcoalSecondary p-3 rounded-lg border border-gray-700 shadow-xl">
        <p className="text-cyan font-medium mb-1">{`Year: ${data.year}`}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => {
            const monthKey = month.toLowerCase();
            const value = data[monthKey];
            if (value !== undefined) {
              return (
                <p key={month} className={cn("text-white", 
                  value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : '')}>
                  <span className="text-gray-400">{month}:</span> {value?.toLocaleString()}
                </p>
              );
            }
            return null;
          })}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className={cn("font-medium", 
            data.total > 0 ? 'text-green-500' : data.total < 0 ? 'text-red-500' : 'text-white')}>
            <span className="text-cyan">Total:</span> {data.total?.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const BacktestStrategyChart: React.FC<BacktestStrategyChartProps> = ({ strategyType, className }) => {
  const { strategyData, metrics, loading, error } = useStrategyBacktestData(strategyType);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-64 text-red-400", className)}>
        Error loading data: {error.message}
      </div>
    );
  }

  if (!strategyData.length) {
    return (
      <div className={cn("flex items-center justify-center h-64 text-gray-400", className)}>
        No backtest data available for {strategyType}
      </div>
    );
  }

  const formatYAxisTick = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const getStrategyColor = () => {
    switch (strategyType) {
      case 'nova':
        return "#a855f7";
      case 'velox':
        return "#3b82f6";
      case 'evercrest':
        return "#10b981";
      case 'apexflow':
        return "#f59e0b";
      case 'zenflow':
      default:
        return "#00BCD4";
    }
  };

  const chartData = strategyData.map(year => ({
    year: year.year,
    jan: year.jan || 0,
    feb: year.feb || 0,
    mar: year.mar || 0,
    apr: year.apr || 0,
    may: year.may || 0,
    jun: year.jun || 0,
    jul: year.jul || 0,
    aug: year.aug || 0,
    sep: year.sep || 0,
    oct: year.oct || 0,
    nov: year.nov || 0,
    dec: year.dec || 0,
    total: year.total || 0
  }));

  return (
    <div className={cn("bg-charcoalSecondary/50 rounded-xl p-4", className)}>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 12, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#888" 
              tick={{ fill: '#B0B0B0' }}
              axisLine={{ stroke: '#555' }}
              tickLine={{ stroke: '#555' }}
            />
            <YAxis 
              stroke="#888" 
              tick={{ fill: '#B0B0B0', fontSize: 11 }}
              axisLine={{ stroke: '#555' }}
              tickLine={{ stroke: '#555' }}
              tickFormatter={formatYAxisTick}
              width={45}
              padding={{ top: 15, bottom: 15 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              wrapperStyle={{
                paddingTop: "10px",
                paddingBottom: "10px",
                fontSize: "12px"
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Annual Performance"
              stroke={getStrategyColor()}
              strokeWidth={2}
              dot={{ r: 4, fill: getStrategyColor(), stroke: getStrategyColor() }}
              activeDot={{ r: 6, stroke: getStrategyColor(), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-3 bg-charcoalPrimary/40 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-400">Overall Profit</p>
            <p className={cn("text-lg font-semibold", 
              metrics.overall_profit_percentage && metrics.overall_profit_percentage > 0 ? 'text-green-500' : 'text-red-500')}>
              {metrics.overall_profit_percentage ? `${metrics.overall_profit_percentage.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Win Rate</p>
            <p className="text-lg font-semibold text-green-500">
              {metrics.win_percentage ? `${metrics.win_percentage.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Max Drawdown</p>
            <p className="text-lg font-semibold text-red-500">
              {metrics.max_drawdown_percentage ? `${Math.abs(metrics.max_drawdown_percentage).toFixed(2)}%` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Reward/Risk</p>
            <p className="text-lg font-semibold text-cyan">
              {metrics.reward_to_risk_ratio ? metrics.reward_to_risk_ratio.toFixed(2) : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
