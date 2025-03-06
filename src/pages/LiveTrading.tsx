
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { TradingModeFilter } from "@/components/strategy/TradingModeFilter";
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

type TradingModeOption = "all" | "live" | "paper";

const LiveTrading = () => {
  const [selectedStock, setSelectedStock] = useState("NIFTY");
  const [timeFrame, setTimeFrame] = useState("1D");
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<TradingModeOption>("all");
  const navigate = useNavigate();

  const handleTradingToggle = () => {
    setIsActive(!isActive);
  };

  const handleModeChange = (mode: TradingModeOption) => {
    setSelectedMode(mode);
  };

  const instruments = ["NIFTY", "BANKNIFTY", "FINNIFTY", "SENSEX", "MIDCPNIFTY"];

  // Mock strategies data - in a real app, this would come from an API or state
  const strategies = [
    { id: 1, name: "Short Straddle", isLive: true, pnl: "+₹8,450", successRate: "68%" },
    { id: 2, name: "Long Iron Condor", isLive: false, pnl: "+₹4,250", successRate: "73%" },
    { id: 3, name: "Bull Call Spread", isLive: true, pnl: "+₹2,830", successRate: "62%" },
    { id: 4, name: "Bear Put Spread", isLive: false, pnl: "+₹5,120", successRate: "58%" }
  ];

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
          {filteredStrategies.map(strategy => (
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
                  <p className="text-emerald-400 text-lg font-semibold">{strategy.pnl}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-gray-800/50 p-3 rounded-lg cursor-pointer" onClick={() => navigate('/backtest-report')}>
                        <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                        <p className="text-white text-lg font-semibold">{strategy.successRate}</p>
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
                  <Select defaultValue="NIFTY">
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
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="space-y-3">
              {!isActive ? (
                <Button 
                  className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity"
                  onClick={handleTradingToggle}
                >
                  Start Trading
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full border-gray-700 text-gray-400 py-6 rounded-lg font-medium"
                  onClick={handleTradingToggle}
                >
                  Stop Trading
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default LiveTrading;
