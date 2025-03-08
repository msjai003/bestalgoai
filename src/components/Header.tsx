
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X, Info, BookOpen, HelpCircle, Bell, Check, Settings, Package, Users, FileText, LogOut, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

// Latest notifications data
const latestNotifications = [
  {
    id: 1,
    title: "Trade Executed",
    message: "Your order #12345 has been executed successfully",
    time: "2 min ago"
  },
  {
    id: 2,
    title: "Price Alert",
    message: "HDFC Bank reached target price of ₹1,680",
    time: "15 min ago"
  },
  {
    id: 3,
    title: "AI Strategy Update",
    message: "Your strategy has been optimized based on market conditions",
    time: "1 hour ago"
  },
  {
    id: 4,
    title: "Account Security",
    message: "Your account security settings were updated",
    time: "2 hours ago"
  },
  {
    id: 5,
    title: "New Feature",
    message: "Enhanced risk management tools are now available!",
    time: "1 day ago"
  }
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Create a global variable to store the install prompt event
declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(latestNotifications);
  const [isAllRead, setIsAllRead] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone || 
                         document.referrer.includes('android-app://');
    
    setIsInstalled(isStandalone);
    
    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
      // Flag that we can install the app
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      // Clear the deferredPrompt variable
      window.deferredInstallPrompt = null;
      // Update states
      setIsInstallable(false);
      setIsInstalled(true);
      // Show success message
      toast.success("App installed successfully!");
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const markAllAsRead = () => {
    setIsAllRead(true);
  };

  const handleInstall = async () => {
    if (!window.deferredInstallPrompt) return;
    
    // Show the install prompt
    window.deferredInstallPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await window.deferredInstallPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast.success("Installation started");
      window.deferredInstallPrompt = null;
      setIsInstallable(false);
    } else {
      toast.info("Installation declined");
    }
    
    setIsOpen(false);
  };

  const hasUnreadNotifications = !isAllRead && notifications.length > 0;

  // Only show install option if the app is installable and not already installed
  const showInstallOption = isInstallable && !isInstalled;

  return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMenu}
          className="p-2"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-gray-300" />
          ) : (
            <Menu className="w-5 h-5 text-gray-300" />
          )}
        </Button>

        <Link to="/" className="flex items-center space-x-2">
          <i className="fa-solid fa-robot text-[#FF00D4]"></i>
          <span className="text-white font-bold">BestAlgo.ai</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 relative">
                <Bell className="w-5 h-5 text-gray-300" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF00D4] rounded-full"></span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 bg-gray-900 border-gray-800 text-white">
              <div className="flex flex-col max-h-[80vh]">
                <div className="sticky top-0 px-6 py-4 border-b border-gray-800 bg-gray-900 z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">Notifications</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-[#FF00D4] transition-colors"
                        onClick={markAllAsRead}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        <span className="text-xs">Mark all as read</span>
                      </Button>
                      <Link to="/settings">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#FF00D4]">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {notifications.length > 0 ? (
                  <ScrollArea className="flex-1 max-h-[60vh]">
                    <div className="divide-y divide-gray-800">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="px-6 py-4 hover:bg-gray-800/50 transition-colors">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <span className="text-xs text-gray-400">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                      <Check className="w-6 h-6 text-[#FF00D4]" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">You're all caught up!</h3>
                    <p className="text-sm text-gray-400">No new notifications.</p>
                  </div>
                )}
                
                <div className="sticky bottom-0 border-t border-gray-800 p-4 bg-gray-900">
                  <Link to="/alerts">
                    <Button className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white hover:opacity-90 transition-opacity">
                      View All Notifications
                    </Button>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <img 
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-64 bg-gray-900/95 backdrop-blur-lg border-r border-b border-gray-800 rounded-br-lg shadow-xl animate-in slide-in-from-left duration-200">
          <nav className="p-4">
            <ul className="space-y-2">
              {showInstallOption && (
                <MenuLink 
                  to="#" 
                  icon={<Download className="w-5 h-5" />} 
                  label="Install App" 
                  onClick={handleInstall} 
                />
              )}
              <MenuLink 
                to="/about" 
                icon={<Info className="w-5 h-5" />} 
                label="About us" 
                onClick={() => setIsOpen(false)} 
              />
              <MenuLink 
                to="/blog" 
                icon={<BookOpen className="w-5 h-5" />} 
                label="Blogs" 
                onClick={() => setIsOpen(false)} 
              />
              <MenuLink 
                to="/support" 
                icon={<HelpCircle className="w-5 h-5" />} 
                label="Support" 
                onClick={() => setIsOpen(false)} 
              />
              <MenuLink 
                to="/products" 
                icon={<Package className="w-5 h-5" />} 
                label="Products" 
                onClick={() => setIsOpen(false)} 
              />
              <MenuLink 
                to="/partners" 
                icon={<Users className="w-5 h-5" />} 
                label="Partners" 
                onClick={() => setIsOpen(false)} 
              />
              <MenuLink 
                to="/terms" 
                icon={<FileText className="w-5 h-5" />} 
                label="Legal / Terms & Privacy" 
                onClick={() => setIsOpen(false)} 
              />
              <MenuLink 
                to="/logout" 
                icon={<LogOut className="w-5 h-5" />} 
                label="Logout" 
                onClick={() => setIsOpen(false)} 
              />
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

interface MenuLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const MenuLink = ({ to, icon, label, onClick }: MenuLinkProps) => (
  <li>
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "text-gray-300 hover:text-white hover:bg-gray-800",
        "transition-colors duration-200"
      )}
      onClick={onClick}
    >
      <span className="text-[#FF00D4]">{icon}</span>
      <span>{label}</span>
    </Link>
  </li>
);
