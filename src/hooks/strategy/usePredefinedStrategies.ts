
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
  
  // If no data is returned, return an empty array
  if (!data || data.length === 0) {
    console.log('No predefined strategies found in the database');
    // Create a default strategy if no strategies are found
    return [{
      id: 1,
      name: "Velox Edge Strategy",
      description: "A fast-paced intraday strategy for NIFTY options",
      performance: {
        winRate: "65%",
        avgProfit: "12%",
        drawdown: "8%"
      },
      parameters: [
        { name: "Lot Size", value: "1" },
        { name: "Index", value: "NIFTY" }
      ],
      strategy_details: {
        Index: "NIFTY",
        "Underlying from": "Futures",
        "Strategy Type": "Intraday",
        "Entry Time": "09:20",
        "Exit Time": "15:15",
        "No Re-entry After": "Disabled",
        "Square Off": "Partial",
        "Trail SL to Break-even price": "Enabled",
        "Apply to": "All Legs",
        "Total Lot": "1",
        Segments: ["Futures", "Options"],
        Legs: [
          {
            id: 1,
            lots: 1,
            position: "Sell",
            optionType: "Put",
            expiry: "Weekly",
            strikeCriteria: "Closest Premium",
            premium: 100,
            targetProfit: "Disabled",
            stopLoss: "Disabled",
            trailSL: "Enabled",
            reEntryOnTarget: "Disabled",
            reEntryOnStopLoss: "Disabled",
            simpleMomentum: "Disabled",
            rangeBreakout: "Disabled",
            segment: "options"
          }
        ]
      }
    }];
  }
  
  // Make sure to properly parse the strategy_details column
  return (data || []).map(strategy => {
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
};

export const usePredefinedStrategies = () => {
  return useQuery({
    queryKey: ['predefined-strategies'],
    queryFn: fetchPredefinedStrategies
  });
};
