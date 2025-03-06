
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, AlertTriangle, Info, Play, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { CustomStrategyForm } from "@/components/strategy/CustomStrategyForm";
import { predefinedStrategies } from "@/constants/strategy-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const StrategySelection = () => {
  const [selectedTab, setSelectedTab] = useState<"predefined" | "custom">("predefined");
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [showStrategyDetails, setShowStrategyDetails] = useState(false);

  const handleStrategySelect = (strategy: any) => {
    setSelectedStrategy(strategy);
    setShowStrategyDetails(true);
  };

  const handleDeployStrategy = () => {
    // Navigate to backtest or live trading
    window.location.href = "/backtest";
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20">
        <section className="px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Strategy Selection</h1>
          
          {/* Tab Selection */}
          <div className="bg-gray-800/50 p-1 rounded-xl mb-6">
            <div className="grid grid-cols-2 gap-1">
              <button 
                className={`py-2 px-4 rounded-lg text-sm font-medium text-center ${
                  selectedTab === "predefined" 
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white" 
                    : "text-gray-400"
                }`}
                onClick={() => setSelectedTab("predefined")}
              >
                Predefined Strategies
              </button>
              <button 
                className={`py-2 px-4 rounded-lg text-sm font-medium text-center ${
                  selectedTab === "custom" 
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white" 
                    : "text-gray-400"
                }`}
                onClick={() => setSelectedTab("custom")}
              >
                Custom Strategy
              </button>
            </div>
          </div>
          
          {/* Strategy Content */}
          <div className="space-y-4">
            {selectedTab === "predefined" ? (
              <div className="grid grid-cols-1 gap-4">
                {predefinedStrategies.map((strategy) => (
                  <StrategyCard 
                    key={strategy.id}
                    strategy={strategy}
                    onSelect={() => handleStrategySelect(strategy)}
                  />
                ))}
              </div>
            ) : (
              <CustomStrategyForm onSubmit={handleDeployStrategy} />
            )}
          </div>
        </section>
      </main>
      
      {/* Strategy Details Dialog */}
      <Dialog open={showStrategyDetails} onOpenChange={setShowStrategyDetails}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{selectedStrategy?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Review strategy details before deployment
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4 overflow-auto max-h-[60vh]">
            <p className="text-gray-300">{selectedStrategy?.description}</p>
            
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">Performance Summary</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Win Rate</p>
                  <p className="text-white font-semibold">{selectedStrategy?.performance?.winRate}</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Avg Profit</p>
                  <p className="text-green-400 font-semibold">{selectedStrategy?.performance?.avgProfit}</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Drawdown</p>
                  <p className="text-red-400 font-semibold">{selectedStrategy?.performance?.drawdown}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">Parameters</h4>
              <div className="space-y-2">
                {selectedStrategy?.parameters?.map((param: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">{param.name}</span>
                    <span className="text-white">{param.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 bg-gray-700/30 p-3 rounded-lg">
              <Info className="h-5 w-5 text-blue-400" />
              <p className="text-gray-300 text-sm">This strategy uses machine learning algorithms to identify market trends and execute trades accordingly.</p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-700 mt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowStrategyDetails(false)}
              className="w-full sm:w-auto bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeployStrategy}
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white hover:from-[#FF00D4]/90 hover:to-[#FF00D4]/70"
            >
              Use for Live Trading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default StrategySelection;
