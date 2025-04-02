
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type StrategyDataRow = {
  id: string;
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
};

export type MetricsData = {
  id: string | number;
  overall_profit: number;
  overall_profit_percentage: number;
  number_of_trades: number;
  win_percentage: number;
  loss_percentage: number;
  max_drawdown: number;
  max_drawdown_percentage: number;
  avg_profit_per_trade: number;
  avg_profit_per_trade_percentage: number;
  max_profit_in_single_trade: number;
  max_profit_in_single_trade_percentage: number;
  max_loss_in_single_trade: number;
  max_loss_in_single_trade_percentage: number;
  avg_profit_on_winning_trades: number;
  avg_profit_on_winning_trades_percentage: number;
  avg_loss_on_losing_trades: number;
  avg_loss_on_losing_trades_percentage: number;
  reward_to_risk_ratio: number;
  max_win_streak: number;
  max_losing_streak: number;
  return_max_dd: number;
  drawdown_duration: string;
  max_trades_in_drawdown: number;
  expectancy_ratio: number;
  created_at?: string;
  updated_at?: string;
};

export type StrategyType = 'zenflow' | 'velox' | 'nova' | 'evercrest' | 'apexflow';

// Define explicit table name types to satisfy TypeScript
type StrategyTableName = 'zenflow_strategy' | 'velox_edge_strategy' | 'novaglide_strategy' | 'evercrest_strategy';
type MetricsTableName = 'zenflow_metrics' | 'velox_edge_metrics' | 'novaglide_metrics';

export const getStrategyDisplayName = (strategy: string): string => {
  switch (strategy) {
    case 'velox':
      return 'Velox Edge Strategy';
    case 'nova':
      return 'Nova Glide Strategy';
    case 'evercrest':
      return 'Evercrest Strategy';
    case 'apexflow':
      return 'Apexflow Strategy';
    case 'zenflow':
    default:
      return 'Zenflow Strategy';
  }
};

export const useZenflowBacktestResults = (strategy: StrategyType = 'zenflow') => {
  const [strategyData, setStrategyData] = useState<StrategyDataRow[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>({} as MetricsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [strategyType, setStrategyType] = useState<StrategyType>(strategy);
  
  const getTableNameForStrategy = (strategy: StrategyType): StrategyTableName => {
    switch (strategy) {
      case 'velox':
        return 'velox_edge_strategy';
      case 'nova':
        return 'novaglide_strategy';
      case 'evercrest':
        return 'evercrest_strategy';
      case 'zenflow':
      default:
        return 'zenflow_strategy';
    }
  };
  
  const getMetricsTableNameForStrategy = (strategy: StrategyType): MetricsTableName => {
    switch (strategy) {
      case 'velox':
        return 'velox_edge_metrics';
      case 'nova':
        return 'novaglide_metrics';
      case 'zenflow':
      default:
        return 'zenflow_metrics';
    }
  };
  
  const fetchZenflowBacktestResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      setStrategyType(strategy);
      
      // For the Apexflow strategy, we use mock data
      if (strategy === 'apexflow') {
        // Use mock data for this strategy
        setStrategyData(getMockDataForStrategy(strategy));
        setMetrics(getMockMetricsForStrategy(strategy));
        setLoading(false);
        return;
      }
      
      // For Evercrest, we've stored the data in the database, so we fetch it
      // For Zenflow, Velox, Nova, and Evercrest, proceed with database fetching
      const tableName = getTableNameForStrategy(strategy);
      
      console.log(`Fetching strategy data from ${tableName} table for ${strategy} strategy...`);
      
      // Force TypeScript to accept our table name
      const { data, error: fetchError } = await supabase
        .from(tableName as any)
        .select('*')
        .order('year', { ascending: true });
        
      if (fetchError) {
        console.error(`Error fetching ${strategy} data:`, fetchError);
        setError(fetchError.message);
        toast.error(`Error loading ${getStrategyDisplayName(strategy)} data`);
      } else {
        console.log(`Successfully fetched ${data?.length} rows of ${strategy} data from ${tableName}`);
        setStrategyData(data as unknown as StrategyDataRow[]);
      }
      
      // For Evercrest strategy, use mock metrics since we don't have a dedicated metrics table yet
      if (strategy === 'evercrest') {
        setMetrics(getMockMetricsForStrategy(strategy));
      } else {
        // Now fetch metrics for other strategies from their respective tables
        const metricsTable = getMetricsTableNameForStrategy(strategy);
        
        try {
          console.log(`Fetching metrics from ${metricsTable} table for ${strategy} strategy...`);
          
          const { data: metricsData, error: metricsError } = await supabase
            .from(metricsTable as any)
            .select('*')
            .limit(1);
            
          if (metricsError) {
            throw metricsError;
          }
          
          if (metricsData && metricsData.length > 0) {
            console.log(`Successfully fetched metrics for ${strategy}`);
            setMetrics(metricsData[0] as unknown as MetricsData);
          } else {
            console.log(`No ${strategy} metrics found in DB, using mock data`);
            setMetrics(getMockMetricsForStrategy(strategy));
          }
        } catch (metricsError: any) {
          console.error(`Error fetching ${strategy} metrics data:`, metricsError);
          console.log(`Error fetching ${strategy} metrics, using mock data`);
          setMetrics(getMockMetricsForStrategy(strategy));
        }
      }
    } catch (err: any) {
      console.error(`Unexpected error fetching ${strategy} data:`, err);
      setError(err.message || "An unexpected error occurred");
      toast.error(`Error loading ${getStrategyDisplayName(strategy)} data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZenflowBacktestResults();
    console.log("Component mounted, fetching data for strategy:", strategy);
  }, [strategy]);

  return { 
    strategyData, 
    metrics, 
    loading, 
    error,
    fetchZenflowBacktestResults,
    strategyType
  };
};

const getMockDataForStrategy = (strategy: StrategyType): StrategyDataRow[] => {
  switch (strategy) {
    case 'evercrest':
      return [
        { 
          id: '1', 
          year: 2020, 
          jan: -3360, feb: 12438, mar: -44381, apr: 48423, may: 36948, jun: 30956, 
          jul: 21467, aug: 14037, sep: 16367, oct: 37581, nov: 17568, dec: 187068, 
          total: 375112, max_drawdown: -70140
        },
        { 
          id: '2', 
          year: 2021, 
          jan: -1923, feb: 75802, mar: -21258, apr: 29175, may: 8883, jun: 28027, 
          jul: 16998, aug: 42135, sep: 38227, oct: 38868, nov: 6453, dec: -2636, 
          total: 258753, max_drawdown: -30401 
        },
        { 
          id: '3', 
          year: 2022, 
          jan: -18596, feb: 16271, mar: 63847, apr: -37428, may: -1766, jun: -18532, 
          jul: 14370, aug: 21506, sep: -21911, oct: 5756, nov: 26452, dec: 15723, 
          total: 65692, max_drawdown: -96693 
        },
        { 
          id: '4', 
          year: 2023, 
          jan: -6251, feb: -2523, mar: 9933, apr: -5156, may: 20403, jun: 17703, 
          jul: 10972, aug: 1083, sep: 31316, oct: -5838, nov: -1335, dec: 46185, 
          total: 116493, max_drawdown: -24483 
        },
        { 
          id: '5', 
          year: 2024, 
          jan: 4057, feb: 16331, mar: -8070, apr: 21693, may: -3093, jun: 40608, 
          jul: 23797, aug: 15390, sep: 2343, oct: -47400, nov: 53692, dec: 32362, 
          total: 151713, max_drawdown: -71411 
        },
        {
          id: '6',
          year: 2025,
          jan: -40695, feb: -16398, mar: -4406, apr: 0, may: 0, jun: 0,
          jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
          total: -51500, max_drawdown: -65422
        }
      ];
    case 'apexflow':
      return [
        { 
          id: '1', 
          year: 2020, 
          jan: 14500, feb: 4800, mar: 2900, apr: 19500, may: -1950, jun: 5800, 
          jul: 17500, aug: 2900, sep: 7300, oct: 3900, nov: 1950, dec: 5800, 
          total: 85000, max_drawdown: -9800 
        },
        { 
          id: '2', 
          year: 2021, 
          jan: 21500, feb: 7800, mar: 9750, apr: 27000, may: 19500, jun: -3900, 
          jul: 7800, aug: -1450, sep: 975, oct: 14500, nov: 13500, dec: 24000, 
          total: 140000, max_drawdown: -13500 
        },
        { 
          id: '3', 
          year: 2022, 
          jan: 975, feb: 24000, mar: 13500, apr: -490, may: 29000, jun: 11700, 
          jul: 4900, aug: 24000, sep: 11700, oct: 5800, nov: 5800, dec: 4350, 
          total: 135000, max_drawdown: -9800 
        },
        { 
          id: '4', 
          year: 2023, 
          jan: 19500, feb: -1950, mar: 19500, apr: -3400, may: 3400, jun: 6800, 
          jul: -1150, aug: -3900, sep: 3400, oct: 4900, nov: 1950, dec: -680, 
          total: 48000, max_drawdown: -11700 
        },
        { 
          id: '5', 
          year: 2024, 
          jan: 27000, feb: 9750, mar: 17500, apr: -975, may: 6800, jun: 3900, 
          jul: 3900, aug: -9750, sep: -2900, oct: 14500, nov: -1450, dec: -975, 
          total: 67000, max_drawdown: -19500 
        }
      ];
    default:
      return [];
  }
};

const getMockMetricsForStrategy = (strategy: StrategyType): MetricsData => {
  switch (strategy) {
    case 'evercrest':
      return {
        id: '1',
        overall_profit: 916763,
        overall_profit_percentage: 916.76,
        number_of_trades: 312,
        win_percentage: 63.78,
        loss_percentage: 36.22,
        max_drawdown: -96693,
        max_drawdown_percentage: -96.69,
        avg_profit_per_trade: 2939.63,
        avg_profit_per_trade_percentage: 2.94,
        max_profit_in_single_trade: 187068,
        max_profit_in_single_trade_percentage: 187.07,
        max_loss_in_single_trade: -47400,
        max_loss_in_single_trade_percentage: -47.40,
        avg_profit_on_winning_trades: 26528.73,
        avg_profit_on_winning_trades_percentage: 26.53,
        avg_loss_on_losing_trades: -15150.61,
        avg_loss_on_losing_trades_percentage: -15.15,
        reward_to_risk_ratio: 1.75,
        max_win_streak: 9,
        max_losing_streak: 5,
        return_max_dd: 9.48,
        drawdown_duration: "72 days",
        max_trades_in_drawdown: 14,
        expectancy_ratio: 3.21
      };
    case 'apexflow':
      return {
        id: '1',
        overall_profit: 475000,
        overall_profit_percentage: 475.0,
        number_of_trades: 245,
        win_percentage: 71.0,
        loss_percentage: 29.0,
        max_drawdown: -19500,
        max_drawdown_percentage: -19.5,
        avg_profit_per_trade: 1938.78,
        avg_profit_per_trade_percentage: 1.94,
        max_profit_in_single_trade: 29000,
        max_profit_in_single_trade_percentage: 29.0,
        max_loss_in_single_trade: -9750,
        max_loss_in_single_trade_percentage: -9.75,
        avg_profit_on_winning_trades: 9750,
        avg_profit_on_winning_trades_percentage: 9.75,
        avg_loss_on_losing_trades: -3900,
        avg_loss_on_losing_trades_percentage: -3.9,
        reward_to_risk_ratio: 2.5,
        max_win_streak: 7,
        max_losing_streak: 3,
        return_max_dd: 24.35,
        drawdown_duration: "17 days",
        max_trades_in_drawdown: 7,
        expectancy_ratio: 5760.9
      };
    default:
      return {} as MetricsData;
  }
};
