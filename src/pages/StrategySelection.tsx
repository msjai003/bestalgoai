
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, AlertTriangle, Info, Play, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { CustomStrategyWizard } from "@/components/strategy/CustomStrategyWizard";
import { predefinedStrategies } from "@/constants/strategy-data";
import { ScrollArea } from "@/components/ui/scroll-area";

const StrategySelection = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"predefined" | "custom">("predefined");

  const handleDeployStrategy = () => {
    navigate("/backtest");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="pt-14 pb-16 flex-1 overflow-hidden">
        <section className="px-4 py-2 h-full flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-3">Strategy Selection</h1>
          
          {/* Tab Selection */}
          <div className="bg-gray-800/50 p-1 rounded-xl mb-3">
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
          <div className="flex-1 overflow-auto scrollbar-none">
            {selectedTab === "predefined" ? (
              <div className="grid grid-cols-1 gap-3 pb-4">
                {predefinedStrategies.map((strategy) => (
                  <StrategyCard 
                    key={strategy.id}
                    strategy={strategy}
                  />
                ))}
              </div>
            ) : (
              <CustomStrategyWizard onSubmit={handleDeployStrategy} />
            )}
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default StrategySelection;
