
import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StrategySection } from "@/components/strategy/StrategySection";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { DeleteConfirmationDialog } from "@/components/strategy/DeleteConfirmationDialog";
import { StrategyFilter } from "@/components/strategy/StrategyFilter";
import { Star, User } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type FilterOption = "all" | "intraday" | "btst" | "positional";

interface Strategy {
  id: number | string;
  name: string;
  description: string;
  isCustom: boolean;
  isLive: boolean;
  isWishlisted: boolean;
  legs?: any;
  createdBy?: string;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
}

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [wishlistedStrategies, setWishlistedStrategies] = useState<Strategy[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");
  
  // Trading mode confirmation state
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentStrategyId, setCurrentStrategyId] = useState<number | string | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<{id: number | string, name: string} | null>(null);

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
          const supabaseStrategies = data.map(strategy => ({
            id: strategy.id,
            name: strategy.name,
            description: strategy.description,
            isCustom: true,
            isLive: false, // Default to paper trading
            isWishlisted: true,
            legs: strategy.legs,
            createdBy: strategy.created_by || user.email,
            performance: strategy.performance || {
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
    return strategies.filter(strategy => strategy.category === selectedFilter);
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

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 pb-20 px-4 flex-1">
        <section className="py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Strategy Management</h1>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide bg-gray-800/70 px-3 py-1.5 rounded-lg border border-gray-700">
                My Wishlist
              </span>
            </div>
          </div>
          
          <StrategyFilter 
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </section>

        <section className="mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <TooltipProvider>
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
            </TooltipProvider>
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
