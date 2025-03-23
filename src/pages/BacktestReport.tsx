
import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Calendar } from "lucide-react";

const BacktestReport = () => {
  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <i className="fa-solid fa-arrow-left text-charcoalTextSecondary"></i>
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Backtest Report</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-charcoalTextSecondary"></i>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-charcoalSecondary/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button className="bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary py-2 px-4 rounded-lg text-sm font-medium">
              Backtesting
            </button>
            <Link to="/strategy-builder" className="text-charcoalTextSecondary py-2 px-4 rounded-lg text-sm font-medium text-center">
              Strategy Builder
            </Link>
          </div>
        </div>

        <section className="space-y-4">
          <div className="bg-charcoalSecondary/30 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-charcoalSecondary/50 p-3 rounded-lg">
                <p className="text-charcoalTextSecondary text-xs mb-1">Profit/Loss</p>
                <p className="text-charcoalSuccess text-lg font-semibold">+₹12,450</p>
              </div>
              <div className="bg-charcoalSecondary/50 p-3 rounded-lg">
                <p className="text-charcoalTextSecondary text-xs mb-1">Win Rate</p>
                <p className="text-charcoalTextPrimary text-lg font-semibold">68%</p>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-charcoalTextSecondary text-sm">Total Trades</span>
                <span className="text-charcoalTextPrimary">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoalTextSecondary text-sm">Avg. Profit per Trade</span>
                <span className="text-charcoalSuccess">₹265</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoalTextSecondary text-sm">Max Drawdown</span>
                <span className="text-charcoalDanger">-₹3,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoalTextSecondary text-sm">Sharpe Ratio</span>
                <span className="text-charcoalTextPrimary">1.85</span>
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
