
import React, { useEffect } from 'react';
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
import { checkUserPremiumStatus } from '@/lib/supabase/subscription';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const LiveTrading = () => {
  const { user } = useAuth();
  
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
    confirmModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    navigate,
    setCurrentStrategyId,
    currentStrategyName,
    currentBrokerName,
    refreshStrategies
  } = useLiveTrading();

  // Check premium status when component mounts or when user changes
  useEffect(() => {
    if (!user) return;
    
    const verifyPremiumStatus = async () => {
      try {
        const hasPremium = await checkUserPremiumStatus(user.id);
        console.log("LiveTrading - Premium status check:", hasPremium);
        
        // If premium status changes, refresh strategies to update UI
        if (hasPremium) {
          console.log("User has premium access, refreshing strategies");
          refreshStrategies();
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
      }
    };
    
    verifyPremiumStatus();
    
    // Check for potential redirect after payment
    const redirectPath = sessionStorage.getItem('redirectAfterPayment');
    const selectedStrategyId = sessionStorage.getItem('selectedStrategyId');
    
    if (redirectPath === '/live-trading' && selectedStrategyId) {
      console.log("Detected return from payment for strategy:", selectedStrategyId);
      sessionStorage.removeItem('redirectAfterPayment');
      sessionStorage.removeItem('selectedStrategyId');
      
      // Force refresh strategies to reflect new premium status
      setTimeout(() => {
        refreshStrategies();
        toast.success("Your premium access has been activated!");
      }, 500);
    }
  }, [user, refreshStrategies]);

  return (
    <div className="bg-[#121212] min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 pb-24 px-4 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Live Trading</h1>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#2A2A2A] text-[#B0B0B0] hover:text-white"
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
            onEditQuantity={(id) => {
              setCurrentStrategyId(id);
              setShowQuantityDialog(true);
            }}
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
        onCancel={() => setShowConfirmationDialog(false)}
        strategyName={currentStrategyName}
        brokerName={currentBrokerName}
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
