import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import Header from "@/components/Header";
import { CustomStrategyWizard } from "@/components/strategy/CustomStrategyWizard";
import { useAuth } from "@/contexts/AuthContext";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { QuantityInputDialog } from "@/components/strategy/QuantityInputDialog";
import { BrokerSelectionDialog } from "@/components/strategy/BrokerSelectionDialog";
import { PredefinedStrategyList } from "@/components/strategy/PredefinedStrategyList";
import { StrategyTabNavigation } from "@/components/strategy/StrategyTabNavigation";
import { useStrategy } from "@/hooks/useStrategy";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { saveStrategyConfiguration } from "@/hooks/strategy/useStrategyConfiguration";

const StrategySelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<"predefined" | "custom">("predefined");
  const { data: predefinedStrategies, isLoading: isLoadingStrategies } = usePredefinedStrategies();
  const [processingStrategy, setProcessingStrategy] = useState(false);
  
  const {
    strategies,
    isLoading,
    confirmDialogOpen,
    setConfirmDialogOpen,
    quantityDialogOpen,
    setQuantityDialogOpen,
    brokerDialogOpen,
    setBrokerDialogOpen,
    targetMode,
    selectedStrategyId,
    handleToggleWishlist,
    handleToggleLiveMode,
    handleConfirmLiveMode,
    handleCancelLiveMode,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    refreshTrigger,
    setRefreshTrigger
  } = useStrategy(predefinedStrategies || []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.has('refresh')) {
      console.log("Refresh trigger detected, forcing strategy data reload");
      
      setRefreshTrigger(prev => prev + 1);
      
      const unlockedStrategyId = params.get('strategy');
      if (unlockedStrategyId && user && !processingStrategy) {
        setProcessingStrategy(true);
        const strategyId = parseInt(unlockedStrategyId);
        console.log("Processing unlocked strategy ID:", strategyId);
        
        const verifyAndUnlockStrategy = async () => {
          try {
            // First check if the user has a paid plan
            const { data: planData, error: planError } = await supabase
              .from('plan_details')
              .select('*')
              .eq('user_id', user.id)
              .order('selected_at', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            if (planError) {
              console.error('Error checking plan payment status:', planError);
              throw planError;
            }
            
            // Only proceed with unlocking if the user has a paid plan
            if (!planData || !planData.is_paid) {
              console.log("Cannot unlock strategy - user does not have a paid plan");
              toast({
                title: "Subscription Required",
                description: "You need an active paid subscription to unlock premium strategies.",
                variant: "destructive",
              });
              throw new Error("No paid plan found");
            }
            
            console.log("User has a paid plan, proceeding with strategy unlock");
            
            // Get strategy data first
            const { data: strategyData, error: strategyError } = await supabase
              .from('predefined_strategies')
              .select('name, description')
              .eq('id', strategyId)
              .single();
              
            if (strategyError) {
              console.error('Error fetching strategy details:', strategyError);
              throw strategyError;
            }
            
            if (!strategyData) {
              throw new Error('Strategy data not found');
            }
            
            console.log("Fetched strategy details:", strategyData);
            
            // Force direct insert/update with direct call to saveStrategyConfiguration
            await saveStrategyConfiguration(
              user.id,
              strategyId,
              strategyData.name,
              strategyData.description,
              0,  // Default quantity
              "", // Default empty broker
              "paper trade", // Default trade type
              'paid' // Critical: mark as paid
            );
            
            // Verify the strategy is now properly marked as paid
            const { data: verifyData, error: verifyError } = await supabase
              .from('strategy_selections')
              .select('paid_status, strategy_name')
              .eq('user_id', user.id)
              .eq('strategy_id', strategyId)
              .maybeSingle();
              
            if (verifyError) {
              console.error('Verification error:', verifyError);
              throw verifyError;
            }
            
            console.log("Strategy verification data:", verifyData);
            
            if (!verifyData || verifyData.paid_status !== 'paid') {
              console.log("Strategy still not marked as paid, using database function directly...");
              
              // Last resort: direct database function call
              const { error: rpcError } = await supabase
                .rpc('force_strategy_paid_status', {
                  p_user_id: user.id,
                  p_strategy_id: strategyId,
                  p_strategy_name: strategyData.name,
                  p_strategy_description: strategyData.description
                });
                
              if (rpcError) {
                console.error("Database function error:", rpcError);
                throw rpcError;
              }
              
              console.log("Database function executed, strategy should now be unlocked");
            }
            
            toast({
              title: "Strategy Unlocked",
              description: `"${strategyData.name}" is now available for live trading.`,
              variant: "default",
            });
            
            // Force one more refresh to ensure UI is updated
            setRefreshTrigger(prev => prev + 1);
          } catch (err) {
            console.error("Error in strategy verification/fix process:", err);
            toast({
              title: "Something went wrong",
              description: "There was an issue unlocking your strategy. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setProcessingStrategy(false);
          }
        };
        
        verifyAndUnlockStrategy();
      }
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search, setRefreshTrigger, user, toast, processingStrategy]);

  const handleDeployStrategy = () => {
    navigate("/backtest");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <TooltipProvider>
        <main className="pt-14 pb-16 flex-1 overflow-hidden">
          <section className="px-4 py-2 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-3">Strategy Selection</h1>
            
            <StrategyTabNavigation
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />
            
            <div className="flex-1 overflow-auto scrollbar-none">
              {selectedTab === "predefined" ? (
                <PredefinedStrategyList
                  strategies={strategies}
                  isLoading={isLoading}
                  onToggleWishlist={handleToggleWishlist}
                  onToggleLiveMode={handleToggleLiveMode}
                  user={user}
                />
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
      
      <BrokerSelectionDialog
        open={brokerDialogOpen}
        onOpenChange={setBrokerDialogOpen}
        onConfirm={handleBrokerSubmit}
        onCancel={handleCancelBroker}
      />
      
      <BottomNav />
    </div>
  );
};

export default StrategySelection;
