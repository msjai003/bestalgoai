
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { BacktestStrategyChart } from "@/components/backtest/BacktestStrategyChart";
import { ChevronLeft } from "lucide-react";
import { type StrategyType } from '@/hooks/strategy/useStrategyBacktestData';
import { cn } from '@/lib/utils';

const strategies = [
  { id: 'zenflow', name: 'Zenflow Strategy', description: 'Our flagship strategy optimized for consistent returns' },
  { id: 'velox', name: 'Velox Edge', description: 'High-frequency strategy focused on short-term opportunities' },
  { id: 'nova', name: 'Novaglide', description: 'Balance of growth and stability for medium-term investing' },
  { id: 'evercrest', name: 'Evercrest', description: 'Conservative approach prioritizing capital preservation' },
  { id: 'apexflow', name: 'Apexflow', description: 'Aggressive strategy targeting maximum growth potential' }
];

const BacktestVisualization = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('zenflow');

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Backtest Visualization</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-charcoalSecondary/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-5 gap-1">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors",
                  selectedStrategy === strategy.id
                    ? "bg-cyan text-charcoalPrimary"
                    : "text-charcoalTextSecondary hover:bg-charcoalSecondary/80"
                )}
                onClick={() => setSelectedStrategy(strategy.id as StrategyType)}
              >
                {strategy.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center">
          {strategies.map((strategy) => (
            strategy.id === selectedStrategy && (
              <div key={strategy.id} className="animate-fade-in w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold text-white mb-3">{strategy.name}</h2>
                <p className="text-charcoalTextSecondary mb-6">{strategy.description}</p>
              </div>
            )
          ))}
        </div>

        <BacktestStrategyChart strategyType={selectedStrategy} className="mb-6" />

        <div className="bg-charcoalSecondary/30 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 text-center">Strategy Performance</h3>
          <p className="text-charcoalTextSecondary mb-4 text-center">
            The chart above shows the historical performance of the {strategies.find(s => s.id === selectedStrategy)?.name} 
            across different years. Each data point represents the total performance for that year.
          </p>
          
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-charcoalTextPrimary text-sm">Positive returns indicate profitable months</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-charcoalTextPrimary text-sm">Negative returns indicate losing months</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-cyan mr-2"></div>
              <span className="text-charcoalTextPrimary text-sm">The line represents the yearly performance trend</span>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default BacktestVisualization;
