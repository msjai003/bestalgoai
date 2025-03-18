
import React, { createContext, useContext, useState, ReactNode } from 'react';

type PortfolioAsset = {
  id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

type PortfolioContextType = {
  assets: PortfolioAsset[];
  totalValue: number;
  isLoading: boolean;
  updateAsset: (assetId: string, quantity: number) => void;
};

const defaultContext: PortfolioContextType = {
  assets: [],
  totalValue: 0,
  isLoading: false,
  updateAsset: () => {},
};

const PortfolioContext = createContext<PortfolioContextType>(defaultContext);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate total portfolio value based on current prices
  const totalValue = assets.reduce(
    (sum, asset) => sum + asset.quantity * asset.currentPrice, 
    0
  );

  const updateAsset = (assetId: string, quantity: number) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId ? { ...asset, quantity } : asset
      )
    );
  };

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        totalValue,
        isLoading,
        updateAsset,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
