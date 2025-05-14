
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
  user_id?: string;
}

type SaveBacktestParams = Omit<BacktestResult, 'id' | 'createdAt' | 'user_id'>;

// Storage key for localStorage (kept for backward compatibility)
const STORAGE_KEY = 'backtest-results';

export const useBacktestResults = () => {
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load backtest results from both localStorage (for backward compatibility) and Supabase
  useEffect(() => {
    fetchBacktestResults();
  }, [toast, user]);

  const fetchBacktestResults = async () => {
    try {
      setLoading(true);

      // First load from localStorage for backward compatibility
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const localResults: BacktestResult[] = storedResults ? JSON.parse(storedResults) : [];

      // Then fetch from Supabase if user is authenticated
      let supabaseResults: BacktestResult[] = [];
      
      if (user) {
        // Use explicit typing to avoid type inference issues
        const { data, error } = await supabase
          .from('backtest_results')
          .select('*')
          .eq('user_id', user.id)
          .order('createdAt', { ascending: false })
          .returns<any[]>();

        if (error) {
          throw error;
        }

        if (data) {
          // Safely map the data to our BacktestResult type
          supabaseResults = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            strategyId: item.strategyId,
            startDate: item.startDate,
            endDate: item.endDate,
            strategyName: item.strategyName,
            entryDate: item.entryDate,
            entryWeekday: item.entryWeekday,
            entryTime: item.entryTime,
            entryPrice: item.entryPrice,
            quantity: item.quantity,
            instrumentKind: item.instrumentKind,
            strikePrice: item.strikePrice,
            position: item.position,
            exitDate: item.exitDate,
            exitWeekday: item.exitWeekday,
            exitTime: item.exitTime,
            exitPrice: item.exitPrice,
            pl: item.pl,
            plPercentage: item.plPercentage,
            expiryDate: item.expiryDate,
            highestMtm: item.highestMtm,
            lowestMtm: item.lowestMtm,
            remarks: item.remarks,
            createdAt: item.createdAt,
            user_id: item.user_id
          }));
        }

        console.log("Supabase backtest results:", supabaseResults);
      }

      // Merge results, giving priority to Supabase results
      // And preventing duplicates by checking IDs
      const mergedResults = [...localResults];
      
      supabaseResults.forEach(supabaseResult => {
        const existsInLocal = mergedResults.some(localResult => localResult.id === supabaseResult.id);
        if (!existsInLocal) {
          mergedResults.push(supabaseResult);
        }
      });
      
      setBacktestResults(mergedResults);
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
    try {
      const newResult: BacktestResult = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };

      // Save to localStorage for backward compatibility
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const existingResults = storedResults ? JSON.parse(storedResults) : [];
      const updatedResults = [...existingResults, newResult];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
      
      // Save to Supabase if user is authenticated
      if (user) {
        // Use type assertion to safely handle the insert
        const { error } = await supabase
          .from('backtest_results')
          .insert({
            ...newResult,
            user_id: user.id
          } as any);

        if (error) {
          console.error("Error saving to Supabase:", error);
          throw error;
        }
      }

      // Update the state with the new result
      setBacktestResults(prev => [...prev, newResult]);
      
      toast({
        title: "Success",
        description: "Backtest result saved successfully",
      });
      
      return newResult.id;
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
      // Delete from localStorage
      const storedResults = localStorage.getItem(STORAGE_KEY);
      if (storedResults) {
        const existingResults = JSON.parse(storedResults);
        const updatedResults = existingResults.filter(
          (result: BacktestResult) => result.id !== id
        );
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
      }
      
      // Delete from Supabase if user is authenticated
      if (user) {
        const { error } = await supabase
          .from('backtest_results')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error deleting from Supabase:", error);
          throw error;
        }
      }
      
      // Update state
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
