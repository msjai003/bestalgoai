import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type StrategyDataRow = {
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

type StrategyTableName = 'zenflow_strategy' | 'velox_edge_strategy' | 'novaglide_strategy' | 'evercrest_strategy' | 'apexflow_strategy';
type MetricsTableName = 'zenflow_metrics' | 'velox_edge_metrics' | 'novaglide_metrics' | 'evercrest_metrics' | 'apexflow_metrics';

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
      case 'apexflow':
        return 'apexflow_strategy';
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
      case 'evercrest':
        return 'evercrest_metrics';
      case 'apexflow':
        return 'apexflow_metrics';
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
      
      const tableName = getTableNameForStrategy(strategy);
      
      console.log(`Fetching strategy data from ${tableName} table for ${strategy} strategy...`);
      
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
          jan: -3078, feb: 23583, mar: 135146, apr: 16350, may: 24063, jun: 31841, 
          jul: -899, aug: 6841, sep: -1866, oct: -8365, nov: -12517, dec: 237483, 
          total: 447682, max_drawdown: -40623 
        },
        { 
          id: '2', 
          year: 2021, 
          jan: 14028, feb: -16976, mar: -5613, apr: -1166, may: 592, jun: 1417, 
          jul: 16695, aug: -8640, sep: 15963, oct: 32857, nov: 36551, dec: 7923, 
          total: 93633, max_drawdown: -68261 
        },
        { 
          id: '3', 
          year: 2022, 
          jan: 29726, feb: 49357, mar: -10856, apr: -11227, may: 33420, jun: 44988, 
          jul: -8632, aug: 5448, sep: -24022, oct: -19710, nov: -468, dec: 25980, 
          total: 114003, max_drawdown: -84678 
        },
        { 
          id: '4', 
          year: 2023, 
          jan: -19425, feb: 4173, mar: 746, apr: -4976, may: -15195, jun: 6645, 
          jul: -9618, aug: 22091, sep: 12536, oct: 28833, nov: -31008, dec: 19470, 
          total: 14272, max_drawdown: -68943 
        },
        { 
          id: '5', 
          year: 2024, 
          jan: 28938, feb: 9840, mar: 16331, apr: 8445, may: -2486, jun: 17883, 
          jul: -9727, aug: 23647, sep: -35388, oct: 43893, nov: 37845, dec: 35407, 
          total: 174630, max_drawdown: -50730 
        },
        {
          id: '6',
          year: 2025,
          jan: -20917, feb: 1203, mar: 2520, apr: 0, may: 0, jun: 0,
          jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
          total: -17193, max_drawdown: -32808
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
        overall_profit: 827028,
        overall_profit_percentage: 827.03,
        number_of_trades: 364,
        win_percentage: 59.3,
        loss_percentage: 40.7,
        max_drawdown: -84678,
        max_drawdown_percentage: -84.68,
        avg_profit_per_trade: 2272.05,
        avg_profit_per_trade_percentage: 2.27,
        max_profit_in_single_trade: 237483,
        max_profit_in_single_trade_percentage: 237.48,
        max_loss_in_single_trade: -35388,
        max_loss_in_single_trade_percentage: -35.39,
        avg_profit_on_winning_trades: 24630,
        avg_profit_on_winning_trades_percentage: 24.63,
        avg_loss_on_losing_trades: -11810,
        avg_loss_on_losing_trades_percentage: -11.81,
        reward_to_risk_ratio: 2.09,
        max_win_streak: 8,
        max_losing_streak: 6,
        return_max_dd: 9.77,
        drawdown_duration: "84 days",
        max_trades_in_drawdown: 16,
        expectancy_ratio: 2.64
      };
    default:
      return {} as MetricsData;
  }
};
