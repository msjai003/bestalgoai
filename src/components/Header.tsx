
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Download } from 'lucide-react';
import { BeforeInstallPromptEvent } from '@/types/installation';
import { toast } from 'sonner';
import InstallButton from '@/components/install/InstallButton';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || 
                          document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstallable(false);
      return;
    }
    
    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      const promptEvent = e as BeforeInstallPromptEvent;
      window.deferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check for iOS and Android
    const userAgent = navigator.userAgent || '';
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroidDevice = /Android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    
    if (isIOSDevice && !isStandalone) {
      setIsInstallable(true);
    }

    if (isAndroidDevice && !isStandalone) {
      setIsInstallable(true);
    }

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      // Clear the prompt
      window.deferredInstallPrompt = null;
      setDeferredPrompt(null);
      setIsInstallable(false);
      // Show success message
      toast.success("App installed successfully!");
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);
  
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
            
            {isInstallable && (
              <button
                className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => {
                  if (window.showInstallPrompt) {
                    window.showInstallPrompt();
                  }
                }}
              >
                <Download className="mr-1 h-4 w-4" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isInstallable && (
            <div className="hidden sm:block md:hidden">
              <InstallButton 
                isIOS={isIOS} 
                isAndroid={isAndroid} 
                deferredPrompt={deferredPrompt}
                className="text-sm hover:text-white flex items-center"
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </InstallButton>
            </div>
          )}
          
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
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isInstallable && (
              <InstallButton 
                isIOS={isIOS} 
                isAndroid={isAndroid} 
                deferredPrompt={deferredPrompt}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-charcoalPrimary/20 hover:text-white flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Download <Download className="h-4 w-4 inline ml-1" />
              </InstallButton>
            )}
            
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
