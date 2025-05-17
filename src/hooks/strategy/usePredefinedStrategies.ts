
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PREMIUM_STRATEGY_IDS } from "./types";

export interface StrategyLeg {
  id: number;
  lots: number;
  position: string;
  optionType: string;
  expiry: string;
  strikeCriteria: string;
  premium: number;
  targetProfit: string;
  stopLoss: string;
  trailSL: string;
  reEntryOnTarget: string;
  reEntryOnStopLoss: string;
  simpleMomentum: string;
  rangeBreakout: string;
  segment?: string;
}

export interface PredefinedStrategy {
  id: number;
  name: string;
  description: string;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  parameters: Array<{
    name: string;
    value: string;
  }>;
  strategy_details?: {
    [key: string]: any;
    Legs?: StrategyLeg[];
  } | null;
}

const fetchPredefinedStrategies = async (): Promise<PredefinedStrategy[]> => {
  const { data, error } = await supabase
    .from('predefined_strategies')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching predefined strategies:', error);
    throw error;
  }

  console.log('Fetched predefined strategies raw data:', data);
  
  // Make sure to properly parse the strategy_details column
  return (data || []).map(strategy => {
    // Ensure strategy.id is a number for consistent comparison
    const strategyId = typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : Number(strategy.id);
    
    console.log(`Processing strategy ${strategyId}: ${strategy.name}`);
    
    // Ensure strategy_details is properly parsed
    let parsedStrategyDetails: any = strategy.strategy_details;
    
    // If it's a string, try to parse it as JSON
    if (parsedStrategyDetails && typeof parsedStrategyDetails === 'string') {
      try {
        parsedStrategyDetails = JSON.parse(parsedStrategyDetails);
      } catch (err) {
        console.error('Error parsing strategy_details JSON:', err);
        parsedStrategyDetails = null;
      }
    }
    
    // Type guard to check if parsedStrategyDetails has the Legs property
    const hasLegs = parsedStrategyDetails && 
      typeof parsedStrategyDetails === 'object' && 
      parsedStrategyDetails !== null &&
      'Legs' in parsedStrategyDetails;
    
    // Log the data for debugging
    if (hasLegs) {
      console.log(`Strategy ${strategyId} has ${parsedStrategyDetails.Legs?.length} legs:`, 
        parsedStrategyDetails.Legs);
    } else {
      console.log(`Strategy ${strategyId} has no legs or invalid leg data.`);
    }
    
    // Explicitly check if the strategy ID is in the premium list
    const isPremium = PREMIUM_STRATEGY_IDS.includes(strategyId);
    
    console.log(`Setting isPremium flag for strategy ${strategyId} to ${isPremium}. In PREMIUM_STRATEGY_IDS: ${PREMIUM_STRATEGY_IDS.includes(strategyId)}`);
    
    return {
      id: strategyId, // Ensure id is a number
      name: strategy.name,
      description: strategy.description,
      performance: strategy.performance as PredefinedStrategy['performance'],
      parameters: strategy.parameters as PredefinedStrategy['parameters'],
      strategy_details: parsedStrategyDetails as PredefinedStrategy['strategy_details'],
      isPremium: isPremium // Add isPremium flag
    };
  });
};

export const usePredefinedStrategies = () => {
  return useQuery({
    queryKey: ['predefined-strategies'],
    queryFn: fetchPredefinedStrategies
  });
};
