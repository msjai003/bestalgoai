
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface BacktestResult {
  id: string;
  title: string;
  description: string | null;
  strategyId: string | null;
  startDate: string;
  endDate: string;
  metrics: {
    totalTrades: number;
    winRate: number;
    avgProfit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    cagr: number;
    calmerRatio: number;
    winningStreak: number;
    lossStreak: number;
  };
  dailyPerformance: Array<{
    date: string;
    profit: number;
    trades: number;
    winRate: number;
  }>;
  monthlyPerformance: Array<{
    month: string;
    profit: number;
    trades: number;
    winRate: number;
  }>;
  createdAt: string;
}

type SaveBacktestParams = Omit<BacktestResult, 'id' | 'createdAt'>;

export const useBacktestResults = () => {
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBacktestResults();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBacktestResults = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('backtest_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedResults: BacktestResult[] = data.map(result => ({
        id: result.id,
        title: result.title,
        description: result.description,
        strategyId: result.strategy_id,
        startDate: result.start_date,
        endDate: result.end_date,
        metrics: result.metrics as BacktestResult['metrics'],
        dailyPerformance: result.daily_performance as BacktestResult['dailyPerformance'] || [],
        monthlyPerformance: result.monthly_performance as BacktestResult['monthlyPerformance'] || [],
        createdAt: result.created_at
      }));

      setBacktestResults(formattedResults);
    } catch (err) {
      console.error("Error fetching backtest results:", err);
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

  const saveBacktestResult = async (data: SaveBacktestParams) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save backtest results",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: result, error } = await supabase
        .from('backtest_results')
        .insert({
          user_id: user.id,
          strategy_id: data.strategyId,
          title: data.title,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate,
          metrics: data.metrics,
          daily_performance: data.dailyPerformance,
          monthly_performance: data.monthlyPerformance
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Backtest result saved successfully",
      });

      // Refresh the list
      fetchBacktestResults();
      
      return result.id;
    } catch (err) {
      console.error("Error saving backtest result:", err);
      toast({
        title: "Error",
        description: "Failed to save backtest result",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteBacktestResult = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('backtest_results')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setBacktestResults(prev => prev.filter(result => result.id !== id));
      
      toast({
        title: "Success",
        description: "Backtest result deleted successfully",
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting backtest result:", err);
      toast({
        title: "Error",
        description: "Failed to delete backtest result",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    backtestResults,
    loading,
    error,
    fetchBacktestResults,
    saveBacktestResult,
    deleteBacktestResult
  };
};
