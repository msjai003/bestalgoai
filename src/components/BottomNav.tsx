
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, GraduationCap, Settings, User } from 'lucide-react';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-charcoalSecondary border-t border-gray-800 flex justify-around items-center px-4 z-50">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex flex-col items-center px-3 py-2 ${isActive ? 'text-cyan' : 'text-gray-400 hover:text-gray-200'}`
        }
        end
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </NavLink>
      
      <NavLink 
        to="/trading" 
        className={({ isActive }) => 
          `flex flex-col items-center px-3 py-2 ${isActive ? 'text-cyan' : 'text-gray-400 hover:text-gray-200'}`
        }
      >
        <BarChart2 className="h-5 w-5" />
        <span className="text-xs mt-1">Trading</span>
      </NavLink>
      
      <NavLink 
        to="/education" 
        className={({ isActive }) => 
          `flex flex-col items-center px-3 py-2 ${isActive ? 'text-cyan' : 'text-gray-400 hover:text-gray-200'}`
        }
      >
        <GraduationCap className="h-5 w-5" />
        <span className="text-xs mt-1">Learn</span>
      </NavLink>
      
      <NavLink 
        to="/settings" 
        className={({ isActive }) => 
          `flex flex-col items-center px-3 py-2 ${isActive ? 'text-cyan' : 'text-gray-400 hover:text-gray-200'}`
        }
      >
        <Settings className="h-5 w-5" />
        <span className="text-xs mt-1">Settings</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => 
          `flex flex-col items-center px-3 py-2 ${isActive ? 'text-cyan' : 'text-gray-400 hover:text-gray-200'}`
        }
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </NavLink>
    </div>
  );
};
