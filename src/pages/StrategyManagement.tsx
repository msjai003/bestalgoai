import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Strategy } from "@/hooks/strategy/types";
import { useStrategyWishlist, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";
import { StrategySection } from "@/components/strategy/StrategySection";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { NoStrategiesFound } from "@/components/strategy/NoStrategiesFound";
import { useAuth } from "@/contexts/AuthContext";
import { DeleteConfirmationDialog } from "@/components/strategy/DeleteConfirmationDialog";

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { wishlistedStrategies, isLoading, hasPremium } = useStrategyWishlist();
  const [currentStrategyId, setCurrentStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<Strategy | null>(null);

  const handleToggleLiveMode = (id: number | string) => {
    const strategy = wishlistedStrategies.find(s => s.id === id);
    if (!strategy) return;
    
    const isPremium = typeof id === 'number' && id > 1;
    if (isPremium && !hasPremium && !strategy.isPaid) {
      sessionStorage.setItem('selectedStrategyId', id.toString());
      sessionStorage.setItem('redirectAfterPayment', '/pricing');
      navigate('/pricing');
      return;
    }
    
    setCurrentStrategyId(typeof id === 'string' ? parseInt(id, 10) : id);
    setTargetMode(strategy.isLive ? "paper" : "live");
    setConfirmationOpen(true);
  };

  const handleDeleteStrategy = async (id: number) => {
    const strategy = wishlistedStrategies.find(s => s.id === id);
    if (!strategy || !user) return;
    
    setStrategyToDelete(strategy);
    setDeleteConfirmationOpen(true);
  };
  
  const confirmDeleteStrategy = async () => {
    if (!user || !strategyToDelete) return;
    
    try {
      await removeFromWishlist(user.id, strategyToDelete.id);
      setDeleteConfirmationOpen(false);
      
      toast({
        title: "Success",
        description: "Strategy removed from wishlist",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error removing strategy from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove strategy from wishlist",
        variant: "destructive",
      });
    }
  };
  
  const cancelDeleteStrategy = () => {
    setDeleteConfirmationOpen(false);
    setStrategyToDelete(null);
  };

  const handleConfirmLiveMode = () => {
    setConfirmationOpen(false);
    toast({
      title: "Mode Change",
      description: `Strategy mode changed to ${targetMode === "live" ? "Live Trading" : "Paper Trading"}`,
    });
  };

  const handleCancelLiveMode = () => {
    setConfirmationOpen(false);
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen pb-16">
      <Header />
      <main className="pt-16 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Strategy Wishlist</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : wishlistedStrategies.length > 0 ? (
          <StrategySection
            title="My Wishlisted Strategies"
            icon={<Heart className="h-5 w-5 text-red-400" />}
            strategies={wishlistedStrategies}
            emptyMessage="You haven't added any strategies to your wishlist yet."
            actionButtonText="Browse Strategies"
            actionButtonPath="/strategy-selection"
            onDeleteStrategy={handleDeleteStrategy}
            onToggleLiveMode={handleToggleLiveMode}
          />
        ) : (
          <NoStrategiesFound onAddStrategies={() => navigate('/strategy-selection')} />
        )}
      </main>

      <TradingModeConfirmationDialog 
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        targetMode={targetMode}
        onConfirm={handleConfirmLiveMode}
        onCancel={handleCancelLiveMode}
      />
      
      {strategyToDelete && (
        <DeleteConfirmationDialog
          open={deleteConfirmationOpen}
          onOpenChange={setDeleteConfirmationOpen}
          strategyName={strategyToDelete.name}
          onConfirm={confirmDeleteStrategy}
          onCancel={cancelDeleteStrategy}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
