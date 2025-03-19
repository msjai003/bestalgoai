
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Strategy } from "@/hooks/strategy/types";
import { NoStrategiesFound } from "./NoStrategiesFound";
import { StrategyCard } from "./StrategyCard";
import { supabase } from "@/integrations/supabase/client";

interface PredefinedStrategyListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  onShowPaymentDialog?: (strategy: Strategy) => void;
  user: any | null;
}

export const PredefinedStrategyList: React.FC<PredefinedStrategyListProps> = ({
  strategies,
  isLoading,
  onToggleWishlist,
  onToggleLiveMode,
  onShowPaymentDialog,
  user
}) => {
  // Debug logging to understand strategies
  useEffect(() => {
    console.log("PredefinedStrategyList strategies:", strategies.map(s => ({
      id: s.id,
      name: s.name,
      paidStatus: s.paidStatus,
      isLive: s.isLive
    })));
  }, [strategies]);

  // Check if the user has a paid plan when the component loads
  useEffect(() => {
    const checkUserPaidStrategies = async () => {
      if (!user) return;
      
      try {
        console.log("Checking user paid strategies");
        
        // Check if the user has any paid strategies
        const { data: paidStrategies, error: strategiesError } = await supabase
          .from('strategy_selections')
          .select('strategy_id, paid_status')
          .eq('user_id', user.id)
          .eq('paid_status', 'paid');
          
        if (strategiesError) {
          console.error("Error fetching paid strategies:", strategiesError);
          return;
        }
        
        console.log("User paid strategies:", paidStrategies);
      } catch (error) {
        console.error("Error in checkUserPaidStrategies:", error);
      }
    };
    
    checkUserPaidStrategies();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0">
              <div className="p-4">
                <Skeleton className="h-6 w-1/2 bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-gray-700/50 mb-3" />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Skeleton className="h-12 w-full bg-gray-700/30" />
                  <Skeleton className="h-12 w-full bg-gray-700/30" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                  </div>
                  <Skeleton className="h-8 w-24 bg-gray-700/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!strategies.length) {
    return <NoStrategiesFound onAddStrategies={() => window.location.href = "/strategy-selection"} />;
  }

  return (
    <div className="space-y-4">
      {strategies.map((strategy, index) => {
        // Process strategy status
        if (index === 0) {
          // First strategy is always free
          strategy.paidStatus = "free";
        } else if (strategy.paidStatus !== "paid") {
          // All other strategies are premium unless already paid
          strategy.paidStatus = "premium";
        }
        
        console.log(`Strategy ${strategy.id} ${strategy.name}: paidStatus=${strategy.paidStatus}`);
        
        return (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onToggleWishlist={() => onToggleWishlist(strategy.id, !strategy.isWishlisted)}
            onToggleLiveMode={() => onToggleLiveMode(strategy.id)}
            onShowPaymentDialog={
              strategy.paidStatus === "premium" && onShowPaymentDialog 
                ? () => onShowPaymentDialog(strategy)
                : undefined
            }
            isAuthenticated={!!user}
            index={index}
          />
        );
      })}
    </div>
  );
}
