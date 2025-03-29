
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

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

// Fallback to localStorage if user is not authenticated
const STORAGE_KEY = 'backtest-results';

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
      // If no user is authenticated, try to get results from localStorage
      try {
        const storedResults = localStorage.getItem(STORAGE_KEY);
        const parsedResults = storedResults ? JSON.parse(storedResults) : [];
        setBacktestResults(parsedResults);
      } catch (err) {
        console.error("Error fetching local backtest results:", err);
      }
      setLoading(false);
    }
  }, [user]);

  const fetchBacktestResults = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch results from Supabase
      const { data, error: fetchError } = await supabase
        .from('backtest_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;

      // Map database fields to our interface
      const mappedResults: BacktestResult[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        strategyId: null,
        startDate: item.entry_date || new Date().toISOString().split('T')[0],
        endDate: item.exit_date || new Date().toISOString().split('T')[0],
        strategyName: item.strategy_name,
        entryDate: item.entry_date,
        entryWeekday: item.entry_weekday,
        entryTime: item.entry_time,
        entryPrice: item.entry_price !== null ? Number(item.entry_price) : null,
        quantity: item.quantity !== null ? Number(item.quantity) : null,
        instrumentKind: item.instrument_kind,
        strikePrice: item.strike_price !== null ? Number(item.strike_price) : null,
        position: item.position,
        exitDate: item.exit_date,
        exitWeekday: item.exit_weekday,
        exitTime: item.exit_time,
        exitPrice: item.exit_price !== null ? Number(item.exit_price) : null,
        pl: item.pl !== null ? Number(item.pl) : null,
        plPercentage: item.pl_percentage !== null ? Number(item.pl_percentage) : null,
        expiryDate: item.expiry_date,
        highestMtm: item.highest_mtm !== null ? Number(item.highest_mtm) : null,
        lowestMtm: item.lowest_mtm !== null ? Number(item.lowest_mtm) : null,
        remarks: item.remarks,
        createdAt: item.created_at
      }));

      setBacktestResults(mappedResults);
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
      // If no user, save to localStorage
      try {
        const newResult: BacktestResult = {
          ...data,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };

        const storedResults = localStorage.getItem(STORAGE_KEY);
        const existingResults = storedResults ? JSON.parse(storedResults) : [];
        const updatedResults = [...existingResults, newResult];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
        setBacktestResults(updatedResults);
        
        toast({
          title: "Success",
          description: "Backtest result saved locally (not logged in)",
        });
        
        return newResult.id;
      } catch (err) {
        console.error("Error saving local backtest result:", err);
        toast({
          title: "Error",
          description: "Failed to save backtest result locally",
          variant: "destructive",
        });
        return null;
      }
    }

    try {
      // Map our interface to database fields
      const dbRecord = {
        user_id: user.id,
        title: data.title,
        description: data.description,
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
      };

      // Insert into Supabase
      const { data: insertedData, error: insertError } = await supabase
        .from('backtest_reports')
        .insert(dbRecord)
        .select('*')
        .single();
      
      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Backtest result saved successfully",
      });

      // Refresh the list
      fetchBacktestResults();
      
      return insertedData.id;
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
    if (!user) {
      // If no user, delete from localStorage
      try {
        const storedResults = localStorage.getItem(STORAGE_KEY);
        if (!storedResults) return false;
        
        const existingResults = JSON.parse(storedResults);
        const updatedResults = existingResults.filter(
          (result: BacktestResult) => result.id !== id
        );
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
        setBacktestResults(updatedResults);
        
        toast({
          title: "Success",
          description: "Backtest result deleted from local storage",
        });
        
        return true;
      } catch (err) {
        console.error("Error deleting local backtest result:", err);
        toast({
          title: "Error",
          description: "Failed to delete local backtest result",
          variant: "destructive",
        });
        return false;
      }
    }

    try {
      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from('backtest_reports')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;

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
