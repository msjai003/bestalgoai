
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lock, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";

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
          .eq('strategy_id', strategy.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking wishlist status:', error);
          return;
        }
        
        setIsWishlisted(!!data);
        
        if (data && data.paid_status === 'paid') {
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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add strategies to your wishlist",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!isWishlisted) {
        // Fixed: Use a basic upsert pattern instead of maybeSingle()
        const { data: existingData, error: checkError } = await supabase
          .from('strategy_selections')
          .select('id')
          .eq('user_id', user.id)
          .eq('strategy_id', strategy.id);
          
        if (checkError) throw checkError;
        
        if (existingData && existingData.length > 0) {
          // Update existing record
          const { error } = await supabase
            .from('strategy_selections')
            .update({
              strategy_name: strategy.name,
              strategy_description: strategy.description,
              paid_status: isPaidStrategy ? 'paid' : 'free'
            })
            .eq('user_id', user.id)
            .eq('strategy_id', strategy.id);
            
          if (error) throw error;
        } else {
          // Insert new record
          const { error } = await supabase
            .from('strategy_selections')
            .insert({
              user_id: user.id,
              strategy_id: strategy.id,
              strategy_name: strategy.name,
              strategy_description: strategy.description,
              paid_status: isPaidStrategy ? 'paid' : 'free'
            });
            
          if (error) throw error;
        }
        
        setIsWishlisted(true);
        toast({
          title: "Added to wishlist",
          description: "Strategy has been added to your wishlist",
        });
      } else {
        if (isPaidStrategy) {
          // For paid strategies, just update any fields that would affect wishlist status
          const { error } = await supabase
            .from('strategy_selections')
            .update({})
            .eq('user_id', user.id)
            .eq('strategy_id', strategy.id);
            
          if (error) throw error;
        } else {
          // For non-paid strategies, we can delete the record
          const { error } = await supabase
            .from('strategy_selections')
            .delete()
            .eq('user_id', user.id)
            .eq('strategy_id', strategy.id);
            
          if (error) throw error;
        }
        
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
        description: "Failed to update wishlist status",
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
        <div className="flex items-center mb-4">
          <Link to="/strategy-selection" className="text-gray-400 hover:text-gray-300 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Strategies
          </Link>
        </div>

        <Card className="bg-gray-800 border border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold mb-4">{strategy.name}</h1>
              <div className="flex space-x-2">
                {isPremium && !canAccess && (
                  <Button 
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10"
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
                <p className="text-gray-400 mb-6">{strategy.description}</p>

                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Key Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">
                        <span className="font-medium text-white">Win Rate:</span> {strategy.performance.winRate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        <span className="font-medium text-white">Risk Score:</span> {strategy.parameters.find(p => p.name === "Risk Score")?.value || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        <span className="font-medium text-white">Average Return:</span> {strategy.performance.avgProfit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        <span className="font-medium text-white">Max Drawdown:</span> {strategy.performance.drawdown}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Strategy Logic</h2>
                  <ScrollArea className="h-40 bg-gray-700/20 rounded-md p-4">
                    <p className="text-sm text-gray-300">{strategy.description}</p>
                  </ScrollArea>
                </div>

                <div className="flex justify-end items-center">
                  <Button>Deploy Strategy</Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Lock className="h-16 w-16 mx-auto mb-4 text-yellow-500/70" />
                <h3 className="text-xl font-semibold mb-2">Premium Strategy</h3>
                <p className="text-gray-400 mb-6">
                  <span className="font-medium text-[#FF00D4]">{strategy.name}</span> is a premium strategy. Upgrade to unlock it and all premium strategies.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#FF00D4] to-purple-600"
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
