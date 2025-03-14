
import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { TradingModeFilter } from "@/components/strategy/TradingModeFilter";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { QuantityInputDialog } from "@/components/strategy/QuantityInputDialog";
import { NoStrategiesFound } from '@/components/strategy/NoStrategiesFound';
import { StrategyList } from '@/components/strategy/StrategyList';
import { TradingControls } from '@/components/strategy/TradingControls';
import { useLiveTrading } from '@/hooks/strategy/useLiveTrading';

const LiveTrading = () => {
  const {
    isActive,
    selectedMode,
    strategies,
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    targetMode,
    handleTradingToggle,
    handleModeChange,
    handleToggleLiveMode,
    handleOpenQuantityDialog,
    confirmModeChange,
    cancelModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    navigate
  } = useLiveTrading();

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Live Trading</h1>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700 text-gray-400 hover:text-white"
            onClick={() => navigate('/strategy-selection')}
          >
            Add Strategy
          </Button>
        </div>

        <div className="mb-6">
          <TradingModeFilter 
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />
        </div>

        {strategies.length > 0 ? (
          <StrategyList 
            strategies={strategies}
            onToggleLiveMode={handleToggleLiveMode}
            onEditQuantity={handleOpenQuantityDialog}
            onViewDetails={(id) => navigate(`/strategy-details/${id}`)}
          />
        ) : (
          <NoStrategiesFound onAddStrategies={() => navigate('/strategy-selection')} />
        )}

        {strategies.length > 0 && (
          <TradingControls 
            isActive={isActive}
            onToggleTrading={handleTradingToggle}
          />
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
    </div>
  );
};

export default LiveTrading;
