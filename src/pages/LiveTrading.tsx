
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { TradingModeFilter } from "@/components/strategy/TradingModeFilter";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { ToggleLeft, ToggleRight } from "lucide-react";

type TradingModeOption = "all" | "live" | "paper";

const LiveTrading = () => {
  const [selectedStock, setSelectedStock] = useState("NIFTY");
  const [timeFrame, setTimeFrame] = useState("1D");
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<TradingModeOption>("all");
  const [strategies, setStrategies] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [targetStrategyId, setTargetStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);

  useEffect(() => {
    const storedStrategies = localStorage.getItem('wishlistedStrategies');
    if (storedStrategies) {
      try {
        const parsedStrategies = JSON.parse(storedStrategies);
        setStrategies(parsedStrategies);
      } catch (error) {
        console.error("Error parsing wishlisted strategies:", error);
        setStrategies([]);
      }
    }
  }, []);

  const handleTradingToggle = () => {
    setIsActive(!isActive);
    
    toast({
      title: !isActive ? "Trading started" : "Trading stopped",
      description: !isActive ? "Your strategies are now actively trading" : "Your strategies are now paused",
    });
  };

  const handleModeChange = (mode: TradingModeOption) => {
    setSelectedMode(mode);
  };

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      setTargetStrategyId(id);
      setTargetMode(strategy.isLive ? 'paper' : 'live');
      setShowConfirmationDialog(true);
    }
  };

  const confirmModeChange = () => {
    if (targetStrategyId === null || targetMode === null) return;
    
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === targetStrategyId) {
        const newLiveStatus = targetMode === 'live';
        return { ...strategy, isLive: newLiveStatus };
      }
      return strategy;
    });
    
    setStrategies(updatedStrategies);
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    
    const strategy = strategies.find(s => s.id === targetStrategyId);
    if (strategy) {
      toast({
        title: targetMode === 'live' ? "Switched to live trading" : "Switched to paper trading",
        description: `Strategy "${strategy.name}" is now in ${targetMode} trading mode`,
      });
    }
    
    setShowConfirmationDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
  };

  const cancelModeChange = () => {
    setShowConfirmationDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
  };

  const instruments = ["NIFTY", "BANKNIFTY", "FINNIFTY", "SENSEX", "MIDCPNIFTY"];

  const filteredStrategies = selectedMode === "all" 
    ? strategies 
    : strategies.filter(strategy => 
        (selectedMode === "live" && strategy.isLive) || 
        (selectedMode === "paper" && !strategy.isLive)
      );

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Live Trading</h1>
        </div>

        <div className="mb-6">
          <TradingModeFilter 
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />
        </div>

        <section className="space-y-4 mb-6">
          {filteredStrategies.length > 0 ? (
            filteredStrategies.map(strategy => (
              <div key={strategy.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{strategy.name}</span>
                  <div className={`${strategy.isLive ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'} px-2 py-1 rounded-md text-xs font-medium`}>
                    {strategy.isLive ? 'Live Trading' : 'Paper Trading'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Current P&L</p>
                    <p className="text-emerald-400 text-lg font-semibold">{strategy.pnl || "+₹0"}</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-gray-800/50 p-3 rounded-lg cursor-pointer" onClick={() => navigate('/backtest-report')}>
                          <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                          <p className="text-white text-lg font-semibold">{strategy.successRate || "N/A"}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white border-gray-700">
                        <p>Based on latest backtest results</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Selected Instrument</span>
                    <Select defaultValue={strategy.instrument || "NIFTY"}>
                      <SelectTrigger className="w-[140px] bg-transparent border-0 text-white focus:ring-0">
                        <SelectValue placeholder="Select Instrument" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {instruments.map((instrument) => (
                          <SelectItem 
                            key={instrument} 
                            value={instrument}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            {instrument}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Status</span>
                    <div className="flex items-center gap-2">
                      <span className={strategy.isLive ? "text-emerald-400" : "text-red-400"}>
                        {strategy.isLive ? "Active" : "Inactive"}
                      </span>
                      {strategy.isLive && (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 text-sm">Paper Trading</span>
                    <Switch
                      id={`mode-switch-${strategy.id}`}
                      checked={strategy.isLive}
                      onCheckedChange={() => handleToggleLiveMode(strategy.id)}
                      className={`${strategy.isLive ? 'bg-green-500' : 'bg-blue-500'} data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-blue-500`}
                    />
                    <span className="text-gray-300 text-sm">Live Trading</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleLiveMode(strategy.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {strategy.isLive ? (
                            <ToggleRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-blue-400" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Switch to {strategy.isLive ? 'paper' : 'live'} trading</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 shadow-lg text-center">
              <p className="text-gray-400 mb-4">No strategies found in your wishlist.</p>
              <Button
                onClick={() => navigate('/strategy-selection')}
                className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white"
              >
                Add Strategies
              </Button>
            </div>
          )}
        </section>

        {filteredStrategies.length > 0 && (
          <section className="space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
              <div className="space-y-3">
                {!isActive ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity"
                    onClick={handleTradingToggle}
                  >
                    Square off all
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full border-gray-700 text-gray-400 py-6 rounded-lg font-medium"
                    onClick={handleTradingToggle}
                  >
                    Stop All Trading
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <BottomNav />
      
      <TradingModeConfirmationDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
        targetMode={targetMode}
        onConfirm={confirmModeChange}
        onCancel={cancelModeChange}
      />
    </div>
  );
};

export default LiveTrading;
