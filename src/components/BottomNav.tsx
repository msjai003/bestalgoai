
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const BottomNav = () => {
  const location = useLocation();
  const { toast } = useToast();

  return (
    <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
      <div className="flex justify-around px-6 py-2">
        <Link to="/dashboard" className="flex flex-col items-center p-2 transition-transform duration-200 hover:scale-110 active:scale-95">
          <i className={`fa-solid fa-house ${location.pathname === '/dashboard' ? 'text-[#FF00D4] animate-micro-bounce' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Home</span>
        </Link>
        
        <Link to="/strategy-management" className="flex flex-col items-center p-2 transition-transform duration-200 hover:scale-110 active:scale-95">
          <i className={`fa-solid fa-chart-simple ${location.pathname === '/strategy-management' ? 'text-[#FF00D4] animate-micro-bounce' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Wishlist</span>
        </Link>
        
        <div className="flex flex-col items-center p-2">
          <Link to="/live-trading" className="flex flex-col items-center transition-transform duration-200 hover:scale-110 active:scale-95">
            <i className={`fa-solid fa-chart-line ${location.pathname === '/live-trading' ? 'text-[#FF00D4] animate-micro-bounce' : 'text-gray-500'}`}></i>
            <span className="text-xs text-gray-400 mt-1">Trading</span>
          </Link>
        </div>
        
        <Link to="/settings" className="flex flex-col items-center p-2 transition-transform duration-200 hover:scale-110 active:scale-95">
          <i className={`fa-solid fa-gear ${location.pathname === '/settings' ? 'text-[#FF00D4] animate-micro-bounce' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
