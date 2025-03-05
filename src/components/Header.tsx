
import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Info, BookOpen, HelpCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Latest notifications data
const latestNotifications = [
  {
    id: 1,
    title: "Trade Executed",
    message: "Buy order for RELIANCE completed",
    time: "2 min ago"
  },
  {
    id: 2,
    title: "Price Alert",
    message: "HDFC Bank reached target price",
    time: "15 min ago"
  },
  {
    id: 3,
    title: "AI Strategy Update",
    message: "Your strategy has been optimized",
    time: "1 hour ago"
  }
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/alerts">
                  <Button variant="ghost" size="icon" className="p-2 relative">
                    <Bell className="w-5 h-5 text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF00D4] rounded-full"></span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                align="end" 
                className="w-72 p-0 bg-gray-800 border-gray-700 text-gray-100"
              >
                <div className="flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium text-sm">Recent Notifications</h3>
                    <Link to="/alerts" className="text-[#FF00D4] text-xs hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {latestNotifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 border-b border-gray-700/50 hover:bg-gray-700/30">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-gray-400">{notification.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
