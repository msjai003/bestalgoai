
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StrategyLeg {
  id: number;
  lots: number;
  position: string;
  optionType: string;
  expiry: string;
  strikeCriteria: string;
  premium: number | string;
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
  
  // Make sure to properly parse the strategy_details column and filter out the Premium Strategy
  const strategies = (data || [])
    .filter(strategy => strategy.name !== "Premium Strategy") // Filter out Premium Strategy
    .map(strategy => {
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
      
      // Handle both uppercase and lowercase 'legs' key
      const hasLegs = parsedStrategyDetails && 
        typeof parsedStrategyDetails === 'object' && 
        parsedStrategyDetails !== null &&
        (('Legs' in parsedStrategyDetails) || ('legs' in parsedStrategyDetails));
      
      // Normalize the legs data
      if (hasLegs) {
        const legsArray = parsedStrategyDetails.Legs || parsedStrategyDetails.legs;
        
        if (Array.isArray(legsArray)) {
          console.log(`Strategy ${strategy.id} has ${legsArray.length} legs:`, legsArray);
          // Ensure we use uppercase "Legs" consistently
          if ('legs' in parsedStrategyDetails) {
            parsedStrategyDetails.Legs = legsArray;
            delete parsedStrategyDetails.legs;
          }
        } else {
          console.log(`Strategy ${strategy.id} has invalid leg data.`);
        }
      } else {
        console.log(`Strategy ${strategy.id} has no legs data.`);
      }
      
      return {
        id: strategy.id,
        name: strategy.name,
        description: strategy.description,
        performance: strategy.performance as PredefinedStrategy['performance'],
        parameters: strategy.parameters as PredefinedStrategy['parameters'],
        strategy_details: parsedStrategyDetails as PredefinedStrategy['strategy_details']
      };
    });

  // Add Zenflow as a default strategy if no strategies or only one strategy is found
  if (strategies.length === 0 || (strategies.length === 1 && strategies[0].id === 1)) {
    const zenflowExists = strategies.some(s => s.name === "Zenflow Strategy");
    
    if (!zenflowExists) {
      strategies.push({
        id: 2,
        name: "Zenflow Strategy",
        description: "Advanced multi-leg options strategy with dynamic hedging",
        performance: {
          winRate: "78%",
          avgProfit: "15%",
          drawdown: "6%"
        },
        parameters: [
          { name: "Lot Size", value: "2" },
          { name: "Index", value: "BANKNIFTY" }
        ],
        strategy_details: {
          Index: "BANKNIFTY",
          "Strategy Type": "Intraday",
          Legs: [
            {
              id: 1,
              lots: 2,
              position: "Sell",
              optionType: "Call",
              expiry: "Weekly",
              strikeCriteria: "ATM",
              premium: 120,
              targetProfit: "10%",
              stopLoss: "5%",
              trailSL: "Enabled",
              reEntryOnTarget: "Enabled",
              reEntryOnStopLoss: "Disabled",
              simpleMomentum: "Enabled",
              rangeBreakout: "Enabled",
              segment: "options"
            }
          ]
        }
      });
    }
  }
  
  return strategies;
};

export const usePredefinedStrategies = () => {
  return useQuery({
    queryKey: ['predefined-strategies'],
    queryFn: fetchPredefinedStrategies
  });
};
