
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StrategySection } from "@/components/strategy/StrategySection";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";

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

  const predefinedWishlistedStrategies = wishlistedStrategies.filter(
    strategy => !strategy.isCustom
  );

  const customWishlistedStrategies = wishlistedStrategies.filter(
    strategy => strategy.isCustom
  );

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

        <section className="mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-white">My Wishlist</h2>
            </div>
            
            <StrategySection 
              title="Predefined Strategies"
              icon={<Star className="h-5 w-5 text-yellow-500" />}
              strategies={predefinedWishlistedStrategies}
              emptyMessage="No predefined strategies in your wishlist"
              actionButtonText="Add Strategy"
              actionButtonPath="/strategy-selection"
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
              showEmptyStateButton={true}
            />

            <StrategySection 
              title="Custom Strategies"
              icon={<User className="h-5 w-5 text-blue-500" />}
              strategies={customWishlistedStrategies}
              emptyMessage="No custom strategies in your wishlist"
              actionButtonText="Create Strategy"
              actionButtonPath="/strategy-builder"
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
              showEmptyStateButton={false}
            />
          </div>
        </section>
      </main>
      
      <TradingModeConfirmationDialog 
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        targetMode={targetMode}
        onConfirm={confirmModeChange}
        onCancel={cancelModeChange}
      />

      <TooltipProvider>
        <BottomNav />
      </TooltipProvider>
    </div>
  );
};

export default StrategyManagement;
