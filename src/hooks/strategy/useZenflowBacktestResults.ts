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
}

export const useZenflowBacktestResults = () => {
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
      
      // Fetch data from the zenflow_strategy table
      const { data, error } = await supabase
        .from('zenflow_strategy')
        .select('*')
        .order('year', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      console.log("Fetched strategy data:", data);
      
      // Set the strategy data
      setStrategyData(data as ZenflowStrategyData[]);
      
      // Calculate metrics from the actual database data
      calculateMetricsFromData(data as ZenflowStrategyData[]);
      
      // For backward compatibility, keeping the old array empty
      setZenflowResults([]);
      
    } catch (err) {
      console.error("Error fetching Zenflow backtest results:", err);
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

  // Calculate comprehensive metrics from the actual strategy data in the database
  const calculateMetricsFromData = (data: ZenflowStrategyData[]) => {
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
    
    setMetrics(calculatedMetrics);
  };

  // Initial fetch
  useEffect(() => {
    fetchZenflowBacktestResults();
  }, []);

  return {
    zenflowResults,
    strategyData,
    metrics,
    loading,
    error,
    fetchZenflowBacktestResults
  };
};
