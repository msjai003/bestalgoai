
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

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

// Storage key for localStorage
const STORAGE_KEY = 'backtest-results';

export const useBacktestResults = () => {
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load backtest results on component mount
  useEffect(() => {
    fetchBacktestResults();
  }, [user]);

  const fetchBacktestResults = async () => {
    try {
      setLoading(true);
      
      if (user) {
        // Fetch from Supabase if user is authenticated
        const { data, error } = await supabase
          .from('backtest_reports')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Transform data from Supabase format to app format
          const transformedData: BacktestResult[] = data.map(item => ({
            id: item.id,
            title: item.strategy_name || 'Untitled Backtest',
            description: item.remarks,
            strategyId: null,
            startDate: item.entry_date || new Date().toISOString().split('T')[0],
            endDate: item.exit_date || new Date().toISOString().split('T')[0],
            strategyName: item.strategy_name,
            entryDate: item.entry_date,
            entryWeekday: item.entry_weekday,
            entryTime: item.entry_time,
            entryPrice: item.entry_price,
            quantity: item.quantity,
            instrumentKind: item.instrument_kind,
            strikePrice: item.strike_price,
            position: item.position,
            exitDate: item.exit_date,
            exitWeekday: item.exit_weekday,
            exitTime: item.exit_time,
            exitPrice: item.exit_price,
            pl: item.pl,
            plPercentage: item.pl_percentage,
            expiryDate: item.expiry_date,
            highestMtm: item.highest_mtm,
            lowestMtm: item.lowest_mtm,
            remarks: item.remarks,
            createdAt: item.created_at
          }));
          
          setBacktestResults(transformedData);
        }
      } else {
        // Fallback to localStorage if user is not authenticated
        const storedResults = localStorage.getItem(STORAGE_KEY);
        const parsedResults = storedResults ? JSON.parse(storedResults) : [];
        setBacktestResults(parsedResults);
      }
    } catch (err) {
      console.error("Error fetching backtest results:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to load backtest results",
        variant: "destructive",
      });
      
      // Fallback to localStorage on error
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const parsedResults = storedResults ? JSON.parse(storedResults) : [];
      setBacktestResults(parsedResults);
    } finally {
      setLoading(false);
    }
  };

  const saveBacktestResult = async (data: SaveBacktestParams) => {
    try {
      const newId = uuidv4();
      const createdAt = new Date().toISOString();
      
      const newResult: BacktestResult = {
        ...data,
        id: newId,
        createdAt
      };

      if (user) {
        // Save to Supabase if user is authenticated
        const { error } = await supabase
          .from('backtest_reports')
          .insert({
            id: newId,
            user_id: user.id,
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
          });
          
        if (error) throw error;
      } else {
        // Save to localStorage if user is not authenticated
        const storedResults = localStorage.getItem(STORAGE_KEY);
        const existingResults = storedResults ? JSON.parse(storedResults) : [];
        const updatedResults = [...existingResults, newResult];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
      }
      
      // Update state
      setBacktestResults(prevResults => [newResult, ...prevResults]);
      
      toast({
        title: "Success",
        description: "Backtest result saved successfully",
      });
      
      return newId;
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
    try {
      if (user) {
        // Delete from Supabase if user is authenticated
        const { error } = await supabase
          .from('backtest_reports')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Delete from localStorage if user is not authenticated
        const storedResults = localStorage.getItem(STORAGE_KEY);
        if (!storedResults) return false;
        
        const existingResults = JSON.parse(storedResults);
        const updatedResults = existingResults.filter(
          (result: BacktestResult) => result.id !== id
        );
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
      }
      
      // Update state
      setBacktestResults(prevResults => 
        prevResults.filter(result => result.id !== id)
      );
      
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
