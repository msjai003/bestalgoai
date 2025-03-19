
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
        
        const unlockStrategyAfterPayment = async () => {
          try {
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
            
            let unlockSuccess = false;
            
            // Method 1: Use the saveStrategyConfiguration function with paid status
            try {
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
              unlockSuccess = true;
              console.log("Method 1 successful: Strategy unlocked via saveStrategyConfiguration");
            } catch (err) {
              console.error("Method 1 failed:", err);
            }
            
            // Method 2: If method 1 fails, try direct database function
            if (!unlockSuccess) {
              try {
                console.log("Trying Method 2: Using database function directly");
                const { error: rpcError } = await supabase
                  .rpc('force_strategy_paid_status', {
                    p_user_id: user.id,
                    p_strategy_id: strategyId,
                    p_strategy_name: strategyData.name,
                    p_strategy_description: strategyData.description
                  });
                  
                if (rpcError) {
                  console.error("Database function error:", rpcError);
                } else {
                  unlockSuccess = true;
                  console.log("Method 2 successful: Strategy unlocked via database function");
                }
              } catch (err) {
                console.error("Method 2 failed:", err);
              }
            }
            
            // Method 3: Last resort - direct insert/update
            if (!unlockSuccess) {
              try {
                console.log("Trying Method 3: Direct upsert");
                const { error: upsertError } = await supabase
                  .from('strategy_selections')
                  .upsert({
                    user_id: user.id,
                    strategy_id: strategyId,
                    strategy_name: strategyData.name,
                    strategy_description: strategyData.description || "",
                    paid_status: 'paid',
                    trade_type: "paper trade",
                    quantity: 0,
                    selected_broker: ""
                  }, { 
                    onConflict: 'user_id,strategy_id',
                    ignoreDuplicates: false 
                  });
                  
                if (upsertError) {
                  console.error("Direct upsert error:", upsertError);
                } else {
                  unlockSuccess = true;
                  console.log("Method 3 successful: Strategy unlocked via direct upsert");
                }
              } catch (err) {
                console.error("Method 3 failed:", err);
              }
            }
            
            // Verify the strategy is properly unlocked
            const { data: verifyData, error: verifyError } = await supabase
              .from('strategy_selections')
              .select('paid_status, strategy_name')
              .eq('user_id', user.id)
              .eq('strategy_id', strategyId)
              .maybeSingle();
              
            if (verifyError) {
              console.error('Verification error:', verifyError);
            } else if (verifyData) {
              console.log("Strategy verification data:", verifyData);
              if (verifyData.paid_status === 'paid') {
                unlockSuccess = true;
              }
            }
            
            if (unlockSuccess) {
              toast({
                title: "Strategy Unlocked",
                description: `"${strategyData.name}" is now available for live trading.`,
                variant: "default",
              });
              
              // Force one more refresh to ensure UI is updated
              setRefreshTrigger(prev => prev + 1);
            } else {
              throw new Error("All unlock methods failed");
            }
          } catch (err) {
            console.error("Error in strategy unlock process:", err);
            toast({
              title: "Something went wrong",
              description: "There was an issue unlocking your strategy. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setProcessingStrategy(false);
          }
        };
        
        unlockStrategyAfterPayment();
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
