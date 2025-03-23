
import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { DeleteConfirmationDialog } from "@/components/strategy/DeleteConfirmationDialog";
import { StrategyFilter } from "@/components/strategy/StrategyFilter";
import { Button } from "@/components/ui/button";
import { Star, User, Plus, Play, Trash2, ChevronRight, Eye } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { StrategyCategory } from "@/types/strategy";
import { StrategyList } from "@/components/strategy/StrategyList";
import { NoStrategiesFound } from '@/components/strategy/NoStrategiesFound';

type FilterOption = "all" | "intraday" | "btst" | "positional";

interface Strategy {
  id: number | string;
  name: string;
  description: string;
  isCustom: boolean;
  isLive: boolean;
  isWishlisted: boolean;
  isPaid?: boolean;
  legs?: any;
  createdBy?: string;
  category?: StrategyCategory;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  quantity?: number;
  selectedBroker?: string;
  brokerUsername?: string;
  tradeType?: string;
  successRate?: string;
  pnl?: string;
}

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [wishlistedStrategies, setWishlistedStrategies] = useState<Strategy[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");
  const [hasPremium, setHasPremium] = useState(false);
  
  // Trading mode confirmation state
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentStrategyId, setCurrentStrategyId] = useState<number | string | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<{id: number | string, name: string} | null>(null);

  // Check if user has premium subscription
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data && (data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
          setHasPremium(true);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    
    checkPremiumStatus();
  }, [user]);

  // Check if any specific strategies have been paid for
  useEffect(() => {
    const checkPaidStrategies = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('strategy_selections')
          .select('strategy_id, paid_status')
          .eq('user_id', user.id)
          .eq('paid_status', 'paid');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const paidStrategyIds = new Set(data.map(item => Number(item.strategy_id)));
          
          setWishlistedStrategies(prev => prev.map(strategy => ({
            ...strategy,
            isPaid: paidStrategyIds.has(Number(strategy.id))
          })));
        }
      } catch (error) {
        console.error("Error fetching paid strategies:", error);
      }
    };
    
    if (wishlistedStrategies.length > 0) {
      checkPaidStrategies();
    }
  }, [wishlistedStrategies.length, user]);

  useEffect(() => {
    const fetchStrategies = async () => {
      // Get strategies from localStorage first
      const storedStrategies = localStorage.getItem('wishlistedStrategies');
      let localStrategies: Strategy[] = [];
      
      if (storedStrategies) {
        try {
          localStrategies = JSON.parse(storedStrategies);
        } catch (error) {
          console.error("Error parsing wishlisted strategies:", error);
        }
      }

      // If user is logged in, fetch strategies from Supabase
      if (user) {
        try {
          const { data, error } = await supabase
            .from('custom_strategies')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          // Convert Supabase data to match local storage format
          const supabaseStrategies: Strategy[] = data.map(strategy => ({
            id: strategy.id,
            name: strategy.name,
            description: strategy.description || "",
            isCustom: true,
            isLive: false, // Default to paper trading
            isWishlisted: true,
            legs: strategy.legs,
            createdBy: strategy.created_by || user.email,
            performance: typeof strategy.performance === 'object' && strategy.performance !== null
              ? {
                  winRate: typeof strategy.performance === 'object' && 'winRate' in strategy.performance 
                    ? String(strategy.performance.winRate) : "N/A",
                  avgProfit: typeof strategy.performance === 'object' && 'avgProfit' in strategy.performance 
                    ? String(strategy.performance.avgProfit) : "N/A",
                  drawdown: typeof strategy.performance === 'object' && 'drawdown' in strategy.performance 
                    ? String(strategy.performance.drawdown) : "N/A"
                }
              : {
                  winRate: "N/A",
                  avgProfit: "N/A",
                  drawdown: "N/A"
                }
          }));
          
          // Merge strategies from Supabase with local strategies
          // (avoiding duplicates by name)
          const supabaseStrategyNames = supabaseStrategies.map(s => s.name.toLowerCase());
          const filteredLocalStrategies = localStrategies.filter(
            s => !s.isCustom || !supabaseStrategyNames.includes(s.name.toLowerCase())
          );
          
          setWishlistedStrategies([...filteredLocalStrategies, ...supabaseStrategies]);
        } catch (error) {
          console.error("Error fetching strategies from Supabase:", error);
          setWishlistedStrategies(localStrategies);
        }
      } else {
        setWishlistedStrategies(localStrategies);
      }
    };
    
    fetchStrategies();
  }, [user]);

  const filterStrategies = (strategies: Strategy[]) => {
    if (selectedFilter === "all") {
      return strategies;
    }
    // Only filter by category if it exists
    return strategies.filter(strategy => 
      strategy.category === selectedFilter
    );
  };

  const predefinedWishlistedStrategies = filterStrategies(
    wishlistedStrategies.filter(strategy => !strategy.isCustom)
  );

  const customWishlistedStrategies = filterStrategies(
    wishlistedStrategies.filter(strategy => strategy.isCustom)
  );

  const handleDeleteStrategy = (id: number | string) => {
    const strategy = wishlistedStrategies.find(s => s.id === id);
    if (!strategy) return;
    
    setStrategyToDelete({ id, name: strategy.name });
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteStrategy = async () => {
    if (!strategyToDelete) return;
    
    if (user && typeof strategyToDelete.id === 'string' && strategyToDelete.id.includes('-')) {
      try {
        const { error } = await supabase
          .from('custom_strategies')
          .delete()
          .eq('id', strategyToDelete.id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting strategy from Supabase:", error);
        toast({
          title: "Error",
          description: "Failed to delete strategy from database",
          variant: "destructive"
        });
        setDeleteConfirmOpen(false);
        setStrategyToDelete(null);
        return;
      }
    }
    
    const updatedStrategies = wishlistedStrategies.filter(strategy => strategy.id !== strategyToDelete.id);
    setWishlistedStrategies(updatedStrategies);
    
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    
    toast({
      title: "Strategy deleted",
      description: "The strategy has been removed from your wishlist",
      variant: "destructive"
    });
    
    setDeleteConfirmOpen(false);
    setStrategyToDelete(null);
  };
  
  const cancelDeleteStrategy = () => {
    setDeleteConfirmOpen(false);
    setStrategyToDelete(null);
  };

  const handleToggleLiveMode = (id: number | string) => {
    const strategy = wishlistedStrategies.find(s => s.id === id);
    if (!strategy) return;
    
    // For premium strategies that haven't been paid for
    const isPremium = typeof id === 'number' && id > 1;
    if (isPremium && !hasPremium && !strategy.isPaid) {
      // Redirect to pricing page with strategy context
      sessionStorage.setItem('selectedStrategyId', id.toString());
      sessionStorage.setItem('redirectAfterPayment', '/strategy-management');
      navigate('/pricing');
      return;
    }
    
    setCurrentStrategyId(id);
    setTargetMode(strategy.isLive ? "paper" : "live");
    setConfirmationOpen(true);
  };

  const confirmModeChange = async () => {
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

  const handleCreateNewStrategy = () => {
    navigate('/strategy-builder');
  };

  const handleViewDetails = (id: number | string) => {
    navigate(`/strategy-details/${id}`);
  };
  
  const handleEditQuantity = (id: number | string) => {
    // This would normally open the quantity dialog, but we'll just navigate to live trading for now
    navigate('/live-trading');
  };

  return (
    <div className="bg-[#121212] min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 pb-24 px-4 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Strategy Management</h1>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#2A2A2A] text-cyan hover:text-white"
            onClick={() => navigate('/strategy-selection')}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Strategy
          </Button>
        </div>
        
        <div className="mb-6">
          <StrategyFilter 
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        <div className="space-y-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Predefined Strategies
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#2A2A2A] text-cyan hover:bg-[#2A2A2A]"
              onClick={() => navigate('/strategy-selection')}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Strategy
            </Button>
          </div>
          
          {predefinedWishlistedStrategies.length > 0 ? (
            <div className="grid gap-4">
              {predefinedWishlistedStrategies.map((strategy) => (
                <div key={strategy.id} className="premium-card p-5 relative z-10 overflow-hidden border border-gray-800 rounded-lg hover:shadow-lg hover:shadow-cyan/10 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{strategy.name}</h3>
                        {strategy.description && (
                          <p className="text-xs text-gray-400 mt-1">{strategy.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-400 h-8 w-8"
                            onClick={() => handleDeleteStrategy(strategy.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="glass-card p-3">
                        <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                        <p className="text-cyan text-lg font-semibold">{strategy.performance?.winRate || "N/A"}</p>
                      </div>
                      <div className="glass-card p-3">
                        <p className="text-gray-400 text-xs mb-1">Avg. Profit</p>
                        <p className="text-emerald-400 text-lg font-semibold">{strategy.performance?.avgProfit || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {strategy.isLive ? "Live" : "Paper"}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`${strategy.isLive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-cyan border-blue-500/30'} hover:bg-opacity-30`}
                          onClick={() => handleToggleLiveMode(strategy.id)}
                        >
                          <Play className="mr-1 h-4 w-4" />
                          {strategy.isLive ? "Active" : "Inactive"}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(strategy.id)}
                        className="text-cyan bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:text-cyan glass-card"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoStrategiesFound onAddStrategies={() => navigate('/strategy-selection')} />
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-cyan" />
              Custom Strategies
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-800/50 hover:bg-gray-700 border border-gray-700 text-cyan"
              onClick={() => navigate('/strategy-builder')}
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Strategy
            </Button>
          </div>
          
          {customWishlistedStrategies.length > 0 ? (
            <div className="grid gap-4">
              {customWishlistedStrategies.map((strategy) => (
                <div key={strategy.id} className="premium-card p-5 relative z-10 overflow-hidden border border-gray-800 rounded-lg hover:shadow-lg hover:shadow-cyan/10 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{strategy.name}</h3>
                        {strategy.description && (
                          <p className="text-xs text-gray-400 mt-1">{strategy.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-400 h-8 w-8"
                            onClick={() => handleDeleteStrategy(strategy.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="glass-card p-3">
                        <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                        <p className="text-cyan text-lg font-semibold">{strategy.performance?.winRate || "N/A"}</p>
                      </div>
                      <div className="glass-card p-3">
                        <p className="text-gray-400 text-xs mb-1">Avg. Profit</p>
                        <p className="text-emerald-400 text-lg font-semibold">{strategy.performance?.avgProfit || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {strategy.isLive ? "Live" : "Paper"}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`${strategy.isLive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-cyan border-blue-500/30'} hover:bg-opacity-30`}
                          onClick={() => handleToggleLiveMode(strategy.id)}
                        >
                          <Play className="mr-1 h-4 w-4" />
                          {strategy.isLive ? "Active" : "Inactive"}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(strategy.id)}
                        className="text-cyan bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:text-cyan glass-card"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <p className="text-gray-300 mb-4">No custom strategies created yet</p>
              <Button 
                onClick={() => navigate('/strategy-builder')}
                variant="outline"
                className="bg-gray-800/50 hover:bg-gray-700 border border-gray-700 text-cyan"
              >
                <Plus className="mr-1 h-4 w-4" />
                Create New Strategy
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <TradingModeConfirmationDialog 
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        targetMode={targetMode}
        onConfirm={confirmModeChange}
        onCancel={cancelModeChange}
      />
      
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        strategyName={strategyToDelete?.name || ""}
        onConfirm={confirmDeleteStrategy}
        onCancel={cancelDeleteStrategy}
      />

      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
