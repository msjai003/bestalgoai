
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PredefinedStrategy } from '@/types/predefined-strategy';

type StrategyContextType = {
  strategies: PredefinedStrategy[];
  loading: boolean;
  error: string | null;
  setStrategies: (strategies: PredefinedStrategy[]) => void;
};

const defaultContext: StrategyContextType = {
  strategies: [],
  loading: false,
  error: null,
  setStrategies: () => {},
};

const StrategyContext = createContext<StrategyContextType>(defaultContext);

export const StrategyProvider = ({ children }: { children: ReactNode }) => {
  const [strategies, setStrategies] = useState<PredefinedStrategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <StrategyContext.Provider
      value={{
        strategies,
        loading,
        error,
        setStrategies,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};

export const useStrategyContext = () => useContext(StrategyContext);
