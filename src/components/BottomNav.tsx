
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const BottomNav = () => {
  const location = useLocation();
  const { toast } = useToast();

  return (
    <nav className="fixed bottom-0 w-full bg-gradient-to-t from-black to-gray-900/90 backdrop-blur-md border-t border-gray-800/50 z-50 shadow-lg shadow-black/30">
      <div className="flex justify-around px-4 py-2">
        <Link to="/dashboard" className="flex flex-col items-center p-0.5 transition-all duration-200 hover:scale-105 active:scale-95">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === '/dashboard' ? 'bg-cyan/10 cyan-glow' : 'bg-transparent'}`}>
            <i className={`fa-solid fa-house text-base ${location.pathname === '/dashboard' ? 'text-cyan' : 'text-gray-400'}`}></i>
          </div>
          <span className={`text-[10px] ${location.pathname === '/dashboard' ? 'text-cyan font-medium' : 'text-gray-400'} mt-0.5`}>Home</span>
        </Link>
        
        <Link to="/strategy-management" className="flex flex-col items-center p-0.5 transition-all duration-200 hover:scale-105 active:scale-95">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === '/strategy-management' ? 'bg-cyan/10 cyan-glow' : 'bg-transparent'}`}>
            <i className={`fa-solid fa-chart-simple text-base ${location.pathname === '/strategy-management' ? 'text-cyan' : 'text-gray-400'}`}></i>
          </div>
          <span className={`text-[10px] ${location.pathname === '/strategy-management' ? 'text-cyan font-medium' : 'text-gray-400'} mt-0.5`}>Wishlist</span>
        </Link>
        
        <Link to="/live-trading" className="flex flex-col items-center p-0.5 transition-all duration-200 hover:scale-105 active:scale-95">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === '/live-trading' ? 'bg-cyan/10 cyan-glow' : 'bg-transparent'}`}>
            <i className={`fa-solid fa-chart-line text-base ${location.pathname === '/live-trading' ? 'text-cyan' : 'text-gray-400'}`}></i>
          </div>
          <span className={`text-[10px] ${location.pathname === '/live-trading' ? 'text-cyan font-medium' : 'text-gray-400'} mt-0.5`}>Trading</span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center p-0.5 transition-all duration-200 hover:scale-105 active:scale-95">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === '/settings' ? 'bg-cyan/10 cyan-glow' : 'bg-transparent'}`}>
            <i className={`fa-solid fa-gear text-base ${location.pathname === '/settings' ? 'text-cyan' : 'text-gray-400'}`}></i>
          </div>
          <span className={`text-[10px] ${location.pathname === '/settings' ? 'text-cyan font-medium' : 'text-gray-400'} mt-0.5`}>Settings</span>
        </Link>
      </div>
    </nav>
  );
};
