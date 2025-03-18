
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BrokerContextType {
  // Add appropriate types here based on your application needs
  connectedBroker: string | null;
  setConnectedBroker: (broker: string | null) => void;
}

const BrokerContext = createContext<BrokerContextType | undefined>(undefined);

export const BrokerProvider = ({ children }: { children: ReactNode }) => {
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null);

  return (
    <BrokerContext.Provider value={{ 
      connectedBroker, 
      setConnectedBroker
    }}>
      {children}
    </BrokerContext.Provider>
  );
};

export const useBroker = () => {
  const context = useContext(BrokerContext);
  if (context === undefined) {
    throw new Error('useBroker must be used within a BrokerProvider');
  }
  return context;
};
