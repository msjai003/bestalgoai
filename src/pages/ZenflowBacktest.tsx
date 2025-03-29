
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  FileSpreadsheet,
  ArrowRight
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const ZenflowBacktest = () => {
  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/backtest" className="p-2">
            <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Zenflow Backtest</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-charcoalSecondary/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-3 gap-1">
            <Link to="/backtest" className="text-charcoalTextSecondary py-2 px-4 rounded-lg text-sm font-medium text-center">
              Backtesting
            </Link>
            <Link to="/strategy-builder" className="text-charcoalTextSecondary py-2 px-4 rounded-lg text-sm font-medium text-center">
              Strategy Builder
            </Link>
            <button className="bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary py-2 px-4 rounded-lg text-sm font-medium">
              Zenflow
            </button>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Zenflow Backtest Tools</h2>
          
          <div className="space-y-4">
            <Link to="/zenflow-backtest-report" className="flex items-center justify-between p-4 bg-charcoalSecondary/40 rounded-xl border border-gray-700 hover:border-cyan/50 transition-colors">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-charcoalSecondary mr-3">
                  <FileSpreadsheet className="h-5 w-5 text-cyan" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Backtest Report</h3>
                  <p className="text-sm text-charcoalTextSecondary">View and analyze Zenflow backtest data</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-charcoalTextSecondary" />
            </Link>
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ZenflowBacktest;
