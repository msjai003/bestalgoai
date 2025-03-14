
import { supabase } from "@/integrations/supabase/client";
import { Strategy, StrategySelection } from "./types";

// Helper function to fetch strategies from database
export const fetchUserStrategySelections = async (userId: string | undefined): Promise<StrategySelection[]> => {
  if (!userId) return [];
  
  const { data: selections, error } = await supabase
    .from('strategy_selections')
    .select('strategy_id, quantity, selected_broker')
    .eq('user_id', userId);
    
  if (error) {
    console.error("Error fetching strategy selections:", error);
    throw error;
  }
  
  return selections || [];
};

// Helper function to map predefined strategies with user selections
export const mapStrategiesWithSelections = (
  predefinedStrategies: any[],
  selections: StrategySelection[]
): Strategy[] => {
  return predefinedStrategies.map(strategy => ({
    ...strategy,
    isWishlisted: selections.some(item => item.strategy_id === strategy.id),
    isLive: false,
    quantity: selections.find(item => item.strategy_id === strategy.id)?.quantity || 0,
    selectedBroker: selections.find(item => item.strategy_id === strategy.id)?.selected_broker || ""
  }));
};
