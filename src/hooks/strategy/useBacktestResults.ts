
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
      setLoading(false);
    }
  }, [user]);

  const fetchBacktestResults = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get results from localStorage
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const parsedResults = storedResults ? JSON.parse(storedResults) : [];

      // Filter results for current user
      const userResults = parsedResults.filter((result: BacktestResult) => 
        result.id.includes(user.id)
      );

      setBacktestResults(userResults);
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
      // Create a new result with ID and timestamp
      const newResult: BacktestResult = {
        ...data,
        id: `${user.id}-${uuidv4()}`,
        createdAt: new Date().toISOString()
      };

      // Get existing results
      const storedResults = localStorage.getItem(STORAGE_KEY);
      const existingResults = storedResults ? JSON.parse(storedResults) : [];
      
      // Add new result
      const updatedResults = [...existingResults, newResult];
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));

      toast({
        title: "Success",
        description: "Backtest result saved successfully",
      });

      // Refresh the list
      fetchBacktestResults();
      
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
    if (!user) return false;

    try {
      // Get existing results
      const storedResults = localStorage.getItem(STORAGE_KEY);
      if (!storedResults) return false;
      
      const existingResults = JSON.parse(storedResults);
      
      // Filter out the result to delete
      const updatedResults = existingResults.filter(
        (result: BacktestResult) => result.id !== id
      );
      
      // Save filtered results back to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));

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
