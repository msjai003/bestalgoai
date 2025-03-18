
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PredefinedStrategy {
  id: number;
  name: string;
  description: string;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  parameters: Array<{
    name: string;
    value: string;
  }>;
}

const fetchPredefinedStrategies = async (): Promise<PredefinedStrategy[]> => {
  const { data, error } = await supabase
    .from('predefined_strategies')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching predefined strategies:', error);
    throw error;
  }

  return (data || []).map(strategy => ({
    ...strategy,
    performance: strategy.performance as PredefinedStrategy['performance'],
    parameters: strategy.parameters as PredefinedStrategy['parameters']
  }));
};

export const usePredefinedStrategies = () => {
  return useQuery({
    queryKey: ['predefined-strategies'],
    queryFn: fetchPredefinedStrategies
  });
};
