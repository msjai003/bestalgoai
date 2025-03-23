
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
import { TradingModeFilter } from '@/components/strategy/TradingModeFilter';
import { useStrategyFiltering } from '@/hooks/strategy/useStrategyFiltering';
import { Strategy } from '@/hooks/strategy/types';

type FilterOption = "all" | "intraday" | "btst" | "positional";

// Extend the imported Strategy type for local usage
interface ExtendedStrategy extends Omit<Strategy, 'id'> {
  id: number | string;
  isCustom: boolean;
  createdBy?: string;
  category?: StrategyCategory;
  legs?: any;
  isPaid?: boolean;
}

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [wishlistedStrategies, setWishlistedStrategies] = useState<ExtendedStrategy[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");
  const [hasPremium, setHasPremium] = useState(false);
  
  // Trading mode confirmation state
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentStrategyId, setCurrentStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<{id: number | string, name: string} | null>(null);

  // For filter mode - cast the wishlistedStrategies to Strategy[] for useStrategyFiltering
  const { selectedMode, handleModeChange, filteredStrategies } = useStrategyFiltering(
    wishlistedStrategies.map(s => ({
      ...s,
      id: typeof s.id === 'string' ? parseInt(s.id, 10) : s.id
    })) as Strategy[]
  );

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
      let localStrategies: ExtendedStrategy[] = [];
      
      if (storedStrategies) {
        try {
          // Parse and ensure the strategies have the required properties
          const parsedStrategies = JSON.parse(storedStrategies);
          localStrategies = parsedStrategies.map((strategy: any) => ({
            ...strategy,
            // Ensure required properties exist
            quantity: strategy.quantity || 0,
            id: typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : strategy.id,
            // Add other required properties if missing
            isWishlisted: strategy.isWishlisted ?? true,
            isLive: strategy.isLive ?? false,
          }));
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
          
          // Convert Supabase data to match the Strategy type
          const supabaseStrategies: ExtendedStrategy[] = data.map(strategy => ({
            id: strategy.id,
            name: strategy.name,
            description: strategy.description || "",
            isCustom: true,
            isLive: false, // Default to paper trading
            isWishlisted: true,
            quantity: 0, // Add required property
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
          
          // Fix: Ensure we're handling string arrays correctly
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

  const filterStrategies = (strategies: ExtendedStrategy[]) => {
    let filteredStrats = strategies;
    
    // Category filter
    if (selectedFilter !== "all") {
      filteredStrats = filteredStrats.filter(strategy => 
        strategy.category === selectedFilter
      );
    }
    
    // Trading mode filter
    if (selectedMode !== "all") {
      filteredStrats = filteredStrats.filter(strategy => 
        (selectedMode === "live" && strategy.isLive) || 
        (selectedMode === "paper" && !strategy.isLive)
      );
    }
    
    return filteredStrats;
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
    
    // Updated to handle string IDs properly
    const isStringId = typeof strategyToDelete.id === 'string';
    const hasHyphen = isStringId && (strategyToDelete.id as string).includes('-');
    
    if (user && isStringId && hasHyphen) {
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
    
    setCurrentStrategyId(typeof id === 'string' ? parseInt(id, 10) : id);
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
    navigate('/live-trading');
  };

  return (
    <div className="bg-[#121212] min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 pb-24 px-4 flex-grow">
        {/* Header section with glass effect */}
        <div className="premium-card p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/20 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">Strategy Management</h1>
            <p className="text-gray-400 mb-4">Manage your trading strategies and settings</p>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <StrategyFilter 
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
              
              <TradingModeFilter
                selectedMode={selectedMode}
                onModeChange={handleModeChange}
              />
              
              <Button 
                variant="gradient"
                size="sm"
                className="ml-auto"
                onClick={() => navigate('/strategy-selection')}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Strategy
              </Button>
            </div>
          </div>
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
              className="border-[#2A2A2A] bg-cyan/10 text-cyan hover:bg-cyan/20"
              onClick={() => navigate('/strategy-selection')}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Strategy
            </Button>
          </div>
          
          {predefinedWishlistedStrategies.length > 0 ? (
            <div className="grid gap-4">
              {predefinedWishlistedStrategies.map((strategy) => (
                <div key={strategy.id} className="premium-card p-5 relative z-10 overflow-hidden border border-cyan/20 rounded-lg hover:shadow-lg hover:shadow-cyan/10 transition-all duration-300">
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
                            className="text-red-500 hover:text-red-400 h-8 w-8 glass hover:bg-gray-700/20"
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
                          className={`${strategy.isLive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-cyan/20 text-cyan border-cyan/30'} hover:bg-opacity-30`}
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
              variant="gradient"
              size="sm"
              onClick={() => navigate('/strategy-builder')}
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Strategy
            </Button>
          </div>
          
          {customWishlistedStrategies.length > 0 ? (
            <div className="grid gap-4">
              {customWishlistedStrategies.map((strategy) => (
                <div key={strategy.id} className="premium-card p-5 relative z-10 overflow-hidden border border-cyan/20 rounded-lg hover:shadow-lg hover:shadow-cyan/10 transition-all duration-300">
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
                            className="text-red-500 hover:text-red-400 h-8 w-8 glass hover:bg-gray-700/20"
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
                          className={`${strategy.isLive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-cyan/20 text-cyan border-cyan/30'} hover:bg-opacity-30`}
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
            <div className="premium-card p-6 text-center border border-cyan/20">
              <p className="text-gray-300 mb-4">No custom strategies created yet</p>
              <Button 
                onClick={() => navigate('/strategy-builder')}
                variant="gradient"
                className="w-full"
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
