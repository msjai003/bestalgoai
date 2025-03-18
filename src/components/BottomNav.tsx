
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChartBar, Bell, Settings, PieChart, DollarSign } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-900/95 backdrop-blur-lg py-2 z-40">
      <div className="flex justify-around items-center">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center py-1 px-3 ${
            isActive('/dashboard') ? 'text-[#FF00D4]' : 'text-gray-400'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/performance-metrics"
          className={`flex flex-col items-center py-1 px-3 ${
            isActive('/performance-metrics') ? 'text-[#FF00D4]' : 'text-gray-400'
          }`}
        >
          <ChartBar className="h-5 w-5" />
          <span className="text-xs mt-1">Performance</span>
        </Link>

        <Link
          to="/sell-your-strategy"
          className={`flex flex-col items-center py-1 px-3 ${
            isActive('/sell-your-strategy') ? 'text-[#FF00D4]' : 'text-gray-400'
          }`}
        >
          <DollarSign className="h-5 w-5" />
          <span className="text-xs mt-1">Sell</span>
        </Link>

        <Link
          to="/backtest"
          className={`flex flex-col items-center py-1 px-3 ${
            isActive('/backtest') ? 'text-[#FF00D4]' : 'text-gray-400'
          }`}
        >
          <PieChart className="h-5 w-5" />
          <span className="text-xs mt-1">Backtest</span>
        </Link>

        <Link
          to="/settings"
          className={`flex flex-col items-center py-1 px-3 ${
            isActive('/settings') ? 'text-[#FF00D4]' : 'text-gray-400'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
};
