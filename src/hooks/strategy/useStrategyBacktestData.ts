
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export type StrategyType = 'zenflow' | 'velox' | 'nova' | 'evercrest' | 'apexflow';

interface StrategyData {
  id: number;
  year: number;
  jan?: number;
  feb?: number;
  mar?: number;
  apr?: number;
  may?: number;
  jun?: number;
  jul?: number;
  aug?: number;
  sep?: number;
  oct?: number;
  nov?: number;
  dec?: number;
  total?: number;
  max_drawdown?: number;
}

interface BacktestMetrics {
  id: string;
  overall_profit?: number;
  overall_profit_percentage?: number;
  number_of_trades?: number;
  win_percentage?: number;
  loss_percentage?: number;
  max_drawdown?: number;
  max_drawdown_percentage?: number;
  avg_profit_per_trade?: number;
  avg_profit_per_trade_percentage?: number;
  reward_to_risk_ratio?: number;
  return_max_dd?: number;
  created_at: string;
  updated_at: string;
}

const getStrategyTableName = (strategyType: StrategyType): string => {
  switch (strategyType) {
    case 'zenflow':
      return 'zenflow_strategy';
    case 'velox':
      return 'velox_edge_strategy';
    case 'nova':
      return 'novaglide_strategy';
    case 'evercrest':
      return 'evercrest_strategy';
    case 'apexflow':
      return 'apexflow_strategy';
    default:
      return 'zenflow_strategy';
  }
};

const getMetricsTableName = (strategyType: StrategyType): string => {
  switch (strategyType) {
    case 'zenflow':
      return 'zenflow_metrics';
    case 'velox':
      return 'velox_edge_metrics';
    case 'nova':
      return 'novaglide_metrics';
    case 'evercrest':
      return 'evercrest_metrics';
    case 'apexflow':
      return 'apexflow_metrics';
    default:
      return 'zenflow_metrics';
  }
};

export const useStrategyBacktestData = (strategyType: StrategyType = 'zenflow') => {
  const [strategyData, setStrategyData] = useState<StrategyData[]>([]);
  const [metrics, setMetrics] = useState<BacktestMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStrategyData = async () => {
    try {
      setLoading(true);
      
      // Fetch yearly strategy data
      const strategyTableName = getStrategyTableName(strategyType);
      const { data: yearlyData, error: yearlyError } = await supabase
        .from(strategyTableName)
        .select('*')
        .order('year', { ascending: true });
      
      if (yearlyError) {
        throw yearlyError;
      }
      
      setStrategyData(yearlyData || []);
      
      // Fetch metrics data
      const metricsTableName = getMetricsTableName(strategyType);
      const { data: metricsData, error: metricsError } = await supabase
        .from(metricsTableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (metricsError) {
        throw metricsError;
      }
      
      setMetrics(metricsData?.[0] || null);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${strategyType} data:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStrategyData();
  }, [strategyType]);
  
  return { 
    strategyData, 
    metrics, 
    loading, 
    error, 
    refetch: fetchStrategyData
  };
};
