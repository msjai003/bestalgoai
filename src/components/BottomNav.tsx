
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const BottomNav = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isPaperMode, setIsPaperMode] = useState(false);

  // Load initial trading mode from localStorage when component mounts
  useEffect(() => {
    const savedMode = localStorage.getItem('tradingMode');
    if (savedMode) {
      setIsPaperMode(savedMode === 'paper');
    }
  }, []);

  const handleTradingModeChange = () => {
    const newMode = !isPaperMode;
    setIsPaperMode(newMode);
    // Save mode to localStorage
    localStorage.setItem('tradingMode', newMode ? 'paper' : 'live');
    
    toast({
      title: newMode ? "Paper Trading Mode" : "Live Trading Mode",
      description: `Switched to ${newMode ? "paper" : "live"} trading mode`,
      variant: newMode ? "default" : "destructive",
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleTradingModeChange}
            className={`text-[10px] mt-1 h-6 px-2 py-0 rounded-full ${
              isPaperMode 
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }`}
          >
            {isPaperMode ? "Paper Mode" : "Live Mode"}
          </Button>
        </div>
        
        <Link to="/settings" className="flex flex-col items-center p-2">
          <i className={`fa-solid fa-gear ${location.pathname === '/settings' ? 'text-[#FF00D4]' : 'text-gray-500'}`}></i>
          <span className="text-xs text-gray-400 mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
