
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

export const useZenflowBacktestResults = () => {
  const [zenflowResults, setZenflowResults] = useState<ZenflowBacktestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchZenflowBacktestResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching Zenflow backtest results from strategy_first table...");
      
      // Fetch data from Supabase strategy_first table instead of Zenflow_backtest
      const { data, error } = await supabase
        .from('strategy_first')
        .select('*');
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Strategy first data received:", data);
      
      if (data) {
        setZenflowResults(data);
      } else {
        console.log("No data received from strategy_first table");
        setZenflowResults([]);
      }
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

  // Initial fetch
  useEffect(() => {
    fetchZenflowBacktestResults();
  }, []);

  return {
    zenflowResults,
    loading,
    error,
    fetchZenflowBacktestResults
  };
};
