
import React from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const PortfolioPage: React.FC = () => {
  const { assets, totalValue } = usePortfolio();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Portfolio</h1>
      
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl mb-2">Total Value</h2>
        <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</p>
      </div>
      
      {assets.length > 0 ? (
        <div className="grid gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{asset.symbol}</h3>
                <p className="text-gray-400">{asset.quantity} shares</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${(asset.quantity * asset.currentPrice).toFixed(2)}</p>
                <p className="text-sm text-gray-400">
                  ${asset.currentPrice.toFixed(2)} per share
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p>You don't have any assets in your portfolio yet.</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
