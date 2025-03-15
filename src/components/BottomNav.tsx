
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export const BottomNav = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isPaperMode, setIsPaperMode] = useState(false);

  const handleTradingModeChange = (checked: boolean) => {
    setIsPaperMode(checked);
    toast({
      title: checked ? "Paper Trading Mode" : "Live Trading Mode",
      description: `Switched to ${checked ? "paper" : "live"} trading mode`,
      variant: checked ? "default" : "destructive",
    });
  };

  return (
    <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
      <div className="flex justify-around px-6 py-2">
        <Link to="/dashboard" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-house ${location.pathname === '/dashboard' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Home</span>
        </Link>
        
        <Link to="/strategy-management" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-chart-simple ${location.pathname === '/strategy-management' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Wishlist</span>
        </Link>
        
        <div className="flex flex-col items-center p-2">
          <Link to="/live-trading" className="flex flex-col items-center">
            <i className={`fa-solid fa-chart-line ${location.pathname === '/live-trading' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
            <span className="text-xs text-gray-400 mt-1">Trading</span>
          </Link>
          
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] ${!isPaperMode ? 'text-white font-semibold' : 'text-gray-400'}`}>Live</span>
            <Switch 
              checked={isPaperMode}
              onCheckedChange={handleTradingModeChange}
              className={`h-3 w-7 ${isPaperMode ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className={`text-[10px] ${isPaperMode ? 'text-green-400 font-semibold' : 'text-gray-400'}`}>Paper</span>
          </div>
        </div>
        
        <Link to="/settings" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-gear ${location.pathname === '/settings' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
