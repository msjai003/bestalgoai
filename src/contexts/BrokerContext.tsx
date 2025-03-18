
import React, { createContext, useContext, useState, ReactNode } from 'react';

type BrokerContextType = {
  connectedBrokers: string[];
  isConnecting: boolean;
  connectBroker: (brokerId: string) => Promise<boolean>;
  disconnectBroker: (brokerId: string) => void;
};

const defaultContext: BrokerContextType = {
  connectedBrokers: [],
  isConnecting: false,
  connectBroker: async () => false,
  disconnectBroker: () => {},
};

const BrokerContext = createContext<BrokerContextType>(defaultContext);

export const BrokerProvider = ({ children }: { children: ReactNode }) => {
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectBroker = async (brokerId: string): Promise<boolean> => {
    setIsConnecting(true);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setConnectedBrokers(prev => [...prev, brokerId]);
    setIsConnecting(false);
    
    return true;
  };

  const disconnectBroker = (brokerId: string) => {
    setConnectedBrokers(prev => prev.filter(id => id !== brokerId));
  };

  return (
    <BrokerContext.Provider
      value={{
        connectedBrokers,
        isConnecting,
        connectBroker,
        disconnectBroker,
      }}
    >
      {children}
    </BrokerContext.Provider>
  );
};

export const useBroker = () => useContext(BrokerContext);
