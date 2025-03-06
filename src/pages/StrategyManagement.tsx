
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Play, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { predefinedStrategies } from "@/constants/strategy-data";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistedStrategies, setWishlistedStrategies] = useState<any[]>([]);

  useEffect(() => {
    const storedStrategies = localStorage.getItem('wishlistedStrategies');
    if (storedStrategies) {
      try {
        const parsedStrategies = JSON.parse(storedStrategies);
        setWishlistedStrategies(parsedStrategies);
      } catch (error) {
        console.error("Error parsing wishlisted strategies:", error);
      }
    }
  }, []);

  const handleDeleteStrategy = (id: number) => {
    const updatedStrategies = wishlistedStrategies.filter(strategy => strategy.id !== id);
    setWishlistedStrategies(updatedStrategies);
    
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    
    toast({
      title: "Strategy deleted",
      description: "The strategy has been removed from your wishlist",
    });
  };

  const handleDeployStrategy = (strategy: any) => {
    navigate("/live-trading");
  };

  const handleToggleLiveMode = (id: number) => {
    const updatedStrategies = wishlistedStrategies.map(strategy => {
      if (strategy.id === id) {
        const newLiveStatus = !strategy.isLive;
        
        toast({
          title: newLiveStatus ? "Strategy set to live mode" : "Strategy set to paper mode",
          description: `Strategy is now in ${newLiveStatus ? 'live' : 'paper'} trading mode`,
        });
        
        if (newLiveStatus) {
          navigate("/live-trading");
        }
        
        return { ...strategy, isLive: newLiveStatus };
      }
      return strategy;
    });
    
    setWishlistedStrategies(updatedStrategies);
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
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
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white">Strategy Management</h1>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">My Wishlist</h2>
          
          <div className="space-y-4">
            {wishlistedStrategies.length === 0 ? (
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-4">No strategies in your wishlist</p>
                <Button 
                  onClick={() => navigate('/strategy-selection')}
                  variant="outline"
                  className="text-green-500 hover:text-green-400 border-gray-700 bg-transparent hover:bg-gray-800"
                >
                  Browse Strategies
                </Button>
              </div>
            ) : (
              wishlistedStrategies.map((strategy) => (
                <div key={strategy.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{strategy.name}</h3>
                      <p className="text-sm text-gray-400">{strategy.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-pink-500 hover:text-pink-400"
                            onClick={() => handleDeleteStrategy(strategy.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove from wishlist</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className={`${strategy.isLive ? 'text-green-500' : 'text-gray-400'} hover:text-green-500`}
                            onClick={() => handleToggleLiveMode(strategy.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{strategy.isLive ? 'Switch to paper trading' : 'Click to live trade'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {strategy.performance && (
                          <>
                            <span className="text-gray-400">Win Rate:</span>
                            <span className="text-green-400">{strategy.performance.winRate}</span>
                          </>
                        )}
                      </div>
                      
                      <div className={`${strategy.isLive ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'} px-2 py-1 rounded-md text-xs font-medium`}>
                        {strategy.isLive ? 'Live Trading' : 'Paper Trading'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <TooltipProvider>
        <BottomNav />
      </TooltipProvider>
    </div>
  );
};

export default StrategyManagement;
