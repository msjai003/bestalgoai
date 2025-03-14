
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { predefinedStrategies } from "@/constants/strategy-data";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const StrategyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const strategyId = parseInt(id || "0", 10);
  const strategy = predefinedStrategies.find((s) => s.id === strategyId);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !strategy) return;
      
      try {
        const { data, error } = await supabase
          .from('strategy_selections')
          .select('id')
          .eq('user_id', user.id)
          .eq('strategy_id', strategy.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking wishlist status:', error);
          return;
        }
        
        setIsWishlisted(!!data);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    checkWishlistStatus();
  }, [user, strategy]);

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
        const { error } = await supabase.from('strategy_selections')
          .insert({
            user_id: user.id,
            strategy_id: strategy.id,
            strategy_name: strategy.name,
            strategy_description: strategy.description
          });
          
        if (error) {
          console.error('Error adding to wishlist:', error);
          toast({
            title: "Error",
            description: "Failed to add strategy to wishlist",
            variant: "destructive"
          });
          return;
        }
        
        setIsWishlisted(true);
        toast({
          title: "Added to wishlist",
          description: "Strategy has been added to your wishlist",
        });
      } else {
        const { error } = await supabase.from('strategy_selections')
          .delete()
          .eq('user_id', user.id)
          .eq('strategy_id', strategy.id);
          
        if (error) {
          console.error('Error removing from wishlist:', error);
          toast({
            title: "Error",
            description: "Failed to remove strategy from wishlist",
            variant: "destructive"
          });
          return;
        }
        
        setIsWishlisted(false);
        toast({
          title: "Removed from wishlist",
          description: "Strategy has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StrategyDetails;
