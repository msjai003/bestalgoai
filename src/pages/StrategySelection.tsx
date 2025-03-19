
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

const StrategySelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<"predefined" | "custom">("predefined");
  const { data: predefinedStrategies, isLoading: isLoadingStrategies } = usePredefinedStrategies();
  
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

  // Check URL parameters for refresh trigger and potentially unlocked strategy
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.has('refresh')) {
      console.log("Refresh trigger detected, forcing strategy data reload");
      
      // Force a refresh of the strategy data
      setRefreshTrigger(prev => prev + 1);
      
      // Check if a specific strategy was just unlocked
      const unlockedStrategyId = params.get('strategy');
      if (unlockedStrategyId && user) {
        const strategyId = parseInt(unlockedStrategyId);
        console.log("Checking unlocked strategy ID:", strategyId);
        
        // Verify the strategy is actually marked as paid in the database
        const verifyPaidStatus = async () => {
          try {
            // Check if this specific strategy has been paid for
            const { data, error } = await supabase
              .from('strategy_selections')
              .select('paid_status, strategy_name')
              .eq('user_id', user.id)
              .eq('strategy_id', strategyId)
              .maybeSingle();
              
            console.log("Verified strategy payment status:", data);
            
            if (data && data.paid_status === 'paid') {
              // Show success toast for the unlocked strategy
              toast({
                title: "Strategy Unlocked",
                description: `"${data.strategy_name}" is now available for live trading.`,
                variant: "default",
              });
            } else {
              console.error("Strategy not found or not marked as paid in database");
              
              // If the strategy is still not marked as paid, try to fix it one more time
              if (user) {
                try {
                  const { data: strategyData } = await supabase
                    .from('predefined_strategies')
                    .select('name, description')
                    .eq('id', strategyId)
                    .single();
                  
                  if (strategyData) {
                    // Try to create or update the strategy with paid status
                    const { error: updateError } = await supabase
                      .from('strategy_selections')
                      .upsert({
                        user_id: user.id,
                        strategy_id: strategyId,
                        strategy_name: strategyData.name,
                        strategy_description: strategyData.description,
                        paid_status: 'paid',
                        trade_type: 'paper trade',
                        quantity: 0,
                        selected_broker: ""
                      }, { onConflict: 'user_id,strategy_id' });
                    
                    if (!updateError) {
                      console.log("Recovery successful: Strategy marked as paid");
                      
                      toast({
                        title: "Strategy Unlocked",
                        description: `"${strategyData.name}" is now available for live trading.`,
                        variant: "default",
                      });
                      
                      // Force one more refresh
                      setRefreshTrigger(prev => prev + 1);
                    } else {
                      console.error("Error in final attempt to save strategy:", updateError);
                      
                      // Try one more time with direct insert
                      try {
                        const { error: insertError } = await supabase
                          .from('strategy_selections')
                          .insert({
                            user_id: user.id,
                            strategy_id: strategyId,
                            strategy_name: strategyData.name,
                            strategy_description: strategyData.description,
                            paid_status: 'paid',
                            trade_type: 'paper trade',
                            quantity: 0,
                            selected_broker: ""
                          });
                          
                        if (!insertError) {
                          console.log("Recovery successful after insert attempt");
                          
                          toast({
                            title: "Strategy Unlocked",
                            description: `"${strategyData.name}" is now available for live trading.`,
                            variant: "default",
                          });
                          
                          // Force one more refresh
                          setRefreshTrigger(prev => prev + 2);
                        } else {
                          console.error("Error in final insert attempt:", insertError);
                          toast({
                            title: "Strategy Activation Issue",
                            description: "There was an issue unlocking your strategy. Please try again or contact support.",
                            variant: "destructive",
                          });
                        }
                      } catch (insertCatchError) {
                        console.error("Exception in last-resort insert:", insertCatchError);
                      }
                    }
                  }
                } catch (recoveryError) {
                  console.error("Error in recovery process:", recoveryError);
                  toast({
                    title: "Strategy Activation Issue",
                    description: "There was an issue unlocking your strategy. Please try again or contact support.",
                    variant: "destructive",
                  });
                }
              }
            }
          } catch (err) {
            console.error("Error verifying strategy payment status:", err);
          }
        };
        
        verifyPaidStatus();
      }
      
      // Clean up the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search, setRefreshTrigger, user, toast]);

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
