import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Education', href: '/education' },
    { name: 'About', href: '/about' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    
    <header className="relative z-10 bg-charcoalSecondary border-b border-white/5">
      <nav className="container mx-auto px-4 flex items-center justify-between py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <i className="fa-solid fa-chart-line text-cyan text-xl"></i>
            <span className="ml-2 text-white font-semibold text-lg">BestAlgo.ai</span>
          </Link>
          
          <div className="hidden md:ml-10 md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-cyan'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          {user ? (
            <Link to="/overview">
              <Button variant="gradient" className="hidden md:block">
                Overview
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="gradient" className="hidden md:block">
                Sign In
              </Button>
            </Link>
          )}
          
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoalSecondary border-b border-white/5">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'text-cyan bg-charcoalPrimary/40'
                    : 'text-gray-300 hover:bg-charcoalPrimary/20 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <Link
                to="/overview"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-charcoalPrimary/20 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Overview
              </Link>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-charcoalPrimary/20 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
