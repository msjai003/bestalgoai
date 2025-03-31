
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lock, Play, ChevronLeft, Award, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";
import { addToWishlist, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";

const StrategyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: strategies } = usePredefinedStrategies();
  const strategyId = parseInt(id || "0", 10);
  const strategy = strategies?.find((s) => s.id === strategyId);
  const isPremium = strategyId > 1; // First strategy is free, others are premium

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaidStrategy, setIsPaidStrategy] = useState(false);

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
        
        if (data && data.length > 0 && data[0].paid_status === 'paid') {
          setIsPaidStrategy(true);
        }
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
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data && (data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
          setHasPremium(true);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    
    checkWishlistStatus();
    checkPremiumStatus();
  }, [user, strategy]);

  // Check if user can access this premium strategy
  useEffect(() => {
    if (isPremium && !hasPremium && !isPaidStrategy && user) {
      toast({
        title: "Premium Strategy",
        description: "Please upgrade to access this premium strategy",
      });
    }
  }, [isPremium, hasPremium, isPaidStrategy, user, toast]);

  const handleToggleWishlist = async () => {
    if (!user || !strategy) {
      toast({
        title: "Authentication required",
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
          title: "Added to wishlist",
          description: "Strategy has been added to your wishlist",
        });
      } else {
        // Remove from wishlist
        await removeFromWishlist(user.id, strategy.id);
        
        setIsWishlisted(false);
        toast({
          title: "Removed from wishlist",
          description: "Strategy has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      toast({
        title: "Error",
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

  const canAccess = !isPremium || hasPremium || isPaidStrategy;

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
                    className="text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10"
                    onClick={handleUpgrade}
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
              <>
                <p className="text-gray-400 mb-8 leading-relaxed md:text-lg">{strategy.description}</p>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center">
                    <BarChart3 className="h-5 w-5 text-cyan mr-2" />
                    Key Metrics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">
                        Win Rate
                      </p>
                      <p className="text-cyan font-semibold text-xl">
                        {strategy.performance.winRate}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">
                        Average Return
                      </p>
                      <p className="text-cyan font-semibold text-xl">
                        {strategy.performance.avgProfit}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">
                        Max Drawdown
                      </p>
                      <p className="text-cyan font-semibold text-xl">
                        {strategy.performance.drawdown}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/70 border border-gray-700/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan/30 transition-all duration-300">
                      <p className="text-gray-400 mb-1 text-sm">
                        Risk Score
                      </p>
                      <p className="text-cyan font-semibold text-xl">
                        {strategy.parameters.find(p => p.name === "Risk Score")?.value || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white/90 flex items-center">
                    <TrendingUp className="h-5 w-5 text-cyan mr-2" />
                    Strategy Logic
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Advanced View</span>
                    <Switch 
                      checked={showAdvanced} 
                      onCheckedChange={setShowAdvanced}
                    />
                  </div>
                </div>

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
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Deploy Strategy
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-charcoalSecondary/40 rounded-xl border border-gray-700/50">
                <Lock className="h-16 w-16 mx-auto mb-4 text-yellow-500/70 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2 text-white">Premium Strategy</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  <span className="font-medium text-cyan">{strategy.name}</span> is a premium strategy. Upgrade to unlock it and all premium strategies.
                </p>
                <Button 
                  className="bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-charcoalPrimary px-8 py-6 rounded-lg shadow-lg font-medium text-base"
                  onClick={handleUpgrade}
                >
                  Unlock {strategy.name}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StrategyDetails;
