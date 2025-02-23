
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
        <Link to="/live-trading" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-chart-simple ${location.pathname === '/live-trading' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Trade</span>
        </Link>
        <Link to="/alerts" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-bell ${location.pathname === '/alerts' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Alerts</span>
        </Link>
        <Link to="/subscription" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-gear ${location.pathname === '/subscription' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
