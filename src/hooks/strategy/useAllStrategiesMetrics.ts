
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AllStrategyMetrics {
  strategy_name: string;
  overall_profit: number | null;
  overall_profit_percentage: number | null;
  win_percentage: number | null;
  loss_percentage: number | null;
  number_of_trades: number | null;
  max_drawdown: number | null;
  max_drawdown_percentage: number | null;
  reward_to_risk_ratio: number | null;
  return_max_dd: number | null;
  avg_profit_per_trade: number | null;
  drawdown_duration: string | null;
  created_at: string;
  updated_at: string;
}

export const useAllStrategiesMetrics = () => {
  const [strategies, setStrategies] = useState<AllStrategyMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAllStrategiesMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('all_strategy_metrics')
        .select('*');
        
      if (fetchError) {
        console.error('Error fetching all strategies metrics:', fetchError);
        setError(fetchError.message);
        toast.error('Failed to load strategy metrics');
        return;
      }
      
      if (data) {
        console.log('All strategies metrics:', data);
        setStrategies(data);
      }
    } catch (err: any) {
      console.error('Unexpected error when fetching all strategies metrics:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to load strategy metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStrategiesMetrics();
  }, []);

  return {
    strategies,
    loading,
    error,
    refreshData: fetchAllStrategiesMetrics
  };
};
