
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { StrategySection } from "@/components/strategy/StrategySection";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useStrategy } from "@/hooks/useStrategy";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";
import { ChartBar, Briefcase, CheckCircle, Plus } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/strategy/DeleteConfirmationDialog";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TradingModeFilter } from "@/components/strategy/TradingModeFilter";

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("live");
  const [tradingMode, setTradingMode] = useState<"all" | "live" | "paper">("all");
  const { data: predefinedStrategies } = usePredefinedStrategies();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<{ id: number, name: string } | null>(null);
  
  const {
    strategies,
    isLoading,
    handleToggleLiveMode
  } = useStrategy(predefinedStrategies || []);
  
  // Filter strategies based on their tradeType and trading mode
  const liveStrategies = strategies.filter(s => s.isLive === true && (tradingMode === "all" || (tradingMode === "live" && s.isLive) || (tradingMode === "paper" && !s.isLive)));
  const paperStrategies = strategies.filter(s => s.isLive === false && s.tradeType !== 'completed' && (tradingMode === "all" || (tradingMode === "live" && s.isLive) || (tradingMode === "paper" && !s.isLive)));
  const completedStrategies = strategies.filter(s => s.tradeType === 'completed');

  // Create a delete strategy handler function
  const handleDeleteStrategy = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      setStrategyToDelete({ id, name: strategy.name });
      setDeleteDialogOpen(true);
    }
  };

  // Function to actually delete the strategy after confirmation
  const confirmDeleteStrategy = async () => {
    if (strategyToDelete) {
      try {
        // In a real app, you would call an API to delete the strategy
        console.log(`Strategy ${strategyToDelete.id} deleted`);
        setDeleteDialogOpen(false);
        setStrategyToDelete(null);
      } catch (error) {
        console.error("Error deleting strategy:", error);
      }
    }
  };

  return (
    <div className="main-container">
      <Header />
      <main className="page-container pb-24">
        <div className="section-header mb-6">
          <h1 className="section-title">Strategy Management</h1>
          <Button 
            onClick={() => navigate('/strategy-selection')}
            variant="outline" 
            size="sm"
            className="bg-charcoalSecondary hover:bg-charcoalSecondary/90 border border-gray-700/50 text-cyan hover:text-cyan/90 ml-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Strategy
          </Button>
        </div>
        
        <SegmentedControl
          segments={[
            { label: "Live", value: "live", icon: <ChartBar className="h-4 w-4" />, count: liveStrategies.length },
            { label: "Paper", value: "paper", icon: <Briefcase className="h-4 w-4" />, count: paperStrategies.length },
            { label: "Completed", value: "completed", icon: <CheckCircle className="h-4 w-4" />, count: completedStrategies.length }
          ]}
          value={activeTab}
          onChange={setActiveTab}
          size="md"
          variant="primary"
          fullWidth
          className="mb-5"
        />
        
        {activeTab !== "completed" && (
          <div className="mb-6">
            <TradingModeFilter
              selectedMode={tradingMode}
              onModeChange={setTradingMode}
            />
          </div>
        )}
        
        <div className="content-container">
          {activeTab === "live" && (
            <StrategySection
              title="Live Trading Strategies"
              icon={<ChartBar className="h-5 w-5 text-cyan" />}
              strategies={liveStrategies}
              emptyMessage="You don't have any live trading strategies yet."
              actionButtonText="Add Strategy"
              actionButtonPath="/strategy-selection"
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
            />
          )}
          
          {activeTab === "paper" && (
            <StrategySection
              title="Paper Trading Strategies"
              icon={<Briefcase className="h-5 w-5 text-cyan" />}
              strategies={paperStrategies}
              emptyMessage="You don't have any paper trading strategies yet."
              actionButtonText="Add Strategy"
              actionButtonPath="/strategy-selection"
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
            />
          )}
          
          {activeTab === "completed" && (
            <StrategySection
              title="Completed Strategies"
              icon={<CheckCircle className="h-5 w-5 text-cyan" />}
              strategies={completedStrategies}
              emptyMessage="You don't have any completed strategies yet."
              actionButtonText=""
              actionButtonPath=""
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
              showEmptyStateButton={false}
            />
          )}
        </div>
      </main>
      
      {/* Delete Confirmation Dialog */}
      {strategyToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          strategyName={strategyToDelete.name}
          onConfirm={confirmDeleteStrategy}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      )}
      
      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
