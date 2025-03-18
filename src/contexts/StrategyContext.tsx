
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PredefinedStrategy } from '@/types/predefined-strategy';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type StrategyContextType = {
  strategies: PredefinedStrategy[];
  loading: boolean;
  error: string | null;
  setStrategies: (strategies: PredefinedStrategy[]) => void;
  fetchStrategies: () => Promise<void>;
};

const defaultContext: StrategyContextType = {
  strategies: [],
  loading: false,
  error: null,
  setStrategies: () => {},
  fetchStrategies: async () => {},
};

const StrategyContext = createContext<StrategyContextType>(defaultContext);

export const StrategyProvider = ({ children }: { children: ReactNode }) => {
  const [strategies, setStrategies] = useState<PredefinedStrategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Only admins can fetch predefined strategies due to RLS policies
      if (isAdmin) {
        const { data, error } = await supabase
          .from('predefined_strategies')
          .select('*') as { data: PredefinedStrategy[] | null, error: any };
          
        if (error) throw error;
        
        if (data) {
          setStrategies(data);
        } else {
          setStrategies([]);
        }
      } else {
        // For non-admin users, we could fetch a public subset or nothing
        setStrategies([]);
      }
    } catch (err: any) {
      console.error('Error fetching strategies:', err);
      setError(err.message || 'Failed to load strategies');
      toast.error('Could not load strategies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch strategies on initial load if user is admin
  useEffect(() => {
    if (user && isAdmin) {
      fetchStrategies();
    }
  }, [user, isAdmin]);

  return (
    <StrategyContext.Provider
      value={{
        strategies,
        loading,
        error,
        setStrategies,
        fetchStrategies
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};

export const useStrategyContext = () => useContext(StrategyContext);
