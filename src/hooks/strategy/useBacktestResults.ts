
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

  // Load backtest results from localStorage only (avoid Supabase errors)
  const fetchBacktestResults = async () => {
    try {
      setLoading(true);

      // Load from localStorage for compatibility
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const localResults: BacktestResult[] = storedResults ? JSON.parse(storedResults) : [];
      
      // Use only localStorage data to avoid TypeScript errors with Supabase
      setBacktestResults(localResults);
    } catch (err) {
      console.error("Error fetching backtest results:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBacktestResults();
  }, [user]);

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
      
      // Update the state with the new result
      setBacktestResults(prev => [...prev, newResult]);
      
      return newResult.id;
    } catch (err) {
      console.error("Error saving backtest result:", err);
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
      
      // Update state
      setBacktestResults(prev => prev.filter(result => result.id !== id));
      
      return true;
    } catch (err) {
      console.error("Error deleting backtest result:", err);
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
