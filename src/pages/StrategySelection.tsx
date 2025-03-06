
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, AlertTriangle, Info, Play, Clock3, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { CustomStrategyWizard } from "@/components/strategy/CustomStrategyWizard";
import { predefinedStrategies } from "@/constants/strategy-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const StrategySelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<"predefined" | "custom">("predefined");
  const [strategies, setStrategies] = useState<any[]>([]);

  // Load strategies with wishlist status from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlistedStrategies');
    let wishlistedIds: number[] = [];
    
    if (storedWishlist) {
      try {
        const parsed = JSON.parse(storedWishlist);
        wishlistedIds = parsed.map((s: any) => s.id);
      } catch (error) {
        console.error("Error parsing wishlisted strategies:", error);
      }
    }
    
    // Map predefined strategies with wishlist status
    setStrategies(predefinedStrategies.map(strategy => ({
      ...strategy,
      isWishlisted: wishlistedIds.includes(strategy.id),
      isLive: false
    })));
  }, []);

  const handleDeployStrategy = () => {
    navigate("/backtest");
  };

  const handleToggleWishlist = (id: number) => {
    // Update UI state
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === id) {
        return { ...strategy, isWishlisted: !strategy.isWishlisted };
      }
      return strategy;
    });
    setStrategies(updatedStrategies);
    
    // Determine if we're adding or removing from wishlist
    const strategy = strategies.find(s => s.id === id);
    const newWishlistStatus = !strategy?.isWishlisted;
    
    // Show toast
    toast({
      title: newWishlistStatus ? "Added to wishlist" : "Removed from wishlist",
      description: `Strategy has been ${newWishlistStatus ? 'added to' : 'removed from'} your wishlist`
    });
    
    // Update localStorage
    const storedWishlist = localStorage.getItem('wishlistedStrategies');
    let wishlistedStrategies: any[] = [];
    
    if (storedWishlist) {
      try {
        wishlistedStrategies = JSON.parse(storedWishlist);
      } catch (error) {
        console.error("Error parsing wishlisted strategies:", error);
      }
    }
    
    if (newWishlistStatus) {
      // Add to wishlist if not already there
      if (!wishlistedStrategies.some(s => s.id === id)) {
        const strategyToAdd = strategies.find(s => s.id === id);
        if (strategyToAdd) {
          wishlistedStrategies.push({...strategyToAdd, isWishlisted: true});
        }
      }
    } else {
      // Remove from wishlist
      wishlistedStrategies = wishlistedStrategies.filter(s => s.id !== id);
    }
    
    localStorage.setItem('wishlistedStrategies', JSON.stringify(wishlistedStrategies));
  };

  const handleToggleLiveMode = (id: number) => {
    setStrategies(prev => 
      prev.map(strategy => {
        if (strategy.id === id) {
          const newStatus = !strategy.isLive;
          
          toast({
            title: newStatus ? "Strategy set to live mode" : "Strategy set to paper mode",
            description: `Strategy is now in ${newStatus ? 'live' : 'paper'} trading mode`,
          });
          
          if (newStatus) {
            // Navigate to live trading when set to live mode
            navigate("/live-trading");
          }
          
          return { ...strategy, isLive: newStatus };
        }
        return strategy;
      })
    );
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
                {strategies.map((strategy) => (
                  <StrategyCard 
                    key={strategy.id}
                    strategy={strategy}
                    onWishlist={handleToggleWishlist}
                    onLiveMode={handleToggleLiveMode}
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
