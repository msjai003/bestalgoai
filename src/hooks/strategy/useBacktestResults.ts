
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
  strategyName: string | null;
  entryDate: string | null;
  entryWeekday: string | null;
  entryTime: string | null;
  entryPrice: number | null;
  quantity: number | null;
  instrumentKind: string | null;
  strikePrice: number | null;
  position: string | null;
  exitDate: string | null;
  exitWeekday: string | null;
  exitTime: string | null;
  exitPrice: number | null;
  pl: number | null;
  plPercentage: number | null;
  expiryDate: string | null;
  highestMtm: number | null;
  lowestMtm: number | null;
  remarks: string | null;
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
        strategyName: result.strategy_name,
        startDate: result.start_date,
        endDate: result.end_date,
        entryDate: result.entry_date,
        entryWeekday: result.entry_weekday,
        entryTime: result.entry_time,
        entryPrice: result.entry_price,
        quantity: result.quantity,
        instrumentKind: result.instrument_kind,
        strikePrice: result.strike_price,
        position: result.position,
        exitDate: result.exit_date,
        exitWeekday: result.exit_weekday,
        exitTime: result.exit_time,
        exitPrice: result.exit_price,
        pl: result.pl,
        plPercentage: result.pl_percentage,
        expiryDate: result.expiry_date,
        highestMtm: result.highest_mtm,
        lowestMtm: result.lowest_mtm,
        remarks: result.remarks,
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
          strategy_name: data.strategyName,
          entry_date: data.entryDate,
          entry_weekday: data.entryWeekday,
          entry_time: data.entryTime,
          entry_price: data.entryPrice,
          quantity: data.quantity,
          instrument_kind: data.instrumentKind,
          strike_price: data.strikePrice,
          position: data.position,
          exit_date: data.exitDate,
          exit_weekday: data.exitWeekday,
          exit_time: data.exitTime,
          exit_price: data.exitPrice,
          pl: data.pl,
          pl_percentage: data.plPercentage,
          expiry_date: data.expiryDate,
          highest_mtm: data.highestMtm,
          lowest_mtm: data.lowestMtm,
          remarks: data.remarks
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
