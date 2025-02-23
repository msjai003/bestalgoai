
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LiveTrading = () => {
  const [selectedStock, setSelectedStock] = useState("NIFTY");
  const [timeFrame, setTimeFrame] = useState("1D");
  const [isActive, setIsActive] = useState(false);

  const handleTradingToggle = () => {
    setIsActive(!isActive);
  };

  const instruments = ["NIFTY", "BANKNIFTY", "FINNIFTY", "SENSEX", "MIDCPNIFTY"];

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <i className="fa-solid fa-arrow-left text-gray-300"></i>
          </Link>
          <h1 className="text-white text-lg font-medium">Live Trading</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-gray-300"></i>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-gray-800/50 p-1 rounded-xl mt-4 mb-6">
          <button className="w-full bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Algo Trading
          </button>
        </div>

        <section className="space-y-4 mb-6">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Active Strategy</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#FF00D4] font-medium">Short Straddle</span>
                  <i className="fa-solid fa-chevron-right text-xs text-gray-400"></i>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Selected Instrument</span>
                <Select value={selectedStock} onValueChange={setSelectedStock}>
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
                <span className="text-gray-300 text-sm">Time Frame</span>
                <div className="flex items-center gap-2 text-white">
                  <span>{timeFrame}</span>
                  <i className="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Status</span>
                <div className="flex items-center gap-2">
                  <span className={isActive ? "text-emerald-400" : "text-red-400"}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Current P&L</p>
                <p className="text-emerald-400 text-lg font-semibold">+₹8,450</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                <p className="text-white text-lg font-semibold">72%</p>
              </div>
            </div>
            <div className="space-y-3">
              {!isActive ? (
                <Button 
                  className="w-full bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white py-6 rounded-lg font-medium shadow-lg"
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
