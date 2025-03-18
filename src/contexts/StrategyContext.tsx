
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StrategyContextType {
  // Add appropriate types here based on your application needs
  selectedStrategy: any | null;
  setSelectedStrategy: (strategy: any | null) => void;
}

const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

export const StrategyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<any | null>(null);

  return (
    <StrategyContext.Provider value={{ 
      selectedStrategy, 
      setSelectedStrategy
    }}>
      {children}
    </StrategyContext.Provider>
  );
};

export const useStrategy = () => {
  const context = useContext(StrategyContext);
  if (context === undefined) {
    throw new Error('useStrategy must be used within a StrategyProvider');
  }
  return context;
};
