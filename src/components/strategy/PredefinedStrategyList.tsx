
import React from "react";
import { StrategyCard } from "./StrategyCard";
import { UserData } from "@/types/user";
import { Strategy } from "@/hooks/strategy/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PredefinedStrategyListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onToggleWishlist: (id: number, isWishlisted: boolean) => void;
  onToggleLiveMode: (id: number) => void;
  user: UserData | null;
}

export const PredefinedStrategyList: React.FC<PredefinedStrategyListProps> = ({
  strategies,
  isLoading,
  onToggleWishlist,
  onToggleLiveMode,
  user
}) => {
  const [hasPremium, setHasPremium] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    // Check if user has premium subscription
    const checkPremium = async () => {
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
    
    checkPremium();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!strategies.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No strategies available at the moment
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
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
