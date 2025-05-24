import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { installApp } from '@/services/downloadService';

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
    { 
      name: 'Download', 
      href: '#',
      icon: <Download className="h-4 w-4 mr-1" />,
      onClick: handleDownloadApp
    },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Function to handle app download/installation
  async function handleDownloadApp(e: React.MouseEvent) {
    e.preventDefault();
    
    try {
      const result = await installApp();
      // The toast messages are now handled inside the installApp function
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download the app. Please try again later.');
    }
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  return (
    <header className="relative z-10 bg-charcoalSecondary border-b border-white/5">
      <nav className="container mx-auto px-4 flex items-center justify-between py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/1310710b-b366-4b7d-a379-833f2f156d51.png" 
              alt="BestAlgo.ai Logo" 
              className="h-10 w-auto" // Increased height from h-6 to h-10
            />
            <span className="ml-2 text-white font-semibold text-lg">BestAlgo.ai</span>
          </Link>
          
          <div className="hidden md:ml-10 md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                  isActive(item.href)
                    ? 'text-cyan'
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={item.onClick}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {user ? (
            <Link to="/dashboard">
              <Button variant="gradient" className="hidden md:block">
                Dashboard
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
      
      {/* Mobile menu */}
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
                } flex items-center`}
                onClick={(e) => {
                  if (item.onClick) item.onClick(e);
                  else setMobileMenuOpen(false);
                }}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-charcoalPrimary/20 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
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
