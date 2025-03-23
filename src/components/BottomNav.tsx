
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const BottomNav = () => {
  const location = useLocation();
  const { toast } = useToast();

  return (
    <nav className="fixed bottom-0 w-full bg-[#1F1F1F] border-t border-gray-800 z-50">
      <div className="flex justify-around px-6 py-2">
        <Link to="/dashboard" className="flex flex-col items-center p-2 transition-transform duration-200 hover:scale-110 active:scale-95">
          <i className={`fa-solid fa-house ${location.pathname === '/dashboard' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className="text-xs text-[#B0B0B0] mt-1">Home</span>
        </Link>
        
        <Link to="/strategy-management" className="flex flex-col items-center p-2 transition-transform duration-200 hover:scale-110 active:scale-95">
          <i className={`fa-solid fa-chart-simple ${location.pathname === '/strategy-management' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className="text-xs text-[#B0B0B0] mt-1">Wishlist</span>
        </Link>
        
        <Link to="/live-trading" className="flex flex-col items-center p-2 transition-transform duration-200 hover:scale-110 active:scale-95">
          <i className={`fa-solid fa-chart-line ${location.pathname === '/live-trading' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className="text-xs text-[#B0B0B0] mt-1">Trading</span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center p-2 transition-transform duration-200 hover:scale-110 active:scale-95">
          <i className={`fa-solid fa-gear ${location.pathname === '/settings' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className="text-xs text-[#B0B0B0] mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
