
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, GraduationCap, LineChart, Settings } from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-16 bg-black bg-opacity-95 backdrop-blur-md border-t border-gray-800/50">
        <div className="flex justify-between h-full items-center px-6">
          <NavItem 
            to="/dashboard" 
            icon={<Home size={22} />} 
            label="Home" 
            isActive={location.pathname === '/dashboard'}
          />
          
          <NavItem 
            to="/strategy-management" 
            icon={<Heart size={22} />}
            label="Wishlist" 
            isActive={location.pathname === '/strategy-management'}
          />
          
          <NavItem 
            to="/classes" 
            icon={<GraduationCap size={22} />}
            label="Classes" 
            isActive={location.pathname === '/classes'}
          />
          
          <NavItem 
            to="/live-trading" 
            icon={<LineChart size={22} />}
            label="Trading" 
            isActive={location.pathname === '/live-trading'}
          />
          
          <NavItem 
            to="/settings" 
            icon={<Settings size={22} />}
            label="Settings" 
            isActive={location.pathname === '/settings'}
          />
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ 
  to, 
  icon, 
  label, 
  isActive 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
}) => {
  return (
    <Link 
      to={to} 
      className="flex flex-col items-center"
    >
      <div className={`flex items-center justify-center h-6 w-6 mb-1 ${isActive ? 'text-cyan' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-xs ${isActive ? 'text-cyan' : 'text-gray-500'}`}>
        {label}
      </span>
    </Link>
  );
};
