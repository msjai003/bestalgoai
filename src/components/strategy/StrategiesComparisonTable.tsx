
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AllStrategyMetrics } from '@/hooks/strategy/useAllStrategiesMetrics';
import { cn } from "@/lib/utils";

interface StrategiesComparisonTableProps {
  strategies: AllStrategyMetrics[];
  loading: boolean;
}

export const StrategiesComparisonTable = ({ strategies, loading }: StrategiesComparisonTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
      </div>
    );
  }

  if (!strategies || strategies.length === 0) {
    return (
      <div className="text-center p-8 bg-charcoalSecondary/50 rounded-xl">
        <p className="text-charcoalTextSecondary">No strategy metrics available.</p>
      </div>
    );
  }

  const getValueClass = (value?: number | null) => {
    if (value === undefined || value === null) return "";
    return value > 0 ? "text-charcoalSuccess" : value < 0 ? "text-charcoalDanger" : "";
  };

  const getStrategyColor = (strategyName: string) => {
    switch (strategyName) {
      case 'nova':
        return "text-purple-500";
      case 'velox':
        return "text-blue-500";
      case 'evercrest':
        return "text-green-500";
      case 'apexflow':
        return "text-amber-500";
      case 'zenflow':
      default:
        return "text-cyan";
    }
  };

  const getStrategyDisplayName = (strategyName: string) => {
    switch (strategyName) {
      case 'velox':
        return 'Velox Edge';
      case 'nova':
        return 'Nova Glide';
      case 'evercrest':
        return 'Evercrest';
      case 'apexflow':
        return 'Apexflow';
      case 'zenflow':
      default:
        return 'Zenflow';
    }
  };

  const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null) return 'N/A';
    return `₹${Math.abs(value).toLocaleString('en-IN')}`;
  };

  return (
    <div className="overflow-x-auto bg-charcoalSecondary/50 rounded-xl">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-charcoalTextSecondary font-medium">Strategy</TableHead>
            <TableHead className="text-charcoalTextSecondary font-medium">Overall Profit</TableHead>
            <TableHead className="text-charcoalTextSecondary font-medium">Win %</TableHead>
            <TableHead className="text-charcoalTextSecondary font-medium">Max Drawdown</TableHead>
            <TableHead className="text-charcoalTextSecondary font-medium">Reward/Risk</TableHead>
            <TableHead className="text-charcoalTextSecondary font-medium">Avg Profit/Trade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {strategies.map((strategy) => (
            <TableRow key={strategy.strategy_name} className="border-b border-gray-700/50">
              <TableCell className={cn("font-medium", getStrategyColor(strategy.strategy_name))}>
                {getStrategyDisplayName(strategy.strategy_name)}
              </TableCell>
              <TableCell className={getValueClass(strategy.overall_profit)}>
                {formatCurrency(strategy.overall_profit)}
                {strategy.overall_profit_percentage && (
                  <span className="text-xs ml-2">
                    ({strategy.overall_profit_percentage.toFixed(2)}%)
                  </span>
                )}
              </TableCell>
              <TableCell>
                {strategy.win_percentage ? `${strategy.win_percentage.toFixed(2)}%` : 'N/A'}
              </TableCell>
              <TableCell className={cn("text-charcoalDanger", getValueClass(strategy.max_drawdown))}>
                {formatCurrency(strategy.max_drawdown)}
                {strategy.max_drawdown_percentage && (
                  <span className="text-xs ml-2">
                    ({Math.abs(strategy.max_drawdown_percentage).toFixed(2)}%)
                  </span>
                )}
              </TableCell>
              <TableCell>
                {strategy.reward_to_risk_ratio?.toFixed(2) || 'N/A'}
              </TableCell>
              <TableCell className={getValueClass(strategy.avg_profit_per_trade)}>
                {formatCurrency(strategy.avg_profit_per_trade)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
