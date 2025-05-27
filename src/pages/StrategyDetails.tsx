import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lock, Play, ChevronLeft, Award, BarChart3, TrendingUp, AlertCircle, Clock, Settings, Filter, Zap, Layers } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";
import { addToWishlist, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";
import { checkStrategyAccess } from "@/lib/supabase/subscription";
import { useLiveTrading } from "@/hooks/strategy/useLiveTrading";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { QuantityInputDialog } from "@/components/strategy/QuantityInputDialog";
import { BrokerSelectionDialog } from "@/components/strategy/BrokerSelectionDialog";

const StrategyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: strategies } = usePredefinedStrategies();
  const strategyId = parseInt(id || "0", 10);
  const strategy = strategies?.find((s) => s.id === strategyId);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'legs'>('overview');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaidStrategy, setIsPaidStrategy] = useState(false);

  // Use the live trading hook for deploy functionality
  const {
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog,
    setShowBrokerDialog,
    targetMode,
    confirmModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    currentStrategyName,
    currentBrokerName,
    refreshStrategies
  } = useLiveTrading();

  // Helper function to convert leg property to string
  const formatLegProperty = (property: any): string => {
    if (typeof property === 'string') {
      return property;
    }
    if (typeof property === 'object' && property !== null) {
      if (property.enabled !== undefined) {
        return property.enabled ? (property.value?.toString() || 'On') : 'Off';
      }
      return JSON.stringify(property);
    }
    return 'Off';
  };

  // Function to get strategy details from strategy_details column
  const getStrategyDetailsParams = () => {
    if (!strategy || !strategy.strategy_details) {
      console.log('No strategy or strategy_details found');
      return {
        instrumentSettings: [],
        timeSettings: [],
        executionSettings: [],
        other: []
      };
    }
    
    const strategyDetails = strategy.strategy_details;
    console.log('Processing strategy details for:', strategy.name, strategyDetails);
    
    const result = {
      instrumentSettings: [] as Array<{name: string, value: string}>,
      timeSettings: [] as Array<{name: string, value: string}>,
      executionSettings: [] as Array<{name: string, value: string}>,
      other: [] as Array<{name: string, value: string}>
    };
    
    // Define categories for organizing the data based on actual field names from database
    const instrumentKeys = [
      'Index', 'Segment', 'Underlying from', 'Position', 'Option Type',
      'index', 'segment', 'underlyingFrom', 'position', 'optionType',
      'instrumentSettings'
    ];
    
    const timeKeys = [
      'Entry Time', 'Exit Time', 'Expiry', 'No Re-entry After',
      'entryTime', 'exitTime', 'expiry', 'noReentryAfter',
      'entrySettings', 'timeSettings'
    ];
    
    const executionKeys = [
      'Square Off', 'Trail SL to Break-even price', 'Leg Selection',
      'Total Lot', 'Strike Criteria', 'Premium', 'Strategy Type',
      'squareOff', 'trailSLToBreakeven', 'legSelection', 'totalLot',
      'strikeCriteria', 'premium', 'strategyType', 'legwiseSettings',
      'legBuilder', 'executionSettings'
    ];
    
    // Process each key-value pair from strategy_details
    Object.entries(strategyDetails).forEach(([key, value]) => {
      // Skip the Legs array as it's handled separately
      if (key === 'Legs') {
        return;
      }
      
      // Handle nested objects (like instrumentSettings, entrySettings, etc.)
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // If it's a nested object, process its properties
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue === null || nestedValue === undefined) {
            return;
          }
          
          let stringValue = '';
          if (typeof nestedValue === 'boolean') {
            stringValue = nestedValue ? 'Yes' : 'No';
          } else if (typeof nestedValue === 'object' && nestedValue !== null) {
            // Type assertion for the object with enabled property
            const objWithEnabled = nestedValue as { enabled?: boolean; value?: any };
            if (objWithEnabled.enabled !== undefined) {
              stringValue = objWithEnabled.enabled ? (objWithEnabled.value?.toString() || 'On') : 'Off';
            } else {
              stringValue = JSON.stringify(nestedValue);
            }
          } else {
            stringValue = String(nestedValue);
          }
          
          // Skip empty or meaningless values
          if (!stringValue || stringValue === '' || stringValue === 'Not selected' || stringValue === 'null') {
            return;
          }
          
          // Categorize based on the parent key and nested key
          const displayName = `${key} - ${nestedKey}`;
          
          if (instrumentKeys.some(k => key.toLowerCase().includes(k.toLowerCase()) || nestedKey.toLowerCase().includes(k.toLowerCase()))) {
            result.instrumentSettings.push({ name: displayName, value: stringValue });
          } else if (timeKeys.some(k => key.toLowerCase().includes(k.toLowerCase()) || nestedKey.toLowerCase().includes(k.toLowerCase()))) {
            result.timeSettings.push({ name: displayName, value: stringValue });
          } else if (executionKeys.some(k => key.toLowerCase().includes(k.toLowerCase()) || nestedKey.toLowerCase().includes(k.toLowerCase()))) {
            result.executionSettings.push({ name: displayName, value: stringValue });
          } else {
            result.other.push({ name: displayName, value: stringValue });
          }
        });
        return;
      }
      
      // Handle primitive values
      let stringValue = '';
      if (value === null || value === undefined) {
        return; // Skip null/undefined values
      } else if (typeof value === 'boolean') {
        stringValue = value ? 'Yes' : 'No';
      } else if (typeof value === 'object') {
        // Handle object values by extracting meaningful information
        const objWithEnabled = value as { enabled?: boolean; value?: any };
        if (objWithEnabled.enabled !== undefined) {
          stringValue = objWithEnabled.enabled ? (objWithEnabled.value?.toString() || 'On') : 'Off';
        } else {
          stringValue = JSON.stringify(value);
        }
      } else {
        stringValue = String(value);
      }
      
      // Skip empty strings, "Not selected", and other meaningless values
      if (!stringValue || stringValue === '' || stringValue === 'Not selected' || stringValue === 'null') {
        return;
      }
      
      if (instrumentKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        result.instrumentSettings.push({ name: key, value: stringValue });
      } else if (timeKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        result.timeSettings.push({ name: key, value: stringValue });
      } else if (executionKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        result.executionSettings.push({ name: key, value: stringValue });
      } else {
        result.other.push({ name: key, value: stringValue });
      }
    });
    
    console.log('Processed strategy details:', result);
    return result;
  };

  // Function to get the legs from strategy_details
  const getStrategyLegs = () => {
    if (!strategy || !strategy.strategy_details || !strategy.strategy_details.Legs) {
      console.log('No legs found in strategy details');
      return [];
    }
    
    console.log('Strategy legs:', strategy.strategy_details.Legs);
    return strategy.strategy_details.Legs;
  };

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !strategy) return;
      
      try {
        const { data, error } = await supabase
          .from('strategy_selections')
          .select('id, paid_status')
          .eq('user_id', user.id)
          .eq('strategy_id', strategy.id);
          
        if (error) {
          console.error('Error checking wishlist status:', error);
          return;
        }
        
        setIsWishlisted(data && data.length > 0);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_paid', true)
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data && (data.plan_name === 'Premium' || data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
          setHasPremium(true);
          console.log('User has active premium subscription');
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };

    // Check specific strategy access
    const checkSpecificStrategyAccess = async () => {
      if (!user || !strategy) return;

      try {
        // Use the checkStrategyAccess function to check if this strategy is accessible
        const hasAccess = await checkStrategyAccess(user.id, strategy.id);
        
        console.log(`Strategy ${strategy.id} access check:`, hasAccess);
        
        if (hasAccess) {
          setIsPaidStrategy(true);
        }
      } catch (error) {
        console.error('Error checking specific strategy access:', error);
      }
    };
    
    checkWishlistStatus();
    checkPremiumStatus();
    checkSpecificStrategyAccess();
  }, [user, strategy]);

  // Check if user can access this premium strategy
  useEffect(() => {
    // Skip showing the toast until we've checked for access and ensure we have necessary data
    if (!user || !strategy) return;
    
    const isPremiumStrategy = strategy && (
      strategy.package === 'premium' || 
      strategy.package === 'Premium' ||
      strategy.name.toLowerCase().includes('evercrest') || 
      strategy.name.toLowerCase().includes('nova') || 
      strategy.name.toLowerCase().includes('velox') || 
      strategy.name.toLowerCase().includes('speed up')
    ) && !strategy.name.toLowerCase().includes('zen');
    
    console.log('Access check for strategy details:', {
      strategyId: strategy.id,
      strategyName: strategy.name,
      isPremiumStrategy,
      hasPremium,
      isPaidStrategy,
      shouldShowToast: isPremiumStrategy && !hasPremium && !isPaidStrategy
    });
    
    // We'll intentionally NOT show any toast message here
    // The UI will automatically handle showing locked/unlocked content based on isPremium state
  }, [strategy, hasPremium, isPaidStrategy, user]);

  const handleToggleWishlist = async () => {
    if (!user || !strategy) {
      toast({
        description: "Please log in to add strategies to your wishlist",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!isWishlisted) {
        // Add to wishlist
        await addToWishlist(user.id, strategy.id, strategy.name, strategy.description);
        
        setIsWishlisted(true);
        toast({
          description: "Strategy has been added to your wishlist",
        });
      } else {
        // Remove from wishlist
        await removeFromWishlist(user.id, strategy.id);
        
        setIsWishlisted(false);
        toast({
          description: "Strategy has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      toast({
        description: "Failed to update wishlist in database",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    sessionStorage.setItem('selectedStrategyId', strategyId.toString());
    navigate('/pricing');
  };

  const handleDeployStrategy = () => {
    if (!user || !strategy) {
      toast({
        description: "Please log in to deploy strategies",
      });
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

    // Show the live trading confirmation dialog
    setShowConfirmationDialog(true);
  };

  if (!strategy) {
    return (
      <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
        <Header />
        <main className="container mx-auto px-4 py-8">
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

  // A strategy is accessible if:
  // - it's not premium, OR
  // - the user has premium access (hasPremium), OR
  // - this specific strategy has been individually paid for (isPaidStrategy)
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
  
  const strategyDetailsParams = getStrategyDetailsParams();
  const strategyLegs = getStrategyLegs();

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/strategy-selection" className="flex items-center text-gray-400 hover:text-cyan transition-colors">
            <ChevronLeft className="mr-1 h-5 w-5" />
            <span className="font-medium">Back to Strategies</span>
          </Link>
        </div>

        <Card className="bg-charcoalSecondary border border-cyan/20 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white bg-clip-text bg-gradient-to-r from-cyan to-cyan/80">{strategy?.name}</h1>
              <div className="flex space-x-2">
                {isPremium && !canAccess && (
                  <Button 
                    variant="outline"
                    className="bg-gradient-to-r from-cyan/20 to-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20 rounded-full px-4 py-2 shadow-md transition-all duration-300 hover:shadow-cyan/20 hover:shadow-lg"
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
                  className="text-pink-500 hover:text-pink-400"
                  onClick={handleToggleWishlist}
                  disabled={isLoading}
                >
                  <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
                </Button>
              </div>
            </div>
            
            {canAccess ? (
              <div>
                <p className="text-gray-400 mb-8 leading-relaxed md:text-lg">{strategy.description}</p>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center">
                    <BarChart3 className="h-5 w-5 text-cyan mr-2" />
                    Key Metrics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">Win Rate</p>
                      <p className="text-cyan font-semibold text-xl">{strategy.performance.winRate}</p>
                    </div>
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">Average Return</p>
                      <p className="text-cyan font-semibold text-xl">{strategy.performance.avgProfit}</p>
                    </div>
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">Max Drawdown</p>
                      <p className="text-cyan font-semibold text-xl">{strategy.performance.drawdown}</p>
                    </div>
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">Risk Score</p>
                      <p className="text-cyan font-semibold text-xl">
                        {strategy.parameters?.find(p => p.name === "Risk Score")?.value || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex space-x-4">
                      <Button
                        variant={activeTab === 'overview' ? 'default' : 'outline'}
                        className={`${
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
                        className={`${
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Advanced View</span>
                        <Switch 
                          checked={showAdvanced} 
                          onCheckedChange={setShowAdvanced}
                        />
                      </div>
                    )}
                  </div>
                  
                  {activeTab === 'overview' ? (
                    <ScrollArea className="h-48 bg-charcoalSecondary/40 rounded-lg p-5 border border-gray-700/50 mb-8">
                      {showAdvanced ? (
                        <div className="space-y-4">
                          <p className="text-gray-300 leading-relaxed">{strategy.description}</p>
                          <div className="p-3 bg-charcoalSecondary/70 rounded border border-gray-700/50">
                            <h4 className="text-cyan text-sm font-medium mb-2">Technical Indicators</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                              <li>Moving Average Crossover (EMA 9/21)</li>
                              <li>Relative Strength Index (RSI)</li>
                              <li>Volume Profile Analysis</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-charcoalSecondary/70 rounded border border-gray-700/50">
                            <h4 className="text-cyan text-sm font-medium mb-2">Entry Conditions</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
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
                  ) : (
                    <div className="mb-8">
                      <div className="space-y-6">
                        {strategyLegs && strategyLegs.length > 0 ? (
                          strategyLegs.map((leg, index) => (
                            <div key={index} className="bg-gradient-to-br from-charcoalSecondary/40 to-charcoalSecondary/20 rounded-lg p-4 border border-gray-700/30">
                              <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
                                <Layers className="h-5 w-5 text-cyan mr-2" />
                                Leg #{leg.id || index + 1}
                              </h3>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Lots</span>
                                  <p className="text-white font-medium">{leg.lots}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Position</span>
                                  <p className="text-white font-medium">{leg.position}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Option Type</span>
                                  <p className="text-white font-medium">{leg.optionType}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Expiry</span>
                                  <p className="text-white font-medium">{leg.expiry}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Strike Criteria</span>
                                  <p className="text-white font-medium">{leg.strikeCriteria}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Premium</span>
                                  <p className="text-white font-medium">{leg.premium}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Stop Loss</span>
                                  <p className="text-white font-medium">{formatLegProperty(leg.stopLoss)}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Trail SL</span>
                                  <p className="text-white font-medium">{formatLegProperty(leg.trailSL)}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Target Profit</span>
                                  <p className="text-white font-medium">{formatLegProperty(leg.targetProfit)}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Re-entry on Target</span>
                                  <p className="text-white font-medium">{formatLegProperty(leg.reEntryOnTarget)}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Re-entry on Stop Loss</span>
                                  <p className="text-white font-medium">{formatLegProperty(leg.reEntryOnStopLoss)}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Simple Momentum</span>
                                  <p className="text-white font-medium">{formatLegProperty(leg.simpleMomentum)}</p>
                                </div>
                                <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                  <span className="text-gray-400 text-xs block mb-1">Range Breakout</span>
                                  <p className="text-white font-medium">{formatLegProperty(leg.rangeBreakout)}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-400 p-6">
                            <p>No leg details available for this strategy.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Strategy parameters from strategy_details */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6 mb-8">
                      {strategyDetailsParams.instrumentSettings?.length > 0 && (
                        <div className="bg-gradient-to-br from-charcoalSecondary/40 to-charcoalSecondary/20 rounded-lg p-4 border border-gray-700/30">
                          <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
                            <Settings className="h-5 w-5 text-cyan mr-2" />
                            Instrument Settings
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {strategyDetailsParams.instrumentSettings.map((param, index) => (
                              <div key={index} className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                <span className="text-gray-400 text-xs block mb-1">{param.name}</span>
                                <p className="text-white font-medium">{param.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {strategyDetailsParams.timeSettings?.length > 0 && (
                        <div className="bg-gradient-to-br from-charcoalSecondary/40 to-charcoalSecondary/20 rounded-lg p-4 border border-gray-700/30">
                          <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
                            <Clock className="h-5 w-5 text-cyan mr-2" />
                            Time Settings
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {strategyDetailsParams.timeSettings.map((param, index) => (
                              <div key={index} className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                <span className="text-gray-400 text-xs block mb-1">{param.name}</span>
                                <p className="text-white font-medium">{param.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {strategyDetailsParams.executionSettings?.length > 0 && (
                        <div className="bg-gradient-to-br from-charcoalSecondary/40 to-charcoalSecondary/20 rounded-lg p-4 border border-gray-700/30">
                          <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
                            <Zap className="h-5 w-5 text-cyan mr-2" />
                            Execution Settings
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {strategyDetailsParams.executionSettings.map((param, index) => (
                              <div key={index} className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                <span className="text-gray-400 text-xs block mb-1">{param.name}</span>
                                <p className="text-white font-medium">{param.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {strategyDetailsParams.other?.length > 0 && (
                        <div className="bg-gradient-to-br from-charcoalSecondary/40 to-charcoalSecondary/20 rounded-lg p-4 border border-gray-700/30">
                          <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
                            <Filter className="h-5 w-5 text-cyan mr-2" />
                            Other Settings
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {strategyDetailsParams.other.map((param, index) => (
                              <div key={index} className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
                                <span className="text-gray-400 text-xs block mb-1">{param.name}</span>
                                <p className="text-white font-medium">{param.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 bg-gradient-to-r from-cyan/10 to-cyan/5 rounded-lg border border-cyan/20 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-5 w-5 text-cyan" />
                      <h3 className="text-lg font-semibold text-white">Performance Highlights</h3>
                    </div>
                    <ul className="space-y-2 pl-9">
                      <li className="text-gray-300 list-disc">Consistent returns in ranging markets</li>
                      <li className="text-gray-300 list-disc">Optimal for medium-term horizons (1-3 days)</li>
                      <li className="text-gray-300 list-disc">Manages downside risk with adaptive stop-loss</li>
                    </ul>
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-charcoalPrimary rounded-full border border-gray-700 mr-3">
                        <AlertCircle className="h-5 w-5 text-cyan" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Risk Level</p>
                        <p className="font-medium text-white">Moderate</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-charcoalPrimary px-6 py-6 rounded-lg shadow-lg hover:shadow-cyan/20 transition-all duration-300 font-medium text-base"
                      onClick={handleDeployStrategy}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Deploy Strategy
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-charcoalSecondary/40 rounded-xl border border-gray-700/50">
                <Lock className="h-16 w-16 mx-auto mb-4 text-cyan/70 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2 text-white">Premium Strategy</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  <span className="font-medium text-cyan">{strategy.name}</span> is a premium strategy. Upgrade to unlock it and all premium strategies.
                </p>
                <Button 
                  className="bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-charcoalPrimary px-8 py-6 rounded-full shadow-lg hover:shadow-cyan/20 font-medium text-base transition-all duration-300"
                  onClick={() => {
                    sessionStorage.setItem('selectedStrategyId', strategyId.toString());
                    navigate('/pricing');
                  }}
                >
                  Unlock {strategy.name}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Trading Dialogs */}
        <TradingModeConfirmationDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
          targetMode="live trade"
          strategyName={strategy?.name || ""}
          onConfirm={confirmModeChange}
        />

        <QuantityInputDialog
          open={showQuantityDialog}
          onOpenChange={setShowQuantityDialog}
          onSubmit={handleQuantitySubmit}
          onCancel={handleCancelQuantity}
        />

        <BrokerSelectionDialog
          open={showBrokerDialog}
          onOpenChange={setShowBrokerDialog}
          onSubmit={handleBrokerSubmit}
          onCancel={handleCancelBroker}
          currentBrokerName={currentBrokerName}
        />
      </main>
    </div>
  );
};

export default StrategyDetails;
