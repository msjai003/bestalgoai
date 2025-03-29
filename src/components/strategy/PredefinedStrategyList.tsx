
import React, { useEffect, useState } from "react";
import { Strategy } from "@/hooks/strategy/types";
import { StrategyCard } from "@/components/strategy/StrategyCard";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PredefinedStrategyListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  user: any;
}

export const PredefinedStrategyList: React.FC<PredefinedStrategyListProps> = ({
  strategies,
  isLoading,
  onToggleWishlist,
  onToggleLiveMode,
  user
}) => {
  const [hasPremium, setHasPremium] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const checkPremium = async () => {
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
    
    checkPremium();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader className="animate-spin text-cyan h-8 w-8" />
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="text-center p-8 border border-gray-700 rounded-lg bg-charcoalSecondary">
        <p className="text-gray-400">No strategies available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 pb-4">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onToggleWishlist={onToggleWishlist}
          onToggleLiveMode={onToggleLiveMode}
          isAuthenticated={!!user}
          hasPremium={hasPremium}
        />
      ))}
    </div>
  );
};
