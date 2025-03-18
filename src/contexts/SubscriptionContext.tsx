
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

type SubscriptionContextType = {
  currentPlan: SubscriptionPlan;
  isActive: boolean;
  expiryDate: Date | null;
  updatePlan: (plan: SubscriptionPlan) => void;
};

const defaultContext: SubscriptionContextType = {
  currentPlan: 'free',
  isActive: true,
  expiryDate: null,
  updatePlan: () => {},
};

const SubscriptionContext = createContext<SubscriptionContextType>(defaultContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('free');
  const [isActive, setIsActive] = useState(true);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const updatePlan = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan);
    // Additional logic for plan updates could go here
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        isActive,
        expiryDate,
        updatePlan,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
