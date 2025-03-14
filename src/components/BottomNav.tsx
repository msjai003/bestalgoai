
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
      <div className="flex justify-around px-6 py-2">
        <Link to="/dashboard" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-house ${location.pathname === '/dashboard' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Home</span>
        </Link>
        <Link to="/wishlist" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-heart ${location.pathname === '/wishlist' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Wishlist</span>
        </Link>
        <Link to="/live-trading" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-chart-line ${location.pathname === '/live-trading' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Trading</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-gear ${location.pathname === '/settings' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
