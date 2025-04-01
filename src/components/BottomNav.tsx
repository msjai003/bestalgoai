import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, UserCircle, Bot } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const links = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Learn", icon: BookOpen, path: "/education" },
    { name: "Strategies", icon: TrendingUp, path: "/strategy-management" },
    { name: "AI", icon: Bot, path: "/ai-trading" }, // Add this new link
    { name: "Account", icon: UserCircle, path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-50">
      <ul className="flex items-center justify-around h-16">
        {links.map((link) => (
          <li key={link.name}>
            <Link to={link.path} className="flex flex-col items-center justify-center text-gray-400 hover:text-white">
              <link.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
