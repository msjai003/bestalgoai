
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PortfolioContextType {
  // Add appropriate types here based on your application needs
  portfolio: any[];
  setPortfolio: (portfolio: any[]) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [portfolio, setPortfolio] = useState<any[]>([]);

  return (
    <PortfolioContext.Provider value={{ 
      portfolio, 
      setPortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
