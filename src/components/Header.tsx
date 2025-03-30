
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, X, Star } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-charcoalSecondary border-b border-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Left Side */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center font-bold text-lg text-white">
            BestAlgo.ai
          </NavLink>
        </div>
      
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Home
          </NavLink>
          
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Dashboard
          </NavLink>

          {user && (
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'bg-cyan/10 text-cyan'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Star className="h-4 w-4" /> Wishlist
            </NavLink>
          )}
          
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Learn
          </NavLink>
          
          {user ? (
            <Button variant="outline" size="sm" className="rounded-full font-medium border-cyan/40 text-cyan hover:bg-cyan/10" onClick={signOut}>
              Sign Out
            </Button>
          ) : (
            <NavLink
              to="/auth"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Sign In
            </NavLink>
          )}
        </nav>
      
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>
          
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>

          {user && (
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan/10 text-cyan'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              <Star className="h-4 w-4" /> Wishlist
            </NavLink>
          )}
          
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            Learn
          </NavLink>
          
          {user ? (
            <Button variant="outline" size="sm" className="rounded-full font-medium border-cyan/40 text-cyan hover:bg-cyan/10 w-full" onClick={() => { signOut(); closeMenu(); }}>
              Sign Out
            </Button>
          ) : (
            <NavLink
              to="/auth"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={closeMenu}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
