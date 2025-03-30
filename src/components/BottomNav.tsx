import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookText, BarChart2, Settings } from 'lucide-react';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoalSecondary border-t border-white/10 backdrop-blur-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-3 ${
              isActive ? 'text-cyan' : 'text-gray-400'
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </NavLink>
        
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-3 ${
              isActive ? 'text-cyan' : 'text-gray-400'
            }`
          }
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/learn"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-3 ${
              isActive ? 'text-cyan' : 'text-gray-400'
            }`
          }
        >
          <BookText className="h-5 w-5" />
          <span className="text-xs mt-1">Learn</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-3 ${
              isActive ? 'text-cyan' : 'text-gray-400'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </NavLink>
      </div>
    </div>
  );
};
