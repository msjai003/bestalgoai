
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, PenSquare, Copy, Trash } from "lucide-react";

type StrategyType = "All" | "Intraday" | "BTST" | "Positional";

// Sample strategies data
const allStrategies = [
  {
    id: 101,
    name: "MA Crossover Strategy",
    description: "Intraday Trading",
    type: "Intraday",
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
    type: "BTST",
    status: "Paper",
    performance: {
      percentage: "-2.3%",
      trending: "down"
    }
  },
  {
    id: 103,
    name: "Swing Trading Setup",
    description: "Positional Strategy",
    type: "Positional",
    status: "Live",
    performance: {
      percentage: "+8.7%",
      trending: "up"
    }
  }
];

const StrategyManagement = () => {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<StrategyType>("All");
  const [filteredStrategies, setFilteredStrategies] = useState(allStrategies);

  useEffect(() => {
    if (activeType === "All") {
      setFilteredStrategies(allStrategies);
    } else {
      setFilteredStrategies(allStrategies.filter(strategy => strategy.type === activeType));
    }
  }, [activeType]);

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
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {["All", "Intraday", "BTST", "Positional"].map((type) => (
              <Button
                key={type}
                variant={activeType === type ? "default" : "outline"}
                size="sm"
                className={activeType === type 
                  ? "bg-gradient-to-r from-[#FF00D4] to-purple-500 text-white border-none"
                  : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-[#FF00D4]/20"
                }
                onClick={() => handleTypeSelect(type as StrategyType)}
              >
                {type === "All" ? "All" : type}
              </Button>
            ))}
          </div>
        </section>
        
        <section className="space-y-4">
          {filteredStrategies.length === 0 ? (
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-4">No strategies found for this filter</p>
              <Button 
                onClick={handleCreateStrategy}
                variant="outline"
                className="border-[#FF00D4]/30 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Create One
              </Button>
            </div>
          ) : (
            filteredStrategies.map((strategy) => (
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
                      <PenSquare className="h-4 w-4" />
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
            ))
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
