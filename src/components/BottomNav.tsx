import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, BarChart2, User, GraduationCap } from 'lucide-react';

export const BottomNav = () => {
  const { pathname } = useLocation();
  const activeColor = 'text-cyan';
  const normalColor = 'text-gray-400';
  
  return (
    <nav className="fixed z-50 w-full h-16 bg-charcoalSecondary border-t border-gray-800 bottom-0 left-0 flex items-center justify-around px-4">
      <Link to="/" className="flex flex-col items-center gap-1">
        <Home className={`h-5 w-5 ${pathname === '/' ? activeColor : normalColor}`} />
        <span className="text-xs font-medium">Home</span>
      </Link>
      
      <Link to="/search" className="flex flex-col items-center gap-1">
        <Search className={`h-5 w-5 ${pathname === '/search' ? activeColor : normalColor}`} />
        <span className="text-xs font-medium">Search</span>
      </Link>
      
      <Link to="/trading-academy" className="flex flex-col items-center gap-1">
        <GraduationCap className={`h-5 w-5 ${pathname === '/trading-academy' ? activeColor : normalColor}`} />
        <span className="text-xs font-medium">Academy</span>
      </Link>

      <Link to="/leaderboard" className="flex flex-col items-center gap-1">
        <BarChart2 className={`h-5 w-5 ${pathname === '/leaderboard' ? activeColor : normalColor}`} />
        <span className="text-xs font-medium">Leaderboard</span>
      </Link>
      
      <Link to="/profile" className="flex flex-col items-center gap-1">
        <User className={`h-5 w-5 ${pathname === '/profile' ? activeColor : normalColor}`} />
        <span className="text-xs font-medium">Profile</span>
      </Link>
    </nav>
  );
};
