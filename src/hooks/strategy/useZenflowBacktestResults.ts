
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

type StrategyTable = 'zenflow_strategy' | 'velox_edge_strategy';
type MetricsTable = 'zenflow_metrics' | 'velox_edge_metrics';

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
  
  const getTableNameForStrategy = (strategy: StrategyType): string => {
    switch (strategy) {
      case 'velox':
        return 'velox_edge_strategy';
      case 'nova':
        return 'novaglide_strategy';
      case 'zenflow':
      default:
        return 'zenflow_strategy';
    }
  };
  
  const getMetricsTableNameForStrategy = (strategy: StrategyType): string => {
    switch (strategy) {
      case 'velox':
        return 'velox_edge_metrics';
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
      
      // For Evercrest and Apexflow strategies, we use mock data
      if (strategy === 'evercrest' || strategy === 'apexflow') {
        // Use mock data for these strategies
        setStrategyData(getMockDataForStrategy(strategy));
        setMetrics(getMockMetricsForStrategy(strategy));
        setLoading(false);
        return;
      }
      
      // For Zenflow, Velox, and Nova, proceed with database fetching
      const tableName = getTableNameForStrategy(strategy);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('year', { ascending: true });
        
      if (error) {
        console.error("Error fetching strategy data:", error);
        setError(error.message);
        toast.error(`Error loading ${getStrategyDisplayName(strategy)} data`);
      } else {
        setStrategyData(data as unknown as StrategyDataRow[]);
      }
      
      // For Nova, we don't have a metrics table yet, use mock metrics
      if (strategy === 'nova') {
        setMetrics(getMockMetricsForStrategy(strategy));
      } else {
        const metricsTable = getMetricsTableNameForStrategy(strategy);
        
        try {
          const { data: metricsData, error: metricsError } = await supabase
            .from(metricsTable)
            .select('*')
            .limit(1);
            
          if (metricsError) {
            throw metricsError;
          }
          
          if (metricsData && metricsData.length > 0) {
            setMetrics(metricsData[0] as unknown as MetricsData);
            console.log(`${strategy} metrics loaded from DB:`, metricsData[0]);
          } else {
            console.log(`No ${strategy} metrics found in DB`);
            setMetrics(getMockMetricsForStrategy(strategy));
          }
        } catch (metricsError: any) {
          console.error(`Error fetching ${strategy} metrics data:`, metricsError);
          console.log(`Error fetching ${strategy} metrics, using mock data`);
          setMetrics(getMockMetricsForStrategy(strategy));
        }
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(err.message || "An unexpected error occurred");
      toast.error(`Error loading ${getStrategyDisplayName(strategy)} data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZenflowBacktestResults();
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
    case 'nova':
      return [
        { 
          id: '1', 
          year: 2020, 
          jan: 13000, feb: 4500, mar: 2800, apr: 18500, may: -1800, jun: 5500, 
          jul: 16500, aug: 2800, sep: 7000, oct: 3800, nov: 1800, dec: 5500, 
          total: 80000, max_drawdown: -9000 
        },
        { 
          id: '2', 
          year: 2021, 
          jan: 20000, feb: 7500, mar: 9500, apr: 26000, may: 18500, jun: -3600, 
          jul: 7500, aug: -1400, sep: 900, oct: 14000, nov: 13000, dec: 23000, 
          total: 135000, max_drawdown: -13000 
        },
        { 
          id: '3', 
          year: 2022, 
          jan: 900, feb: 23000, mar: 13000, apr: -400, may: 28000, jun: 11000, 
          jul: 4600, aug: 23000, sep: 11000, oct: 5500, nov: 5500, dec: 4200, 
          total: 130000, max_drawdown: -9500 
        },
        { 
          id: '4', 
          year: 2023, 
          jan: 18500, feb: -1900, mar: 18500, apr: -3200, may: 3200, jun: 6500, 
          jul: -1000, aug: -3700, sep: 3200, oct: 4600, nov: 1900, dec: -650, 
          total: 46000, max_drawdown: -11000 
        },
        { 
          id: '5', 
          year: 2024, 
          jan: 26000, feb: 9300, mar: 16500, apr: -900, may: 6500, jun: 3700, 
          jul: 3700, aug: -9300, sep: -2700, oct: 14000, nov: -1400, dec: -900, 
          total: 64000, max_drawdown: -18500 
        }
      ];
    case 'evercrest':
      return [
        { 
          id: '1', 
          year: 2020, 
          jan: 16500, feb: 5500, mar: 3300, apr: 21000, may: -2200, jun: 6600, 
          jul: 19000, aug: 3300, sep: 8250, oct: 4400, nov: 2200, dec: 6600, 
          total: 95000, max_drawdown: -11000 
        },
        { 
          id: '2', 
          year: 2021, 
          jan: 24000, feb: 8800, mar: 11000, apr: 31000, may: 22000, jun: -4400, 
          jul: 8800, aug: -1650, sep: 1100, oct: 16500, nov: 15000, dec: 27500, 
          total: 160000, max_drawdown: -15500 
        },
        { 
          id: '3', 
          year: 2022, 
          jan: 1100, feb: 27500, mar: 15500, apr: -550, may: 33000, jun: 13200, 
          jul: 5500, aug: 27500, sep: 13200, oct: 6600, nov: 6600, dec: 5000, 
          total: 155000, max_drawdown: -11000 
        },
        { 
          id: '4', 
          year: 2023, 
          jan: 22000, feb: -2200, mar: 22000, apr: -3850, may: 3850, jun: 7700, 
          jul: -1320, aug: -4400, sep: 3850, oct: 5500, nov: 2200, dec: -770, 
          total: 55000, max_drawdown: -13200 
        },
        { 
          id: '5', 
          year: 2024, 
          jan: 31000, feb: 11000, mar: 20000, apr: -1100, may: 7700, jun: 4400, 
          jul: 4400, aug: -11000, sep: -3300, oct: 16500, nov: -1650, dec: -1100, 
          total: 76000, max_drawdown: -22000 
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
    case 'velox':
      return {
        id: '1',
        overall_profit: 592758.75,
        overall_profit_percentage: 266.62,
        number_of_trades: 1295,
        win_percentage: 44.09,
        loss_percentage: 55.91,
        max_drawdown: -25942.5,
        max_drawdown_percentage: -11.67,
        avg_profit_per_trade: 457.73,
        avg_profit_per_trade_percentage: 0.21,
        max_profit_in_single_trade: 7323.75,
        max_profit_in_single_trade_percentage: 3.29,
        max_loss_in_single_trade: -4136.25,
        max_loss_in_single_trade_percentage: -1.86,
        avg_profit_on_winning_trades: 2853.84,
        avg_profit_on_winning_trades_percentage: 1.28,
        avg_loss_on_losing_trades: -1432.02,
        avg_loss_on_losing_trades_percentage: -0.64,
        reward_to_risk_ratio: 1.99,
        max_win_streak: 7,
        max_losing_streak: 10,
        return_max_dd: 4.36,
        drawdown_duration: "57 [7/29/2024 to 9/23/2024]",
        max_trades_in_drawdown: 70,
        expectancy_ratio: 0.32
      };
    case 'nova':
      return {
        id: '1',
        overall_profit: 455000,
        overall_profit_percentage: 455.0,
        number_of_trades: 240,
        win_percentage: 70.5,
        loss_percentage: 29.5,
        max_drawdown: -18500,
        max_drawdown_percentage: -18.5,
        avg_profit_per_trade: 1895.83,
        avg_profit_per_trade_percentage: 1.90,
        max_profit_in_single_trade: 28000,
        max_profit_in_single_trade_percentage: 28.0,
        max_loss_in_single_trade: -9300,
        max_loss_in_single_trade_percentage: -9.3,
        avg_profit_on_winning_trades: 9500,
        avg_profit_on_winning_trades_percentage: 9.5,
        avg_loss_on_losing_trades: -3800,
        avg_loss_on_losing_trades_percentage: -3.8,
        reward_to_risk_ratio: 2.5,
        max_win_streak: 8,
        max_losing_streak: 3,
        return_max_dd: 24.6,
        drawdown_duration: "18 days",
        max_trades_in_drawdown: 7,
        expectancy_ratio: 5507.5
      };
    case 'evercrest':
      return {
        id: '1',
        overall_profit: 541000,
        overall_profit_percentage: 541.0,
        number_of_trades: 260,
        win_percentage: 71.5,
        loss_percentage: 28.5,
        max_drawdown: -22000,
        max_drawdown_percentage: -22.0,
        avg_profit_per_trade: 2080.77,
        avg_profit_per_trade_percentage: 2.08,
        max_profit_in_single_trade: 33000,
        max_profit_in_single_trade_percentage: 33.0,
        max_loss_in_single_trade: -11000,
        max_loss_in_single_trade_percentage: -11.0,
        avg_profit_on_winning_trades: 11000,
        avg_profit_on_winning_trades_percentage: 11.0,
        avg_loss_on_losing_trades: -4400,
        avg_loss_on_losing_trades_percentage: -4.4,
        reward_to_risk_ratio: 2.5,
        max_win_streak: 7,
        max_losing_streak: 3,
        return_max_dd: 24.6,
        drawdown_duration: "16 days",
        max_trades_in_drawdown: 8,
        expectancy_ratio: 6545.5
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
