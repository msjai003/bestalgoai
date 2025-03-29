
import React from 'react';
import { BacktestResult } from '@/hooks/strategy/useBacktestResults';

interface BacktestDetailsViewProps {
  backtest: BacktestResult;
}

export const BacktestDetailsView = ({ backtest }: BacktestDetailsViewProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-charcoalSecondary/50 p-3 rounded-lg">
          <p className="text-charcoalTextSecondary text-xs mb-1">Strategy</p>
          <p className="text-charcoalTextPrimary text-lg font-semibold">{backtest.strategyName || 'N/A'}</p>
        </div>
        <div className="bg-charcoalSecondary/50 p-3 rounded-lg">
          <p className="text-charcoalTextSecondary text-xs mb-1">P/L</p>
          <p className={`text-lg font-semibold ${backtest.pl && backtest.pl > 0 ? 'text-charcoalSuccess' : backtest.pl && backtest.pl < 0 ? 'text-charcoalDanger' : 'text-charcoalTextPrimary'}`}>
            {backtest.pl ? `₹${backtest.pl.toFixed(2)}` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="bg-charcoalSecondary/30 rounded-xl p-4 border border-gray-700 shadow-lg">
        <h3 className="text-charcoalTextPrimary font-medium mb-4">Trade Details</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Entry Date</span>
              <span className="text-charcoalTextPrimary">
                {backtest.entryDate ? new Date(backtest.entryDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Entry Day</span>
              <span className="text-charcoalTextPrimary">{backtest.entryWeekday || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Entry Time</span>
              <span className="text-charcoalTextPrimary">{backtest.entryTime || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Entry Price</span>
              <span className="text-charcoalTextPrimary">₹{backtest.entryPrice?.toFixed(2) || 'N/A'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Exit Date</span>
              <span className="text-charcoalTextPrimary">
                {backtest.exitDate ? new Date(backtest.exitDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Exit Day</span>
              <span className="text-charcoalTextPrimary">{backtest.exitWeekday || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Exit Time</span>
              <span className="text-charcoalTextPrimary">{backtest.exitTime || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoalTextSecondary text-sm">Exit Price</span>
              <span className="text-charcoalTextPrimary">₹{backtest.exitPrice?.toFixed(2) || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">Instrument</span>
            <span className="text-charcoalTextPrimary">{backtest.instrumentKind || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">Position</span>
            <span className="text-charcoalTextPrimary">{backtest.position || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">Strike Price</span>
            <span className="text-charcoalTextPrimary">₹{backtest.strikePrice?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">Quantity</span>
            <span className="text-charcoalTextPrimary">{backtest.quantity || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">Expiry Date</span>
            <span className="text-charcoalTextPrimary">
              {backtest.expiryDate ? new Date(backtest.expiryDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">P/L</span>
            <span className={backtest.pl && backtest.pl > 0 ? 'text-charcoalSuccess' : backtest.pl && backtest.pl < 0 ? 'text-charcoalDanger' : 'text-charcoalTextPrimary'}>
              {backtest.pl ? `₹${backtest.pl.toFixed(2)}` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">P/L Percentage</span>
            <span className={backtest.plPercentage && backtest.plPercentage > 0 ? 'text-charcoalSuccess' : backtest.plPercentage && backtest.plPercentage < 0 ? 'text-charcoalDanger' : 'text-charcoalTextPrimary'}>
              {backtest.plPercentage ? `${backtest.plPercentage.toFixed(2)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">Highest MTM</span>
            <span className="text-charcoalSuccess">₹{backtest.highestMtm?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoalTextSecondary text-sm">Lowest MTM</span>
            <span className="text-charcoalDanger">₹{backtest.lowestMtm?.toFixed(2) || 'N/A'}</span>
          </div>
        </div>

        {backtest.remarks && (
          <div className="mt-4 p-3 bg-charcoalSecondary/20 rounded-lg">
            <p className="text-charcoalTextSecondary text-xs mb-1">Remarks</p>
            <p className="text-charcoalTextPrimary">{backtest.remarks}</p>
          </div>
        )}
      </div>
    </div>
  );
};
