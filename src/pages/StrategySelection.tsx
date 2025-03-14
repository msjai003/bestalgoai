
import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, AlertTriangle, Info, Play, Clock3, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import Header from "@/components/Header";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { CustomStrategyWizard } from "@/components/strategy/CustomStrategyWizard";
import { predefinedStrategies } from "@/constants/strategy-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { QuantityInputDialog } from "@/components/strategy/QuantityInputDialog";

const StrategySelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"predefined" | "custom">("predefined");
  const [strategies, setStrategies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      setIsLoading(true);
      
      try {
        let strategiesWithStatus = predefinedStrategies.map(strategy =>({
          ...strategy,
          isWishlisted: false,
          isLive: false,
          quantity: 0
        }));
        
        if (user) {
          const { data: selections, error } = await supabase
            .from('strategy_selections')
            .select('strategy_id, quantity')
            .eq('user_id', user.id);
            
          if (error) {
            console.error("Error fetching wishlisted strategies:", error);
            toast({
              title: "Error fetching wishlist",
              description: "There was a problem loading your wishlisted strategies",
              variant: "destructive"
            });
          } else if (selections) {
            strategiesWithStatus = strategiesWithStatus.map(strategy => ({
              ...strategy,
              isWishlisted: selections.some(item => item.strategy_id === strategy.id),
              quantity: selections.find(item => item.strategy_id === strategy.id)?.quantity || 0
            }));
          }
        }
        
        setStrategies(strategiesWithStatus);
      } catch (error) {
        console.error("Error setting up strategies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStrategies();
  }, [user, toast]);

  const handleDeployStrategy = () => {
    navigate("/backtest");
  };

  const handleSelectStrategy = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    toast({
      title: "Strategy Selected",
      description: `${strategy?.name} strategy has been selected for deployment.`
    });
    
    navigate(`/backtest?strategyId=${id}`);
  };

  const handleToggleWishlist = async (id: number, isWishlisted: boolean) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, isWishlisted } 
          : strategy
      )
    );
    
    const strategy = strategies.find(s => s.id === id);
    
    toast({
      title: isWishlisted ? "Added to wishlist" : "Removed from wishlist",
      description: `Strategy has been ${isWishlisted ? 'added to' : 'removed from'} your wishlist`
    });
    
    const storedWishlist = localStorage.getItem('wishlistedStrategies');
    let wishlistedStrategies: any[] = [];
    
    if (storedWishlist) {
      try {
        wishlistedStrategies = JSON.parse(storedWishlist);
      } catch (error) {
        console.error("Error parsing wishlisted strategies:", error);
      }
    }
    
    if (isWishlisted) {
      if (!wishlistedStrategies.some(s => s.id === id)) {
        const strategyToAdd = strategies.find(s => s.id === id);
        if (strategyToAdd) {
          wishlistedStrategies.push({...strategyToAdd, isWishlisted: true});
        }
      }
    } else {
      wishlistedStrategies = wishlistedStrategies.filter(s => s.id !== id);
    }
    
    localStorage.setItem('wishlistedStrategies', JSON.stringify(wishlistedStrategies));
    
    if (user) {
      try {
        if (isWishlisted) {
          const { error } = await supabase
            .from('strategy_selections')
            .insert({
              user_id: user.id,
              strategy_id: id,
              strategy_name: strategy?.name || '',
              strategy_description: strategy?.description || ''
            });
            
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('strategy_selections')
            .delete()
            .eq('user_id', user.id)
            .eq('strategy_id', id);
            
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating wishlist in Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to update wishlist in database",
          variant: "destructive"
        });
      }
    } else if (isWishlisted) {
      toast({
        title: "Login Required",
        description: "Please login to save strategies to your wishlist permanently",
      });
    }
  };

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    const newStatus = !strategy?.isLive;
    
    if (newStatus) {
      setSelectedStrategyId(id);
      setTargetMode("live");
      setConfirmDialogOpen(true);
    } else {
      updateLiveMode(id, false);
    }
  };

  const updateLiveMode = (id: number, isLive: boolean) => {
    setStrategies(prev => 
      prev.map(strategy => {
        if (strategy.id === id) {
          return { ...strategy, isLive };
        }
        return strategy;
      })
    );
    
    toast({
      title: isLive ? "Strategy set to live mode" : "Strategy set to paper mode",
      description: `Strategy is now in ${isLive ? 'live' : 'paper'} trading mode`,
    });
  };

  const handleConfirmLiveMode = () => {
    setConfirmDialogOpen(false);
    if (selectedStrategyId !== null) {
      updateLiveMode(selectedStrategyId, true);
      setQuantityDialogOpen(true);
    }
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
    setSelectedStrategyId(null);
  };

  const handleQuantitySubmit = async (quantity: number) => {
    setQuantityDialogOpen(false);
    
    if (selectedStrategyId !== null && user) {
      try {
        const strategy = strategies.find(s => s.id === selectedStrategyId);
        
        if (!strategy) {
          throw new Error("Strategy not found");
        }

        const { error } = await supabase
          .from('strategy_selections')
          .upsert({
            user_id: user.id,
            strategy_id: selectedStrategyId,
            strategy_name: strategy.name,
            strategy_description: strategy.description,
            quantity: quantity
          });

        if (error) throw error;
        
        setStrategies(prev => 
          prev.map(s => 
            s.id === selectedStrategyId 
              ? { ...s, quantity } 
              : s
          )
        );

        toast({
          title: "Quantity Updated",
          description: `Trading quantity set to ${quantity}`,
        });
        
        navigate("/live-trading");
      } catch (error) {
        console.error('Error saving quantity:', error);
        toast({
          title: "Error",
          description: "Failed to update trading quantity",
          variant: "destructive"
        });
      }
    }
  };

  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
    setSelectedStrategyId(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <TooltipProvider>
        <main className="pt-14 pb-16 flex-1 overflow-hidden">
          <section className="px-4 py-2 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-3">Strategy Selection</h1>
            
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
            
            <div className="flex-1 overflow-auto scrollbar-none">
              {selectedTab === "predefined" ? (
                <div className="grid grid-cols-1 gap-3 pb-4">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-400">Loading strategies...</div>
                  ) : (
                    strategies.map((strategy) => (
                      <div key={strategy.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-white">{strategy.name}</h3>
                            <p className="text-sm text-gray-400">{strategy.description}</p>
                          </div>
                          <div className="flex gap-2">
                            {user && (
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className={`${strategy.isWishlisted ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-400`}
                                onClick={() => handleToggleWishlist(strategy.id, !strategy.isWishlisted)}
                                aria-label={strategy.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                              >
                                <Heart className="h-4 w-4" fill={strategy.isWishlisted ? "currentColor" : "none"} />
                              </Button>
                            )}
                            
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className={`${strategy.isLive ? 'text-green-500' : 'text-gray-400'} hover:text-green-400`}
                              onClick={() => handleToggleLiveMode(strategy.id)}
                              aria-label={strategy.isLive ? "Switch to paper trading" : "Switch to live trading"}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Win Rate:</span>
                              <span className="text-green-400">{strategy.performance.winRate}</span>
                            </div>
                            
                            <div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-500 hover:text-green-400 bg-gray-700 hover:bg-gray-600 border-gray-600"
                                onClick={() => navigate(`/strategy-details/${strategy.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <CustomStrategyWizard onSubmit={handleDeployStrategy} />
              )}
            </div>
          </section>
        </main>
      </TooltipProvider>
      
      <TradingModeConfirmationDialog 
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        targetMode={targetMode}
        onConfirm={handleConfirmLiveMode}
        onCancel={handleCancelLiveMode}
      />
      
      <QuantityInputDialog 
        open={quantityDialogOpen}
        onOpenChange={setQuantityDialogOpen}
        onConfirm={handleQuantitySubmit}
        onCancel={handleCancelQuantity}
      />
      
      <BottomNav />
    </div>
  );
};

export default StrategySelection;
