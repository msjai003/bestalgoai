
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Strategy } from "./types";

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

        const formattedStrategies: Strategy[] = data.map(strategy => ({
          id: typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : parseInt(Math.random() * 10000 + 1000 + ''),
          name: strategy.name,
          description: strategy.description || "",
          isCustom: true,
          isLive: strategy.trade_type === "live trade",
          isWishlisted: true,
          quantity: strategy.quantity || 0,
          selectedBroker: strategy.selected_broker || "",
          brokerUsername: strategy.broker_username || "",
          tradeType: strategy.trade_type || "paper trade",
          rowId: strategy.id,
          uniqueId: `custom-${strategy.id}`,
          performance: {
            winRate: typeof strategy.performance === 'object' && strategy.performance ? 
              String(strategy.performance.winRate || "N/A") : "N/A",
            avgProfit: typeof strategy.performance === 'object' && strategy.performance ? 
              String(strategy.performance.avgProfit || "N/A") : "N/A",
            drawdown: typeof strategy.performance === 'object' && strategy.performance ? 
              String(strategy.performance.drawdown || "N/A") : "N/A"
          }
        }));

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
