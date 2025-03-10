import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Calendar } from "lucide-react";

const BacktestReport = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <i className="fa-solid fa-arrow-left text-gray-300"></i>
          </Link>
          <h1 className="text-white text-lg font-medium">Backtest Report</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-gray-300"></i>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-gray-800/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white py-2 px-4 rounded-lg text-sm font-medium">
              Backtesting
            </button>
            <Link to="/strategy-builder" className="text-gray-400 py-2 px-4 rounded-lg text-sm font-medium text-center">
              Strategy Builder
            </Link>
          </div>
        </div>

        <section className="space-y-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Profit/Loss</p>
                <p className="text-green-400 text-lg font-semibold">+₹12,450</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Win Rate</p>
                <p className="text-white text-lg font-semibold">68%</p>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Total Trades</span>
                <span className="text-white">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Avg. Profit per Trade</span>
                <span className="text-green-400">₹265</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Max Drawdown</span>
                <span className="text-red-400">-₹3,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Sharpe Ratio</span>
                <span className="text-white">1.85</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default BacktestReport;
