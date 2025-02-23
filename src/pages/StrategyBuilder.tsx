
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Calendar } from "lucide-react";

const StrategyBuilder = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <i className="fa-solid fa-arrow-left text-gray-300"></i>
          </Link>
          <h1 className="text-white text-lg font-medium">Strategy Builder</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-gray-300"></i>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-gray-800/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <Link to="/backtest" className="text-gray-400 py-2 px-4 rounded-lg text-sm font-medium text-center">
              Backtesting
            </Link>
            <button className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white py-2 px-4 rounded-lg text-sm font-medium">
              Strategy Builder
            </button>
          </div>
        </div>

        <section className="space-y-4 mb-6">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-white font-medium">Strategy Parameters</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Entry Condition</span>
                    <div className="flex items-center gap-2 text-white">
                      <span>MA Crossover</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Exit Condition</span>
                    <div className="flex items-center gap-2 text-white">
                      <span>Stop Loss</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Risk Management</span>
                    <div className="flex items-center gap-2 text-white">
                      <span>2% per trade</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                to="/backtest"
                className="block w-full bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white py-3 rounded-lg font-medium shadow-lg text-center"
              >
                Test Strategy
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default StrategyBuilder;
