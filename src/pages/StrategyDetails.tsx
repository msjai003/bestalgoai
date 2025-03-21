
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lock, Play, ChevronLeft } from "lucide-react";
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
            <Link to="/strategy-selection" className="flex items-center text-gray-400 hover:text-[#FF00D4] transition-colors">
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/strategy-selection" className="flex items-center text-gray-400 hover:text-[#FF00D4] transition-colors">
            <ChevronLeft className="mr-1 h-5 w-5" />
            Back to Strategies
          </Link>
        </div>

        <Card className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-white bg-clip-text bg-gradient-to-r from-[#FF00D4] to-purple-500">{strategy?.name}</h1>
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
                <p className="text-gray-400 mb-6 leading-relaxed">{strategy.description}</p>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-white/90">Key Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                      <p className="text-gray-400 mb-1 text-sm">
                        Win Rate
                      </p>
                      <p className="text-blue-300 font-semibold text-lg">
                        {strategy.performance.winRate}
                      </p>
                    </div>
                    <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                      <p className="text-gray-400 mb-1 text-sm">
                        Average Return
                      </p>
                      <p className="text-green-300 font-semibold text-lg">
                        {strategy.performance.avgProfit}
                      </p>
                    </div>
                    <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                      <p className="text-gray-400 mb-1 text-sm">
                        Max Drawdown
                      </p>
                      <p className="text-red-300 font-semibold text-lg">
                        {strategy.performance.drawdown}
                      </p>
                    </div>
                    <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4">
                      <p className="text-gray-400 mb-1 text-sm">
                        Risk Score
                      </p>
                      <p className="text-purple-300 font-semibold text-lg">
                        {strategy.parameters.find(p => p.name === "Risk Score")?.value || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-white/90">Strategy Logic</h2>
                  <ScrollArea className="h-48 bg-gray-700/20 rounded-lg p-5 border border-gray-700">
                    <p className="text-sm text-gray-300 leading-relaxed">{strategy.description}</p>
                  </ScrollArea>
                </div>

                <div className="flex justify-end items-center">
                  <Button className="bg-gradient-to-r from-[#FF00D4] to-purple-600 hover:from-[#FF00D4]/90 hover:to-purple-600/90 text-white px-6 py-2 rounded-lg shadow-lg">
                    Deploy Strategy
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-10 bg-gray-700/10 rounded-xl border border-gray-700">
                <Lock className="h-16 w-16 mx-auto mb-4 text-yellow-500/70" />
                <h3 className="text-xl font-semibold mb-2">Premium Strategy</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  <span className="font-medium text-[#FF00D4]">{strategy.name}</span> is a premium strategy. Upgrade to unlock it and all premium strategies.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#FF00D4] to-purple-600 hover:from-[#FF00D4]/90 hover:to-purple-600/90 text-white px-8 py-2 rounded-lg shadow-lg"
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
