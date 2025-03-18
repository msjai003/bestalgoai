
import React from 'react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SellYourStrategy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="fixed w-full top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-pink-500"></i>
            <span className="text-lg font-bold">TradePro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/notifications">
              <i className="fa-regular fa-bell text-gray-400"></i>
            </Link>
            <Link to="/settings">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                className="w-8 h-8 rounded-full"
                alt="Profile"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4">
        {/* Strategy Overview Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 shadow-xl border border-gray-800">
            <h1 className="text-2xl font-bold mb-4">Golden Cross Strategy</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Live Trading</span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">Verified</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-green-400">78.5%</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Profit/Loss</p>
                <p className="text-2xl font-bold text-pink-500">+$2,450</p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-8">
          <Card className="bg-gray-800/30 border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Max Drawdown</span>
                  <span className="text-red-400">-12.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sharpe Ratio</span>
                  <span className="text-green-400">2.1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risk-Reward</span>
                  <span className="text-blue-400">1:2.5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Strategy Description */}
        <section className="mb-8">
          <Card className="bg-gray-800/30 border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">About This Strategy</h2>
              <p className="text-gray-300 mb-4">
                The Golden Cross Strategy is a powerful technical indicator that signals a potential bull market. It occurs when a short-term moving average crosses above a long-term moving average.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-green-400"></i>
                  <span className="text-gray-300">Based on 50-day and 200-day moving averages</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-green-400"></i>
                  <span className="text-gray-300">Works on multiple timeframes</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-green-400"></i>
                  <span className="text-gray-300">Clear entry and exit signals</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Action Buttons */}
      <section className="fixed bottom-0 left-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 p-4">
        <div className="flex gap-3">
          <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-6 rounded-xl font-medium">
            Purchase ($299)
          </Button>
          <Button variant="outline" className="w-12 h-12 flex items-center justify-center bg-gray-800 border-gray-700 rounded-xl">
            <i className="fa-regular fa-bookmark text-lg"></i>
          </Button>
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default SellYourStrategy;
