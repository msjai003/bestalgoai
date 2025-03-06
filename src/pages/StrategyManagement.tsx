
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, PenSquare, Trash, Heart, Play, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predefinedStrategies } from "@/constants/strategy-data";
import { useToast } from "@/hooks/use-toast";

type StrategyType = "All" | "Intraday" | "BTST" | "Positional";
type DeploymentMode = "Paper" | "Real";

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
    },
    isWishlisted: false
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
    },
    isWishlisted: true
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
    },
    isWishlisted: false
  }
];

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<StrategyType>("All");
  const [filteredStrategies, setFilteredStrategies] = useState(allStrategies);
  const [wishlistedStrategies, setWishlistedStrategies] = useState<typeof allStrategies>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [showStrategyDialog, setShowStrategyDialog] = useState(false);
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);
  const [deploymentMode, setDeploymentMode] = useState<DeploymentMode>("Paper");
  const [selectedStrategySource, setSelectedStrategySource] = useState<"predefined" | "custom">("predefined");

  useEffect(() => {
    if (activeType === "All") {
      setFilteredStrategies(allStrategies);
    } else {
      setFilteredStrategies(allStrategies.filter(strategy => strategy.type === activeType));
    }

    // Filter wishlisted strategies
    setWishlistedStrategies(allStrategies.filter(strategy => strategy.isWishlisted));
  }, [activeType, allStrategies]);

  const handleCreateStrategy = () => {
    setShowStrategyDialog(true);
  };

  const handleStrategySourceSelect = (source: "predefined" | "custom") => {
    setSelectedStrategySource(source);
    if (source === "predefined") {
      navigate("/strategy-selection");
    } else {
      navigate("/strategy-builder");
    }
    setShowStrategyDialog(false);
  };

  const handleTypeSelect = (type: StrategyType) => {
    setActiveType(type);
  };

  const handleEditStrategy = (id: number) => {
    navigate(`/strategy-details/${id}`);
  };

  const handleDeleteStrategy = (id: number) => {
    console.log(`Deleting strategy ${id}`);
    
    // Remove the strategy from the arrays
    const updatedStrategies = allStrategies.filter(strategy => strategy.id !== id);
    
    setFilteredStrategies(
      activeType === "All" 
        ? updatedStrategies 
        : updatedStrategies.filter(strategy => strategy.type === activeType)
    );
    
    setWishlistedStrategies(updatedStrategies.filter(strategy => strategy.isWishlisted));
    
    toast({
      title: "Strategy deleted",
      description: "The strategy has been deleted successfully",
    });
  };

  const handleDeployStrategy = (strategy: any) => {
    setSelectedStrategy(strategy);
    setShowDeploymentDialog(true);
  };

  const handleDeployConfirm = () => {
    console.log(`Deploying strategy ${selectedStrategy.id} in ${deploymentMode} mode`);
    setShowDeploymentDialog(false);
    navigate("/live-trading");
  };

  const handleToggleWishlist = (id: number) => {
    const updatedStrategies = allStrategies.map(strategy => {
      if (strategy.id === id) {
        return { ...strategy, isWishlisted: !strategy.isWishlisted };
      }
      return strategy;
    });
    
    setFilteredStrategies(
      activeType === "All" 
        ? updatedStrategies 
        : updatedStrategies.filter(strategy => strategy.type === activeType)
    );
    
    setWishlistedStrategies(updatedStrategies.filter(strategy => strategy.isWishlisted));
    
    const isWishlisted = updatedStrategies.find(s => s.id === id)?.isWishlisted;
    toast({
      title: isWishlisted ? "Added to wishlist" : "Removed from wishlist",
      description: `Strategy has been ${isWishlisted ? 'added to' : 'removed from'} your wishlist`,
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 pb-20 px-4 flex-1">
        <section className="py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white">Strategy Management</h1>
            </div>
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
                  : "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gradient-to-r hover:from-[#FF00D4]/20 hover:to-purple-500/20 hover:text-white hover:border-[#FF00D4]"
                }
                onClick={() => handleTypeSelect(type as StrategyType)}
              >
                {type}
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
                      className={`${
                        strategy.isWishlisted 
                          ? "text-pink-500 hover:text-pink-400" 
                          : "text-gray-400 hover:text-pink-500"
                      }`}
                      onClick={() => handleToggleWishlist(strategy.id)}
                      title={strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className="h-4 w-4" 
                             fill={strategy.isWishlisted ? "currentColor" : "none"} 
                             color={strategy.status === "Live" ? "#ec4899" : "currentColor"} />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-white"
                      onClick={() => handleEditStrategy(strategy.id)}
                    >
                      <PenSquare className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-400"
                      onClick={() => handleDeleteStrategy(strategy.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-green-400"
                      onClick={() => handleDeployStrategy(strategy)}
                      title="Deploy strategy"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* My Wishlist Section */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">My Wishlist</h2>
          
          <div className="space-y-4">
            {wishlistedStrategies.length === 0 ? (
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-4">No strategies in your wishlist</p>
                <Button 
                  onClick={() => navigate('/strategy-selection')}
                  variant="outline"
                  className="border-[#FF00D4]/30 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Strategies
                </Button>
              </div>
            ) : (
              wishlistedStrategies.map((strategy) => (
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
                        className="text-pink-500 hover:text-pink-400"
                        onClick={() => handleToggleWishlist(strategy.id)}
                        title="Remove from wishlist"
                      >
                        <Heart className="h-4 w-4" fill="currentColor" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleEditStrategy(strategy.id)}
                      >
                        <PenSquare className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => handleDeleteStrategy(strategy.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-green-400"
                        onClick={() => handleDeployStrategy(strategy)}
                        title="Deploy strategy"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <BottomNav />

      <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Select Strategy Type</DialogTitle>
            <DialogDescription className="text-gray-300">
              Would you like to use a predefined strategy or create a custom one?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-[#FF00D4]"
              onClick={() => handleStrategySourceSelect("predefined")}
            >
              <FileText className="h-6 w-6" />
              <span>Predefined Strategy</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-[#FF00D4]"
              onClick={() => handleStrategySourceSelect("custom")}
            >
              <PenSquare className="h-6 w-6" />
              <span>Custom Strategy</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeploymentDialog} onOpenChange={setShowDeploymentDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Select Deployment Mode</DialogTitle>
            <DialogDescription className="text-gray-300">
              Would you like to deploy in Paper Trade mode or Real Mode?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={deploymentMode} onValueChange={(value) => setDeploymentMode(value as DeploymentMode)}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="Paper">Paper Trading (Simulated)</SelectItem>
                <SelectItem value="Real">Real Trading (Live Market)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShowDeploymentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#FF00D4] to-purple-500 text-white"
              onClick={handleDeployConfirm}
            >
              Deploy Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategyManagement;
