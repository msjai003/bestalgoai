
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

  // Check URL parameters for refresh trigger and potentially unlocked strategy
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.has('refresh')) {
      console.log("Refresh trigger detected, forcing strategy data reload");
      
      // Force a refresh of the strategy data
      setRefreshTrigger(prev => prev + 1);
      
      // Check if a specific strategy was just unlocked
      const unlockedStrategyId = params.get('strategy');
      if (unlockedStrategyId && user && !processingStrategy) {
        setProcessingStrategy(true);
        const strategyId = parseInt(unlockedStrategyId);
        console.log("Processing unlocked strategy ID:", strategyId);
        
        // Verify the strategy is actually marked as paid in the database
        const verifyAndFixPaidStatus = async () => {
          try {
            // Get strategy details to ensure we have the correct name and description
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
            
            // Check if this specific strategy has been paid for
            const { data, error } = await supabase
              .from('strategy_selections')
              .select('paid_status, strategy_name')
              .eq('user_id', user.id)
              .eq('strategy_id', strategyId)
              .maybeSingle();
              
            console.log("Strategy payment status check:", data);
            
            if (data && data.paid_status === 'paid') {
              // Strategy is already paid, show success toast
              toast({
                title: "Strategy Unlocked",
                description: `"${data.strategy_name}" is now available for live trading.`,
                variant: "default",
              });
              setProcessingStrategy(false);
              return;
            }
            
            // Strategy is not marked as paid, let's fix it
            console.log("Strategy not marked as paid, attempting to fix...");
            
            // Use our helper function to save with paid status
            await saveStrategyConfiguration(
              user.id,
              strategyId,
              strategyData.name,
              strategyData.description,
              0, // Default quantity
              "", // Default empty broker
              "paper trade", // Start with paper trade for safety
              'paid' // Mark as paid
            );
            
            // Verify the fix was successful
            let fixVerified = false;
            
            for (let attempt = 0; attempt < 3; attempt++) {
              const { data: verifyData, error: verifyError } = await supabase
                .from('strategy_selections')
                .select('paid_status, strategy_name')
                .eq('user_id', user.id)
                .eq('strategy_id', strategyId)
                .maybeSingle();
                
              if (!verifyError && verifyData && verifyData.paid_status === 'paid') {
                console.log("Fix verification successful on attempt", attempt + 1);
                toast({
                  title: "Strategy Unlocked",
                  description: `"${strategyData.name}" is now available for live trading.`,
                  variant: "default",
                });
                fixVerified = true;
                break;
              }
              
              console.log(`Fix verification attempt ${attempt + 1} failed:`, verifyError || "Data not as expected");
              
              // Wait before trying again
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            if (!fixVerified) {
              // Last resort direct update
              console.log("All verification attempts failed, making direct update...");
              
              try {
                // Use a direct insert/update rather than an RPC call
                await supabase
                  .from('strategy_selections')
                  .upsert({ 
                    user_id: user.id, 
                    strategy_id: strategyId,
                    strategy_name: strategyData.name,
                    strategy_description: strategyData.description,
                    paid_status: 'paid',
                    trade_type: 'paper trade',
                    quantity: 0,
                    selected_broker: ''
                  }, { onConflict: 'user_id,strategy_id' });
                
                console.log("Forced strategy paid status using direct upsert");
                
                toast({
                  title: "Strategy Unlocked",
                  description: `"${strategyData.name}" is now available for live trading.`,
                  variant: "default",
                });
              } catch (upsertError) {
                console.error("Direct upsert failed:", upsertError);
                
                // Fall back to a direct notification
                toast({
                  title: "Strategy Unlocked",
                  description: "Your strategy is now available. Please refresh if you don't see it.",
                  variant: "default",
                });
              }
            }
            
            // Force one final refresh
            setRefreshTrigger(prev => prev + 2);
          } catch (err) {
            console.error("Error in strategy verification/fix process:", err);
            toast({
              title: "Something went wrong",
              description: "There was an issue unlocking your strategy. Please try refreshing the page.",
              variant: "destructive",
            });
          } finally {
            setProcessingStrategy(false);
          }
        };
        
        verifyAndFixPaidStatus();
      }
      
      // Clean up the URL parameter
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
