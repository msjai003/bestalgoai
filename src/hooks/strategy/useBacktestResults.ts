
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

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

  // Load backtest results from localStorage
  useEffect(() => {
    try {
      setLoading(true);
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const parsedResults = storedResults ? JSON.parse(storedResults) : [];
      setBacktestResults(parsedResults);
    } catch (err) {
      console.error("Error fetching local backtest results:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to load backtest results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchBacktestResults = async () => {
    try {
      setLoading(true);
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const parsedResults = storedResults ? JSON.parse(storedResults) : [];
      setBacktestResults(parsedResults);
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

      const storedResults = localStorage.getItem(STORAGE_KEY);
      const existingResults = storedResults ? JSON.parse(storedResults) : [];
      const updatedResults = [...existingResults, newResult];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
      setBacktestResults(updatedResults);
      
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
