
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Play, Trash, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { predefinedStrategies } from "@/constants/strategy-data";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistedStrategies, setWishlistedStrategies] = useState<any[]>([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentStrategyId, setCurrentStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);

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
      variant: "destructive"
    });
  };

  const handleDeployStrategy = (strategy: any) => {
    navigate("/live-trading");
  };

  const handleToggleLiveMode = (id: number) => {
    const strategy = wishlistedStrategies.find(s => s.id === id);
    if (!strategy) return;
    
    setCurrentStrategyId(id);
    setTargetMode(strategy.isLive ? "paper" : "live");
    setConfirmationOpen(true);
  };

  const confirmModeChange = () => {
    if (currentStrategyId === null || targetMode === null) return;
    
    const updatedStrategies = wishlistedStrategies.map(strategy => {
      if (strategy.id === currentStrategyId) {
        const newLiveStatus = targetMode === "live";
        
        toast({
          title: newLiveStatus ? "Strategy set to live mode" : "Strategy set to paper mode",
          description: `Strategy is now in ${newLiveStatus ? 'live' : 'paper'} trading mode`,
          variant: "default",
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
    setConfirmationOpen(false);
    setCurrentStrategyId(null);
    setTargetMode(null);
  };

  const cancelModeChange = () => {
    setConfirmationOpen(false);
    setCurrentStrategyId(null);
    setTargetMode(null);
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">My Wishlist</h2>
            <Button 
              variant="outline"
              size="sm"
              className="text-green-500 hover:text-green-400 border-gray-700 bg-transparent hover:bg-gray-800"
              onClick={() => navigate('/strategy-selection')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Strategy
            </Button>
          </div>
          
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
      
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm Trading Mode Change
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {targetMode === "live" 
                ? "Are you sure you want to switch to live trading? This will use real funds for trading operations."
                : "Are you sure you want to switch to paper trading? This will use simulated funds for trading operations."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              variant="secondary" 
              className="bg-gray-700 hover:bg-gray-600 text-gray-200"
              onClick={cancelModeChange}
            >
              Cancel
            </Button>
            <Button 
              variant={targetMode === "live" ? "destructive" : "default"}
              className={targetMode === "live" ? "" : "bg-blue-600 hover:bg-blue-700"}
              onClick={confirmModeChange}
            >
              {targetMode === "live" ? "Yes, Enable Live Trading" : "Yes, Switch to Paper Trading"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TooltipProvider>
        <BottomNav />
      </TooltipProvider>
    </div>
  );
};

export default StrategyManagement;
