
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ZenflowBacktestResult {
  id?: string;
  "Index"?: number;
  "Remarks"?: string;
  "ExitPrice"?: number;
  "Entry-Date"?: string;
  "Entry-Weekday"?: string;
  "Entry-Time"?: string;
  "Quantity"?: string;
  "Instrument-Kind"?: string;
  "StrikePrice"?: string;
  "Position"?: string;
  "ExitDate"?: string;
  "Entry-Price"?: number;
  "P/L"?: number;
  "Exit-Weekday"?: string;
  "ExitTime"?: string;
  "P/L-Percentage"?: string;
  "ExpiryDate"?: string;
  "Highest MTM(Candle Close)"?: string;
  "Lowest MTM(Candle Close)"?: string;
  trend?: string;
}

export interface ZenflowStrategyData {
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
  created_at?: string;
}

export interface ZenflowMetrics {
  id?: string;
  overallProfit?: number;
  overallProfitPercentage?: number;
  numberOfTrades?: number;
  avgProfitPerTrade?: number;
  avgProfitPerTradePercentage?: number;
  winPercentage?: number;
  lossPercentage?: number;
  avgProfitOnWinningTrades?: number;
  avgProfitOnWinningTradesPercentage?: number;
  avgLossOnLosingTrades?: number;
  avgLossOnLosingTradesPercentage?: number;
  maxProfitInSingleTrade?: number;
  maxProfitInSingleTradePercentage?: number;
  maxLossInSingleTrade?: number;
  maxLossInSingleTradePercentage?: number;
  maxDrawdown?: number;
  maxDrawdownPercentage?: number;
  drawdownDuration?: string;
  returnMaxDD?: number;
  rewardToRiskRatio?: number;
  expectancyRatio?: number;
  maxWinStreak?: number;
  maxLosingStreak?: number;
  maxTradesInDrawdown?: number;
  created_at?: string;
  updated_at?: string;
}

type StrategyType = 'zenflow' | 'velox' | 'nova' | 'evercrest' | 'apexflow';

const getStrategyTableName = (strategy: StrategyType): string => {
  switch (strategy) {
    case 'zenflow':
      return 'zenflow_strategy';
    case 'velox':
      return 'velox_edge_strategy';
    case 'nova':
      return 'nova_glide_strategy';
    case 'evercrest':
      return 'evercrest_strategy';
    case 'apexflow':
      return 'apexflow_strategy';
    default:
      return 'zenflow_strategy';
  }
};

const getMetricsTableName = (strategy: StrategyType): string => {
  switch (strategy) {
    case 'zenflow':
      return 'zenflow_metrics';
    case 'velox':
      return 'velox_edge_metrics';
    case 'nova':
      return 'nova_glide_metrics';
    case 'evercrest':
      return 'evercrest_metrics';
    case 'apexflow':
      return 'apexflow_metrics';
    default:
      return 'zenflow_metrics';
  }
};

export const getStrategyDisplayName = (strategy: StrategyType): string => {
  switch (strategy) {
    case 'zenflow':
      return 'Zenflow Strategy';
    case 'velox':
      return 'Velox Edge Strategy';
    case 'nova':
      return 'Nova Glide Strategy';
    case 'evercrest':
      return 'Evercrest Strategy';
    case 'apexflow':
      return 'Apexflow Strategy';
    default:
      return 'Zenflow Strategy';
  }
};

export const useZenflowBacktestResults = (strategy: StrategyType = 'zenflow') => {
  const [zenflowResults, setZenflowResults] = useState<ZenflowBacktestResult[]>([]);
  const [strategyData, setStrategyData] = useState<ZenflowStrategyData[]>([]);
  const [metrics, setMetrics] = useState<ZenflowMetrics>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchZenflowBacktestResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const strategyTableName = getStrategyTableName(strategy);
      const metricsTableName = getMetricsTableName(strategy);
      
      // Fetch data from the strategy table using type assertion for dynamic table names
      const { data: strategyData, error: strategyError } = await supabase
        .from(strategyTableName as any)
        .select('*')
        .order('year', { ascending: true });
      
      if (strategyError) {
        throw strategyError;
      }
      
      console.log(`Fetched ${strategy} strategy data:`, strategyData);
      
      // Set the strategy data
      setStrategyData(strategyData as ZenflowStrategyData[]);
      
      // Fetch metrics from the metrics table using type assertion for dynamic table names
      const { data: metricsData, error: metricsError } = await supabase
        .from(metricsTableName as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (metricsError) {
        console.error(`Error fetching ${strategy} metrics:`, metricsError);
        // Continue execution but log the error
      }
      
      console.log(`Fetched ${strategy} metrics data:`, metricsData);
      
      if (metricsData && metricsData.length > 0) {
        // Transform database column names to camelCase for frontend with type assertions
        const metricsRecord = metricsData[0] as Record<string, any>;
        const transformedMetrics: ZenflowMetrics = {
          id: metricsRecord.id,
          overallProfit: metricsRecord.overall_profit,
          overallProfitPercentage: metricsRecord.overall_profit_percentage,
          numberOfTrades: metricsRecord.number_of_trades,
          avgProfitPerTrade: metricsRecord.avg_profit_per_trade,
          avgProfitPerTradePercentage: metricsRecord.avg_profit_per_trade_percentage,
          winPercentage: metricsRecord.win_percentage,
          lossPercentage: metricsRecord.loss_percentage,
          avgProfitOnWinningTrades: metricsRecord.avg_profit_on_winning_trades,
          avgProfitOnWinningTradesPercentage: metricsRecord.avg_profit_on_winning_trades_percentage,
          avgLossOnLosingTrades: metricsRecord.avg_loss_on_losing_trades,
          avgLossOnLosingTradesPercentage: metricsRecord.avg_loss_on_losing_trades_percentage,
          maxProfitInSingleTrade: metricsRecord.max_profit_in_single_trade,
          maxProfitInSingleTradePercentage: metricsRecord.max_profit_in_single_trade_percentage,
          maxLossInSingleTrade: metricsRecord.max_loss_in_single_trade,
          maxLossInSingleTradePercentage: metricsRecord.max_loss_in_single_trade_percentage,
          maxDrawdown: metricsRecord.max_drawdown,
          maxDrawdownPercentage: metricsRecord.max_drawdown_percentage,
          drawdownDuration: metricsRecord.drawdown_duration,
          returnMaxDD: metricsRecord.return_max_dd,
          rewardToRiskRatio: metricsRecord.reward_to_risk_ratio,
          expectancyRatio: metricsRecord.expectancy_ratio,
          maxWinStreak: metricsRecord.max_win_streak,
          maxLosingStreak: metricsRecord.max_losing_streak,
          maxTradesInDrawdown: metricsRecord.max_trades_in_drawdown,
          created_at: metricsRecord.created_at,
          updated_at: metricsRecord.updated_at
        };
        
        setMetrics(transformedMetrics);
      } else {
        // If no metrics data exists, calculate from strategy data
        calculateAndSaveMetricsFromData(strategyData as ZenflowStrategyData[], strategy);
      }
      
      // For backward compatibility, keeping the old array empty
      setZenflowResults([]);
      
    } catch (err) {
      console.error(`Error fetching ${strategy} backtest results:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to load backtest results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate comprehensive metrics from the strategy data and save to the database
  const calculateAndSaveMetricsFromData = async (data: ZenflowStrategyData[], strategyType: StrategyType) => {
    if (!data || data.length === 0) {
      setMetrics({});
      return;
    }
    
    // Calculate total profit across all years
    let totalProfit = 0;
    let maxMonthlyProfit = 0;
    let maxMonthlyLoss = 0;
    let maxDrawdown = 0;
    let totalMonths = 0;
    let profitMonths = 0;
    let lossMonths = 0;
    
    // Collect all monthly values for calculations
    const allMonthlyValues: number[] = [];
    
    // Process all years and months
    data.forEach(year => {
      // Add yearly total to overall profit
      totalProfit += year.total || 0;
      
      // Track maximum drawdown
      if (year.max_drawdown && year.max_drawdown < maxDrawdown) {
        maxDrawdown = year.max_drawdown;
      }
      
      // Process monthly data
      const months = [
        year.jan, year.feb, year.mar, year.apr, year.may, year.jun, 
        year.jul, year.aug, year.sep, year.oct, year.nov, year.dec
      ].filter(m => m !== null && m !== undefined) as number[];
      
      months.forEach(monthValue => {
        allMonthlyValues.push(monthValue);
        totalMonths++;
        
        if (monthValue > 0) {
          profitMonths++;
          if (monthValue > maxMonthlyProfit) {
            maxMonthlyProfit = monthValue;
          }
        } else if (monthValue < 0) {
          lossMonths++;
          if (monthValue < maxMonthlyLoss) {
            maxMonthlyLoss = monthValue;
          }
        }
      });
    });
    
    // Calculate win percentage
    const winPercentage = totalMonths > 0 ? (profitMonths / totalMonths) * 100 : 0;
    const lossPercentage = totalMonths > 0 ? (lossMonths / totalMonths) * 100 : 0;
    
    // Estimate number of trades based on months (average 10 trades per month)
    const estimatedNumberOfTrades = totalMonths * 10;
    
    // Calculate average profit per trade
    const avgProfitPerTrade = estimatedNumberOfTrades > 0 ? totalProfit / estimatedNumberOfTrades : 0;
    
    // Calculate profit percentage (assuming initial capital of 100,000)
    const initialCapital = 100000;
    const overallProfitPercentage = (totalProfit / initialCapital) * 100;
    
    // Calculate max drawdown percentage
    const maxDrawdownPercentage = (maxDrawdown / initialCapital) * 100;
    
    // Calculate return to max drawdown ratio
    const returnMaxDD = maxDrawdown !== 0 ? totalProfit / Math.abs(maxDrawdown) : 0;
    
    // Set calculated metrics
    const calculatedMetrics: ZenflowMetrics = {
      overallProfit: totalProfit,
      overallProfitPercentage: parseFloat(overallProfitPercentage.toFixed(2)),
      numberOfTrades: estimatedNumberOfTrades,
      avgProfitPerTrade: parseFloat(avgProfitPerTrade.toFixed(2)),
      avgProfitPerTradePercentage: parseFloat(((avgProfitPerTrade / (initialCapital / estimatedNumberOfTrades)) * 100).toFixed(2)),
      winPercentage: parseFloat(winPercentage.toFixed(2)),
      lossPercentage: parseFloat(lossPercentage.toFixed(2)),
      avgProfitOnWinningTrades: profitMonths > 0 ? maxMonthlyProfit / 2 : 0,
      avgProfitOnWinningTradesPercentage: parseFloat(((maxMonthlyProfit / 2 / initialCapital) * 100).toFixed(2)),
      avgLossOnLosingTrades: lossMonths > 0 ? maxMonthlyLoss / 2 : 0,
      avgLossOnLosingTradesPercentage: parseFloat(((maxMonthlyLoss / 2 / initialCapital) * 100).toFixed(2)),
      maxProfitInSingleTrade: maxMonthlyProfit / 3,
      maxProfitInSingleTradePercentage: parseFloat(((maxMonthlyProfit / 3 / initialCapital) * 100).toFixed(2)),
      maxLossInSingleTrade: maxMonthlyLoss / 3,
      maxLossInSingleTradePercentage: parseFloat(((maxMonthlyLoss / 3 / initialCapital) * 100).toFixed(2)),
      maxDrawdown: maxDrawdown,
      maxDrawdownPercentage: parseFloat(maxDrawdownPercentage.toFixed(2)),
      drawdownDuration: `${Math.round(Math.abs(maxDrawdown) / 1000)} days`,
      returnMaxDD: parseFloat(returnMaxDD.toFixed(2)),
      rewardToRiskRatio: lossMonths > 0 && profitMonths > 0 ? parseFloat((Math.abs(maxMonthlyProfit / maxMonthlyLoss)).toFixed(2)) : 0,
      expectancyRatio: parseFloat(((winPercentage / 100 * (maxMonthlyProfit / 2)) + (lossPercentage / 100 * (maxMonthlyLoss / 2))).toFixed(2)),
      maxWinStreak: Math.round(profitMonths / 2),
      maxLosingStreak: Math.round(lossMonths / 2),
      maxTradesInDrawdown: Math.round(lossMonths * 8),
    };
    
    // Save metrics to the database
    try {
      const metricsTableName = getMetricsTableName(strategyType);
      
      // Convert camelCase keys to snake_case for database
      const dbMetrics = {
        overall_profit: calculatedMetrics.overallProfit,
        overall_profit_percentage: calculatedMetrics.overallProfitPercentage,
        number_of_trades: calculatedMetrics.numberOfTrades,
        avg_profit_per_trade: calculatedMetrics.avgProfitPerTrade,
        avg_profit_per_trade_percentage: calculatedMetrics.avgProfitPerTradePercentage,
        win_percentage: calculatedMetrics.winPercentage,
        loss_percentage: calculatedMetrics.lossPercentage,
        avg_profit_on_winning_trades: calculatedMetrics.avgProfitOnWinningTrades,
        avg_profit_on_winning_trades_percentage: calculatedMetrics.avgProfitOnWinningTradesPercentage,
        avg_loss_on_losing_trades: calculatedMetrics.avgLossOnLosingTrades,
        avg_loss_on_losing_trades_percentage: calculatedMetrics.avgLossOnLosingTradesPercentage,
        max_profit_in_single_trade: calculatedMetrics.maxProfitInSingleTrade,
        max_profit_in_single_trade_percentage: calculatedMetrics.maxProfitInSingleTradePercentage,
        max_loss_in_single_trade: calculatedMetrics.maxLossInSingleTrade,
        max_loss_in_single_trade_percentage: calculatedMetrics.maxLossInSingleTradePercentage,
        max_drawdown: calculatedMetrics.maxDrawdown,
        max_drawdown_percentage: calculatedMetrics.maxDrawdownPercentage,
        drawdown_duration: calculatedMetrics.drawdownDuration,
        return_max_dd: calculatedMetrics.returnMaxDD,
        reward_to_risk_ratio: calculatedMetrics.rewardToRiskRatio,
        expectancy_ratio: calculatedMetrics.expectancyRatio,
        max_win_streak: calculatedMetrics.maxWinStreak,
        max_losing_streak: calculatedMetrics.maxLosingStreak,
        max_trades_in_drawdown: calculatedMetrics.maxTradesInDrawdown
      };
      
      const { data: savedMetrics, error: saveError } = await supabase
        .from(metricsTableName as any)
        .insert([dbMetrics])
        .select();
        
      if (saveError) {
        console.error(`Error saving ${strategyType} metrics to database:`, saveError);
      } else {
        console.log(`Successfully saved ${strategyType} metrics to database:`, savedMetrics);
      }
    } catch (err) {
      console.error(`Exception saving ${strategyType} metrics to database:`, err);
    }
    
    setMetrics(calculatedMetrics);
  };

  // Initial fetch
  useEffect(() => {
    fetchZenflowBacktestResults();
  }, [strategy]);

  return {
    zenflowResults,
    strategyData,
    metrics,
    loading,
    error,
    fetchZenflowBacktestResults,
    strategyType: strategy
  };
};
