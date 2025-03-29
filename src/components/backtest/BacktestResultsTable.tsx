
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BacktestResult } from '@/hooks/strategy/useBacktestResults';

interface BacktestResultsTableProps {
  results: BacktestResult[];
}

export const BacktestResultsTable = ({ results }: BacktestResultsTableProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-6 text-charcoalTextSecondary">
        No backtest results to display.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="text-xs md:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Strategy</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead>Entry Time</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Exit Date</TableHead>
            <TableHead>Exit Price</TableHead>
            <TableHead>P/L</TableHead>
            <TableHead>P/L %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell>{result.strategyName || 'N/A'}</TableCell>
              <TableCell>
                {result.entryDate ? new Date(result.entryDate).toLocaleDateString() : 'N/A'}
                {result.entryWeekday ? ` (${result.entryWeekday})` : ''}
              </TableCell>
              <TableCell>{result.entryTime || 'N/A'}</TableCell>
              <TableCell>₹{result.entryPrice?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell>{result.quantity || 'N/A'}</TableCell>
              <TableCell>{result.position || 'N/A'}</TableCell>
              <TableCell>
                {result.exitDate ? new Date(result.exitDate).toLocaleDateString() : 'N/A'}
                {result.exitWeekday ? ` (${result.exitWeekday})` : ''}
              </TableCell>
              <TableCell>₹{result.exitPrice?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell className={result.pl && result.pl > 0 ? 'text-charcoalSuccess' : result.pl && result.pl < 0 ? 'text-charcoalDanger' : ''}>
                {result.pl ? `₹${result.pl.toFixed(2)}` : 'N/A'}
              </TableCell>
              <TableCell className={result.plPercentage && result.plPercentage > 0 ? 'text-charcoalSuccess' : result.plPercentage && result.plPercentage < 0 ? 'text-charcoalDanger' : ''}>
                {result.plPercentage ? `${result.plPercentage.toFixed(2)}%` : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
