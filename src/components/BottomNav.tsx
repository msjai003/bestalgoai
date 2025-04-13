
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
        "bottom-nav-item",
        isActive ? "scale-100" : "opacity-80 hover:opacity-100"
      )}
    >
      <div className={cn(
        "bottom-nav-icon",
        isActive 
          ? "bg-transparent" 
          : "bg-transparent hover:bg-cyan/5"
      )}>
        <div className={cn(
          isActive ? "text-cyan" : "text-gray-300 hover:text-cyan transition-colors"
        )}>
          {icon}
        </div>
      </div>
      <span className={cn(
        "bottom-nav-label",
        isActive ? "text-cyan" : "text-gray-300"
      )}>
        {label}
      </span>
    </Link>
  );
};
