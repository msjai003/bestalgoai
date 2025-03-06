
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, PenToSquare, Copy, Trash } from "lucide-react";
import { StrategyCard } from "@/components/strategy/StrategyCard";

// Sample strategies data
const strategies = [
  {
    id: 101,
    name: "MA Crossover Strategy",
    description: "Intraday Trading",
    status: "Live",
    performance: {
      percentage: "+12.5%",
      trending: "up"
    }
  },
  {
    id: 102,
    name: "RSI Momentum",
    description: "BTST",
    status: "Paper",
    performance: {
      percentage: "-2.3%",
      trending: "down"
    }
  }
];

type StrategyType = "All" | "Intraday" | "BTST" | "Positional";

const StrategyManagement = () => {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<StrategyType>("All");

  const handleCreateStrategy = () => {
    navigate("/strategy-builder");
  };

  const handleTypeSelect = (type: StrategyType) => {
    setActiveType(type);
  };

  const handleEditStrategy = (id: number) => {
    navigate(`/strategy-details/${id}`);
  };

  const handleCopyStrategy = (id: number) => {
    // TODO: Implement copy functionality
    console.log(`Copying strategy ${id}`);
  };

  const handleDeleteStrategy = (id: number) => {
    // TODO: Implement delete functionality
    console.log(`Deleting strategy ${id}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 pb-20 px-4 flex-1">
        <section className="py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Strategy Management</h1>
            <Button 
              onClick={handleCreateStrategy}
              className="bg-gradient-to-r from-[#FF00D4] to-purple-500 text-white hover:from-[#FF00D4]/90 hover:to-purple-500/90"
            >
              <Plus className="h-4 w-4 mr-2" /> New
            </Button>
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-none">
            <button 
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                activeType === "All" 
                  ? "bg-gray-800/50 border border-[#FF00D4]/30" 
                  : "bg-gray-800/50 border border-gray-700"
              }`}
              onClick={() => handleTypeSelect("All")}
            >
              All Strategies
            </button>
            <button 
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                activeType === "Intraday" 
                  ? "bg-gray-800/50 border border-[#FF00D4]/30" 
                  : "bg-gray-800/50 border border-gray-700"
              }`}
              onClick={() => handleTypeSelect("Intraday")}
            >
              Intraday
            </button>
            <button 
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                activeType === "BTST" 
                  ? "bg-gray-800/50 border border-[#FF00D4]/30" 
                  : "bg-gray-800/50 border border-gray-700"
              }`}
              onClick={() => handleTypeSelect("BTST")}
            >
              BTST
            </button>
            <button 
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                activeType === "Positional" 
                  ? "bg-gray-800/50 border border-[#FF00D4]/30" 
                  : "bg-gray-800/50 border border-gray-700"
              }`}
              onClick={() => handleTypeSelect("Positional")}
            >
              Positional
            </button>
          </div>
        </section>
        
        <section className="space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">{strategy.name}</h3>
                  <span className="text-sm text-gray-400">{strategy.description}</span>
                </div>
                <div className={`px-2 py-1 rounded-full ${
                  strategy.status === "Live" 
                    ? "bg-green-500/20" 
                    : "bg-blue-500/20"
                }`}>
                  <span className={`text-xs ${
                    strategy.status === "Live" 
                      ? "text-green-400" 
                      : "text-blue-400"
                  }`}>{strategy.status}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <i className="fa-solid fa-chart-line text-[#FF00D4] mr-2"></i>
                  <span className={`${
                    strategy.performance.trending === "up" 
                      ? "text-green-400" 
                      : "text-red-400"
                  }`}>{strategy.performance.percentage}</span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    className="text-gray-400 hover:text-white"
                    onClick={() => handleEditStrategy(strategy.id)}
                  >
                    <PenToSquare className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-white"
                    onClick={() => handleCopyStrategy(strategy.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-400"
                    onClick={() => handleDeleteStrategy(strategy.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
