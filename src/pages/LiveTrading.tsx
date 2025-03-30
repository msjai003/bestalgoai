
import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { TradingModeFilter } from "@/components/strategy/TradingModeFilter";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { QuantityInputDialog } from "@/components/strategy/QuantityInputDialog";
import { BrokerSelectionDialog } from "@/components/strategy/BrokerSelectionDialog";
import { NoStrategiesFound } from '@/components/strategy/NoStrategiesFound';
import { StrategyList } from '@/components/strategy/StrategyList';
import { TradingControls } from '@/components/strategy/TradingControls';
import { useLiveTrading } from '@/hooks/strategy/useLiveTrading';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

const LiveTrading = () => {
  const {
    isActive,
    selectedMode,
    strategies,
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog,
    setShowBrokerDialog,
    targetMode,
    handleTradingToggle,
    handleModeChange,
    handleToggleLiveMode,
    handleOpenQuantityDialog,
    confirmModeChange,
    cancelModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    navigate
  } = useLiveTrading();

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="relative pt-16 pb-20 z-10 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Live Trading</h1>
            <p className="text-gray-400">Manage and control your active trading strategies</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3 md:mt-0 border-cyan/20 text-cyan hover:bg-cyan/10 hover:text-cyan flex items-center"
            onClick={() => navigate('/strategy-selection')}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Strategy
          </Button>
        </div>

        <div className="mb-6 glass-card p-4 rounded-xl border border-white/5">
          <TradingModeFilter 
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />
        </div>

        {strategies.length > 0 ? (
          <div className="space-y-4">
            <StrategyList 
              strategies={strategies}
              onToggleLiveMode={handleToggleLiveMode}
              onEditQuantity={handleOpenQuantityDialog}
              onViewDetails={(id) => navigate(`/strategy-details/${id}`)}
            />
            
            <TradingControls 
              isActive={isActive}
              onToggleTrading={handleTradingToggle}
            />
          </div>
        ) : (
          <div className="premium-card p-8 rounded-xl">
            <NoStrategiesFound onAddStrategies={() => navigate('/strategy-selection')} />
          </div>
        )}
      </main>
      <BottomNav />
      
      <TradingModeConfirmationDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
        targetMode={targetMode}
        onConfirm={confirmModeChange}
        onCancel={cancelModeChange}
      />
      
      <QuantityInputDialog
        open={showQuantityDialog}
        onOpenChange={setShowQuantityDialog}
        onConfirm={handleQuantitySubmit}
        onCancel={handleCancelQuantity}
      />
      
      <BrokerSelectionDialog
        open={showBrokerDialog}
        onOpenChange={setShowBrokerDialog}
        onConfirm={handleBrokerSubmit}
        onCancel={handleCancelBroker}
      />
    </div>
  );
};

export default LiveTrading;
