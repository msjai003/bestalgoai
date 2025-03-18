
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CustomStrategy {
  id: string;
  name: string;
  description: string | null;
  legs: any;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  performance?: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
}

const fetchCustomStrategies = async (userId: string | undefined): Promise<CustomStrategy[]> => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('custom_strategies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom strategies:', error);
    throw error;
  }

  return (data || []).map(strategy => ({
    ...strategy,
    performance: strategy.performance ? strategy.performance as CustomStrategy['performance'] : {
      winRate: 'N/A',
      avgProfit: 'N/A',
      drawdown: 'N/A'
    }
  }));
};

export const useCustomStrategies = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['custom-strategies', user?.id],
    queryFn: () => fetchCustomStrategies(user?.id),
    enabled: !!user
  });
};
