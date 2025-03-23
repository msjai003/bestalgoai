
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();
  const { toast } = useToast();

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe">
      <div className="h-16 bg-gradient-to-t from-gray-900 to-gray-900/95 backdrop-blur-md border-t border-gray-800/40 shadow-lg">
        <div className="flex justify-around h-full items-center px-4">
          <NavItem 
            to="/dashboard" 
            icon="fa-house" 
            label="Home" 
            isActive={location.pathname === '/dashboard'}
          />
          
          <NavItem 
            to="/strategy-management" 
            icon="fa-chart-simple" 
            label="Wishlist" 
            isActive={location.pathname === '/strategy-management'}
          />
          
          <NavItem 
            to="/live-trading" 
            icon="fa-chart-line" 
            label="Trading" 
            isActive={location.pathname === '/live-trading'}
          />
          
          <NavItem 
            to="/settings" 
            icon="fa-gear" 
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
  icon: string; 
  label: string; 
  isActive: boolean;
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center w-16 transition-all duration-200",
        isActive ? "scale-105" : "opacity-80"
      )}
    >
      <div className={cn(
        "flex items-center justify-center h-9 w-9 rounded-full mb-1 transition-all",
        isActive 
          ? "bg-[#00BCD4]/10 shadow-[0_0_8px_rgba(0,188,212,0.3)]" 
          : "bg-transparent"
      )}>
        <i className={cn(
          "fa-solid", 
          icon, 
          isActive ? "text-[#00BCD4]" : "text-[#B0B0B0]"
        )}></i>
      </div>
      <span className={cn(
        "text-[10px] font-medium tracking-wide",
        isActive ? "text-[#00BCD4]" : "text-[#B0B0B0]"
      )}>
        {label}
      </span>
    </Link>
  );
};
