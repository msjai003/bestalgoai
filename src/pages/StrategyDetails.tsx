
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lock, Play, ChartBar, TrendingUp, ArrowDownRight, Layers } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Link to="/strategy-selection" className="text-gray-400 hover:text-gray-300 transition-colors">
              <ArrowLeft className="mr-2 h-5 w-5" />
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/strategy-selection" className="text-gray-400 hover:text-gray-300 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Strategies
          </Link>
        </div>

        <Card className="bg-gray-800 border border-gray-700 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">{strategy?.name}</h1>
                <p className="text-gray-400 max-w-2xl">{strategy.description}</p>
              </div>
              <div className="flex space-x-2">
                {isPremium && !canAccess && (
                  <Button 
                    variant="default"
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-medium"
                    onClick={handleUpgrade}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock Premium
                  </Button>
                )}
                <Button 
                  size="icon"
                  variant="ghost"
                  className="text-pink-500 hover:text-pink-400 hover:bg-pink-500/10"
                  onClick={handleToggleWishlist}
                  disabled={isLoading}
                >
                  <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
                </Button>
              </div>
            </div>
            
            {canAccess ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-700/30 border border-gray-700 rounded-xl p-5">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                      <ChartBar className="mr-2 h-5 w-5 text-[#FF00D4]" />
                      Key Metrics
                    </h2>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="border-l-2 border-blue-500 pl-3">
                        <p className="text-sm text-gray-400">Win Rate</p>
                        <p className="text-lg font-medium text-blue-400">{strategy.performance.winRate}</p>
                      </div>
                      <div className="border-l-2 border-purple-500 pl-3">
                        <p className="text-sm text-gray-400">Risk Score</p>
                        <p className="text-lg font-medium text-purple-400">{strategy.parameters.find(p => p.name === "Risk Score")?.value || "N/A"}</p>
                      </div>
                      <div className="border-l-2 border-green-500 pl-3">
                        <p className="text-sm text-gray-400">Average Return</p>
                        <p className="text-lg font-medium text-green-400">{strategy.performance.avgProfit}</p>
                      </div>
                      <div className="border-l-2 border-red-500 pl-3">
                        <p className="text-sm text-gray-400">Max Drawdown</p>
                        <p className="text-lg font-medium text-red-400">{strategy.performance.drawdown}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/30 border border-gray-700 rounded-xl p-5">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                      <TrendingUp className="mr-2 h-5 w-5 text-[#FF00D4]" />
                      Performance Characteristics
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Volatility</span>
                        <div className="w-2/3 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-[#FF00D4]" style={{width: '65%'}}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Risk</span>
                        <div className="w-2/3 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-[#FF00D4]" style={{width: '40%'}}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Consistency</span>
                        <div className="w-2/3 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-[#FF00D4]" style={{width: '80%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                    <Layers className="mr-2 h-5 w-5 text-[#FF00D4]" />
                    Strategy Logic
                  </h2>
                  <ScrollArea className="h-48 bg-gray-700/20 rounded-xl p-5 border border-gray-700">
                    <div className="space-y-4">
                      <p className="text-gray-300">{strategy.description}</p>
                      <p className="text-gray-300">
                        This strategy is designed to capitalize on market inefficiencies and provide consistent returns
                        with managed risk. It uses a combination of technical indicators and market sentiment analysis
                        to identify optimal entry and exit points.
                      </p>
                      <p className="text-gray-300">
                        The algorithm continuously monitors price action and adjusts positions based on changing market
                        conditions, helping to maximize profits while minimizing potential losses through strategic
                        stop-loss and take-profit mechanisms.
                      </p>
                    </div>
                  </ScrollArea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-700/30 border border-gray-700 rounded-xl p-5">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                      <ArrowDownRight className="mr-2 h-5 w-5 text-[#FF00D4]" />
                      Risk Management
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Stop Loss Strategy</p>
                        <p className="text-white">Adaptive trailing stop-loss</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Position Sizing</p>
                        <p className="text-white">Dynamic based on volatility</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Max Drawdown Limit</p>
                        <p className="text-white">8% per trade</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/30 border border-gray-700 rounded-xl p-5">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                      <Play className="mr-2 h-5 w-5 text-[#FF00D4]" />
                      Deployment Settings
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Recommended Timeframe</p>
                        <p className="text-white">4 hours to daily</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Best Market Conditions</p>
                        <p className="text-white">Medium to high volatility</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Compatible Brokers</p>
                        <p className="text-white">AliceBlue, Zerodha, Interactive Brokers</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="bg-gradient-to-r from-[#FF00D4] to-purple-600 hover:from-[#FF00D4]/90 hover:to-purple-600/90 px-6 py-5 text-base font-medium"
                  >
                    Deploy Strategy
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Lock className="h-16 w-16 mx-auto mb-6 text-yellow-500/90" />
                <h3 className="text-2xl font-semibold mb-3">Premium Strategy</h3>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  <span className="font-medium text-[#FF00D4]">{strategy.name}</span> is a premium strategy. 
                  Upgrade to unlock it and all premium strategies.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#FF00D4] to-purple-600 hover:from-[#FF00D4]/90 hover:to-purple-600/90 px-8 py-6 text-base font-medium"
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
