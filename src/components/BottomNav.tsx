
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-[#1F1F1F] px-6 py-3 border-t border-gray-800/50">
      <div className="flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center">
          <i className={`fa-solid fa-house ${location.pathname === '/dashboard' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className={`text-xs mt-1 ${location.pathname === '/dashboard' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}>Home</span>
        </Link>
        
        <Link to="/strategy-management" className="flex flex-col items-center">
          <i className={`fa-solid fa-chart-line ${location.pathname === '/strategy-management' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className={`text-xs mt-1 ${location.pathname === '/strategy-management' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}>Markets</span>
        </Link>
        
        <Link to="/live-trading" className="flex flex-col items-center">
          <i className={`fa-solid fa-robot ${location.pathname === '/live-trading' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className={`text-xs mt-1 ${location.pathname === '/live-trading' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}>Algos</span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center">
          <i className={`fa-regular fa-user ${location.pathname === '/settings' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}></i>
          <span className={`text-xs mt-1 ${location.pathname === '/settings' ? 'text-[#00BCD4]' : 'text-[#B0B0B0]'}`}>Profile</span>
        </Link>
      </div>
    </nav>
  );
};
