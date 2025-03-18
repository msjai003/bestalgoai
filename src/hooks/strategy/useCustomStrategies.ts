
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CustomStrategy {
  id: string;
  name: string;
  description: string | null;
  legs: any;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
}

const fetchCustomStrategies = async (userId: string | undefined): Promise<CustomStrategy[]> => {
  if (!userId) {
    return [];
  }

  const { data: customStrategies, error: customError } = await supabase
    .from('custom_strategies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (customError) {
    console.error('Error fetching custom strategies:', customError);
    throw customError;
  }

  const { data: editedStrategies, error: editError } = await supabase
    .from('custom_edit')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (editError) {
    console.error('Error fetching edited strategies:', editError);
    throw editError;
  }

  // Combine and process strategies
  const strategies = customStrategies || [];
  const edits = editedStrategies || [];

  // Map edited strategies back to their originals
  const strategyMap = new Map();
  strategies.forEach(strategy => {
    strategyMap.set(strategy.id, {
      ...strategy,
      performance: strategy.performance || {
        winRate: 'N/A',
        avgProfit: 'N/A',
        drawdown: 'N/A'
      }
    });
  });

  // Apply edits
  edits.forEach(edit => {
    if (edit.strategy_id && strategyMap.has(edit.strategy_id)) {
      strategyMap.set(edit.strategy_id, {
        ...strategyMap.get(edit.strategy_id),
        ...edit,
        performance: edit.performance || {
          winRate: 'N/A',
          avgProfit: 'N/A',
          drawdown: 'N/A'
        }
      });
    }
  });

  return Array.from(strategyMap.values());
};

// CRUD operations for custom strategies
export const createCustomStrategy = async (
  userId: string,
  strategy: Omit<CustomStrategy, 'id' | 'created_at' | 'updated_at' | 'created_by'>
) => {
  const { data, error } = await supabase
    .from('custom_strategies')
    .insert([
      {
        ...strategy,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCustomStrategy = async (
  userId: string,
  strategyId: string,
  updates: Partial<CustomStrategy>
) => {
  const { data, error } = await supabase
    .from('custom_edit')
    .upsert({
      strategy_id: strategyId,
      user_id: userId,
      name: updates.name,
      description: updates.description,
      legs: updates.legs,
      is_active: updates.is_active,
      performance: updates.performance
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCustomStrategy = async (strategyId: string) => {
  const { error } = await supabase
    .from('custom_strategies')
    .delete()
    .eq('id', strategyId);

  if (error) throw error;
};

export const useCustomStrategies = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['custom-strategies', user?.id],
    queryFn: () => fetchCustomStrategies(user?.id),
    enabled: !!user
  });
};
