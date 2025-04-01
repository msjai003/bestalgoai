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

export const useZenflowBacktestResults = () => {
  const [zenflowResults, setZenflowResults] = useState<ZenflowBacktestResult[]>([]);
  const [strategyData, setStrategyData] = useState<ZenflowStrategyData[]>([]);
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
      
      // Set the strategy data
      setStrategyData(data as ZenflowStrategyData[]);
      
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

  // Initial fetch
  useEffect(() => {
    fetchZenflowBacktestResults();
  }, []);

  return {
    zenflowResults,
    strategyData,
    loading,
    error,
    fetchZenflowBacktestResults
  };
};
