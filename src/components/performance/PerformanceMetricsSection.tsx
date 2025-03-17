
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const PerformanceMetricsSection = () => {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Performance Metrics</h2>
        <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Last 30 Days</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="text-sm text-gray-400">Win Rate</div>
          <div className="text-xl font-bold text-green-400">68.5%</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="text-sm text-gray-400">Max Drawdown</div>
          <div className="text-xl font-bold text-red-400">-12.3%</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="text-sm text-gray-400">Sharpe Ratio</div>
          <div className="text-xl font-bold text-blue-400">2.1</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="text-sm text-gray-400">Avg. Profit</div>
          <div className="text-xl font-bold text-green-400">₹342</div>
        </div>
      </div>
    </section>
  );
};
