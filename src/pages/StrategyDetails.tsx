
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lock, Play, ChevronLeft, Award, TrendingUp, AlertCircle, Layers } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";
import { useLiveTrading } from "@/hooks/strategy/useLiveTrading";
import { useStrategyDetails } from "@/hooks/strategy/useStrategyDetails";
import { useStrategyDialogs } from "@/hooks/strategy/useStrategyDialogs";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { QuantityInputDialog } from "@/components/strategy/QuantityInputDialog";
import { BrokerSelectionDialog } from "@/components/strategy/BrokerSelectionDialog";
import { StrategyMetrics } from "@/components/strategy/details/StrategyMetrics";
import { StrategyParameters } from "@/components/strategy/details/StrategyParameters";
import { StrategyLegs } from "@/components/strategy/details/StrategyLegs";
import { LockedStrategyView } from "@/components/strategy/details/LockedStrategyView";
import { getStrategyDetailsParams, getStrategyLegs } from "@/utils/strategy/strategyDetailsUtils";
import { updateStrategyLiveConfig } from "@/hooks/strategy/useStrategyDatabase";
import { toast } from "sonner";

const StrategyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: strategies } = usePredefinedStrategies();
  const strategyId = parseInt(id || "0", 10);
  const strategy = strategies?.find((s) => s.id === strategyId);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'legs'>('overview');
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    isWishlisted,
    isLoading,
    hasPremium,
    isPaidStrategy,
    handleToggleWishlist
  } = useStrategyDetails(strategy, user);

  // Use the strategy dialogs hook for deploy functionality
  const {
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog,
    setShowBrokerDialog,
    targetStrategyId,
    setTargetStrategyId,
    targetMode,
    setTargetMode,
    pendingQuantity,
    setPendingQuantity,
    resetDialogState,
    openBrokerDialogAfterQuantity
  } = useStrategyDialogs();

  const handleDeployStrategy = () => {
    if (!user || !strategy) {
      toast.error("Please log in to deploy strategies");
      return;
    }

    // Check if strategy is premium and user doesn't have access
    const isPremium = strategy.package === 'premium' || 
                     strategy.package === 'Premium' ||
                     strategy.name.toLowerCase().includes('evercrest') || 
                     strategy.name.toLowerCase().includes('nova') || 
                     strategy.name.toLowerCase().includes('velox') || 
                     strategy.name.toLowerCase().includes('speed up');

    const isZenflow = strategy.name.toLowerCase().includes('zen');
    const canAccess = !isPremium || hasPremium || isPaidStrategy || isZenflow;

    if (isPremium && !canAccess) {
      sessionStorage.setItem('selectedStrategyId', strategyId.toString());
      navigate('/pricing');
      return;
    }

    // Set up the deploy flow
    setTargetStrategyId(strategyId);
    setTargetMode("live");
    setShowConfirmationDialog(true);
  };

  const handleConfirmLiveTrading = () => {
    setShowConfirmationDialog(false);
    setShowQuantityDialog(true);
  };

  const handleQuantitySubmit = (quantity: number) => {
    setPendingQuantity(quantity);
    openBrokerDialogAfterQuantity(quantity);
  };

  const handleQuantityCancel = () => {
    setShowQuantityDialog(false);
    resetDialogState();
  };

  const handleBrokerSubmit = async (brokerId: string, brokerName: string, username: string) => {
    try {
      setShowBrokerDialog(false);
      
      if (!user || !targetStrategyId || !strategy) {
        toast.error("Missing required information");
        return;
      }
      
      await updateStrategyLiveConfig(
        user.id,
        targetStrategyId,
        pendingQuantity,
        brokerName,
        username,
        "live",
        strategy.name
      );
      
      toast.success(`${strategy.name} deployed successfully in live trading mode`);
      resetDialogState();
      
    } catch (error) {
      console.error("Error deploying strategy:", error);
      toast.error("Failed to deploy strategy");
    }
  };

  const handleBrokerCancel = () => {
    setShowBrokerDialog(false);
    resetDialogState();
  };

  if (!strategy) {
    return (
      <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center mb-4">
            <Link to="/strategy-selection" className="flex items-center text-gray-400 hover:text-cyan transition-colors">
              <ChevronLeft className="mr-1 h-5 w-5" />
              Back to Strategies
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Strategy Not Found</h1>
            <p className="text-gray-500">The requested strategy does not exist.</p>
          </div>
        </main>
      </div>
    );
  }

  // Determine if this is a premium strategy that requires payment
  const isPremium = strategy.package === 'premium' || 
                   strategy.package === 'Premium' ||
                   strategy.name.toLowerCase().includes('evercrest') || 
                   strategy.name.toLowerCase().includes('nova') || 
                   strategy.name.toLowerCase().includes('velox') || 
                   strategy.name.toLowerCase().includes('speed up');

  // A strategy is accessible if it's not premium OR user has premium access OR this specific strategy has been paid for
  // But Zenflow is always free
  const isZenflow = strategy.name.toLowerCase().includes('zen');
  const canAccess = !isPremium || hasPremium || isPaidStrategy || isZenflow;

  console.log(`Strategy Details for ${strategy.name}:`, {
    isPremium,
    hasPremium,
    isPaidStrategy,
    isZenflow,
    canAccess
  });
  
  const strategyDetailsParams = getStrategyDetailsParams(strategy);
  const strategyLegs = getStrategyLegs(strategy);

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <Link to="/strategy-selection" className="flex items-center text-gray-400 hover:text-cyan transition-colors">
            <ChevronLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Back to Strategies</span>
          </Link>
        </div>

        <Card className="bg-charcoalSecondary border border-cyan/20 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-white bg-clip-text bg-gradient-to-r from-cyan to-cyan/80">{strategy?.name}</h1>
              <div className="flex space-x-3">
                {isPremium && !canAccess && (
                  <Button 
                    variant="outline"
                    className="bg-gradient-to-r from-cyan/20 to-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20 rounded-full px-6 py-3 shadow-md transition-all duration-300 hover:shadow-cyan/20 hover:shadow-lg"
                    onClick={() => {
                      sessionStorage.setItem('selectedStrategyId', strategyId.toString());
                      navigate('/pricing');
                    }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock
                  </Button>
                )}
                <Button 
                  size="icon"
                  variant="ghost"
                  className="text-pink-500 hover:text-pink-400 h-12 w-12"
                  onClick={handleToggleWishlist}
                  disabled={isLoading}
                >
                  <Heart className="h-6 w-6" fill={isWishlisted ? "currentColor" : "none"} />
                </Button>
              </div>
            </div>
            
            {canAccess ? (
              <div className="space-y-10">
                <p className="text-gray-400 mb-10 leading-relaxed text-lg lg:text-xl">{strategy.description}</p>

                <StrategyMetrics strategy={strategy} />

                <div className="space-y-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div className="flex space-x-4">
                      <Button
                        variant={activeTab === 'overview' ? 'default' : 'outline'}
                        className={`px-6 py-3 ${
                          activeTab === 'overview'
                            ? 'bg-cyan text-charcoalPrimary'
                            : 'bg-transparent border-gray-700 text-gray-300 hover:text-cyan hover:border-cyan/50'
                        }`}
                        onClick={() => setActiveTab('overview')}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Overview
                      </Button>
                      <Button
                        variant={activeTab === 'legs' ? 'default' : 'outline'}
                        className={`px-6 py-3 ${
                          activeTab === 'legs'
                            ? 'bg-cyan text-charcoalPrimary'
                            : 'bg-transparent border-gray-700 text-gray-300 hover:text-cyan hover:border-cyan/50'
                        }`}
                        onClick={() => setActiveTab('legs')}
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        Legs
                      </Button>
                    </div>
                    {activeTab === 'overview' && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Advanced View</span>
                        <Switch 
                          checked={showAdvanced} 
                          onCheckedChange={setShowAdvanced}
                        />
                      </div>
                    )}
                  </div>
                  
                  {activeTab === 'overview' ? (
                    <div className="space-y-8">
                      <ScrollArea className="h-64 bg-charcoalSecondary/40 rounded-lg p-6 border border-gray-700/50">
                        {showAdvanced ? (
                          <div className="space-y-6">
                            <p className="text-gray-300 leading-relaxed">{strategy.description}</p>
                            <div className="p-4 bg-charcoalSecondary/70 rounded border border-gray-700/50">
                              <h4 className="text-cyan text-sm font-medium mb-3">Technical Indicators</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                                <li>Moving Average Crossover (EMA 9/21)</li>
                                <li>Relative Strength Index (RSI)</li>
                                <li>Volume Profile Analysis</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-charcoalSecondary/70 rounded border border-gray-700/50">
                              <h4 className="text-cyan text-sm font-medium mb-3">Entry Conditions</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                                <li>EMA 9 crosses above EMA 21</li>
                                <li>RSI moves above 50 from below</li>
                                <li>Volume confirms price movement</li>
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300 leading-relaxed">{strategy.description}</p>
                        )}
                      </ScrollArea>
                      <StrategyParameters strategyDetailsParams={strategyDetailsParams} />
                    </div>
                  ) : (
                    <div className="mb-8">
                      <StrategyLegs strategyLegs={strategyLegs} />
                    </div>
                  )}

                  <div className="p-6 bg-gradient-to-r from-cyan/10 to-cyan/5 rounded-lg border border-cyan/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="h-6 w-6 text-cyan" />
                      <h3 className="text-xl font-semibold text-white">Performance Highlights</h3>
                    </div>
                    <ul className="space-y-3 pl-9">
                      <li className="text-gray-300 list-disc">Consistent returns in ranging markets</li>
                      <li className="text-gray-300 list-disc">Optimal for medium-term horizons (1-3 days)</li>
                      <li className="text-gray-300 list-disc">Manages downside risk with adaptive stop-loss</li>
                    </ul>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-charcoalPrimary rounded-full border border-gray-700 mr-4">
                        <AlertCircle className="h-6 w-6 text-cyan" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Risk Level</p>
                        <p className="font-medium text-white text-lg">Moderate</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-charcoalPrimary px-8 py-4 rounded-lg shadow-lg hover:shadow-cyan/20 transition-all duration-300 font-medium text-lg"
                      onClick={handleDeployStrategy}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Deploy Strategy
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <LockedStrategyView 
                strategyName={strategy.name}
                strategyId={strategyId}
                onUnlock={() => {
                  sessionStorage.setItem('selectedStrategyId', strategyId.toString());
                  navigate('/pricing');
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Deploy Strategy Dialogs */}
        <TradingModeConfirmationDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
          targetMode="live"
          strategyName={strategy?.name || ""}
          onConfirm={handleConfirmLiveTrading}
          onCancel={() => {
            setShowConfirmationDialog(false);
            resetDialogState();
          }}
        />

        <QuantityInputDialog
          open={showQuantityDialog}
          onOpenChange={setShowQuantityDialog}
          onConfirm={handleQuantitySubmit}
          onCancel={handleQuantityCancel}
        />

        <BrokerSelectionDialog
          open={showBrokerDialog}
          onOpenChange={setShowBrokerDialog}
          onConfirm={handleBrokerSubmit}
          onCancel={handleBrokerCancel}
        />
      </main>
    </div>
  );
};

export default StrategyDetails;
