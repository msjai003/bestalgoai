
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./types";
import { TradeType } from "@/types/strategy";

export const useCustomStrategies = () => {
  const [customStrategies, setCustomStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCustomStrategies = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('custom_strategies')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedStrategies: Strategy[] = data.map(strategy => {
          // Extract performance data safely with type checking
          let winRate = "N/A";
          let avgProfit = "N/A";
          let drawdown = "N/A";
          
          if (strategy.performance && typeof strategy.performance === 'object' && !Array.isArray(strategy.performance)) {
            // Now TypeScript knows performance is an object, not an array
            const perf = strategy.performance as Record<string, any>;
            winRate = perf.winRate ? String(perf.winRate) : "N/A";
            avgProfit = perf.avgProfit ? String(perf.avgProfit) : "N/A";
            drawdown = perf.drawdown ? String(perf.drawdown) : "N/A";
          }
          
          // Ensure tradeType is properly cast as TradeType
          const tradeTypeValue = strategy.trade_type || "paper";
          const parsedTradeType: TradeType = 
            tradeTypeValue === "live trade" || 
            tradeTypeValue === "paper" || 
            tradeTypeValue === "completed" 
              ? tradeTypeValue as TradeType 
              : "paper";
          
          return {
            id: typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : parseInt(Math.random() * 10000 + 1000 + ''),
            name: strategy.name,
            description: strategy.description || "",
            isCustom: true,
            isLive: strategy.trade_type === "live trade",
            isWishlisted: true,
            quantity: strategy.quantity || 0,
            selectedBroker: strategy.selected_broker || "",
            brokerUsername: strategy.broker_username || "",
            tradeType: parsedTradeType,
            rowId: strategy.id,
            uniqueId: `custom-${strategy.id}`,
            performance: {
              winRate,
              profitFactor: "N/A",
              avgProfit,
              avgLoss: "N/A"
            }
          };
        });

        setCustomStrategies(formattedStrategies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching custom strategies:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setLoading(false);
      }
    };

    fetchCustomStrategies();
  }, [user]);

  return { customStrategies, loading, error };
};
