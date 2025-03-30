
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();
  const { toast } = useToast();

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe">
      <div className="h-16 bg-black/60 backdrop-blur-lg border-t border-gray-800/50">
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
        "flex flex-col items-center w-16 transition-all duration-300",
        isActive ? "scale-100" : "opacity-80 hover:opacity-100"
      )}
    >
      <div className={cn(
        "flex items-center justify-center h-9 w-9 rounded-full mb-1 transition-all duration-300",
        isActive 
          ? "bg-transparent" 
          : "bg-transparent hover:bg-cyan/5"
      )}>
        <i className={cn(
          "fa-solid", 
          icon, 
          isActive ? "text-cyan" : "text-gray-300 hover:text-cyan transition-colors"
        )}></i>
      </div>
      <span className={cn(
        "text-[10px] font-medium tracking-wide transition-all duration-300",
        isActive ? "text-cyan" : "text-gray-300"
      )}>
        {label}
      </span>
    </Link>
  );
};
