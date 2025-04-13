
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BarChart2, GraduationCap, Bell, User } from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe">
      <div className="h-16 bg-black/60 backdrop-blur-lg border-t border-gray-800/50 shadow-lg">
        <div className="flex justify-around h-full items-center px-4">
          <NavItem 
            to="/dashboard" 
            icon={<Home size={20} />}
            label="Home" 
            isActive={location.pathname === '/dashboard'}
          />
          
          <NavItem 
            to="/strategy-management" 
            icon={<BarChart2 size={20} />}
            label="Strategies" 
            isActive={location.pathname.includes('/strategy')}
          />
          
          <NavItem 
            to="/classes" 
            icon={<GraduationCap size={20} />}
            label="Learn" 
            isActive={location.pathname === '/classes' || location.pathname === '/education'}
          />
          
          <NavItem 
            to="/alerts" 
            icon={<Bell size={20} />}
            label="Alerts" 
            isActive={location.pathname === '/alerts'}
          />
          
          <NavItem 
            to="/settings" 
            icon={<User size={20} />}
            label="Account" 
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
      className={cn(
        "flex flex-col items-center justify-center w-16 transition-all duration-300",
        isActive 
          ? "text-cyan transform scale-105" 
          : "text-gray-300 hover:text-white"
      )}
    >
      <div className={cn(
        "flex items-center justify-center h-9 w-9 rounded-full mb-1 transition-all duration-300",
        isActive 
          ? "bg-cyan/10" 
          : "bg-transparent hover:bg-gray-800/40"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-medium tracking-wide transition-colors duration-300"
      )}>
        {label}
      </span>
    </Link>
  );
};
