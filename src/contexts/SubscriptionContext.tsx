
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  // Add appropriate types here based on your application needs
  subscription: string | null;
  setSubscription: (subscription: string | null) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<string | null>(null);

  return (
    <SubscriptionContext.Provider value={{ 
      subscription, 
      setSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
