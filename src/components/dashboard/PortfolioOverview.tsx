
import React from "react";
import { Link } from "react-router-dom";
import PortfolioChart from "./PortfolioChart";

interface PortfolioOverviewProps {
  performanceData: any[];
  currentValue: number;
}

const PortfolioOverview = ({ performanceData, currentValue }: PortfolioOverviewProps) => {
  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(currentValue);

  return (
    <section id="portfolio-overview" className="mt-4">
      <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
            <p className="text-2xl font-bold text-white">{formattedValue}</p>
          </div>
          <Link 
            to="/subscription" 
            className="text-cyan bg-cyan/10 px-3 py-1.5 rounded-lg text-sm hover:bg-cyan/20 transition-colors border border-cyan/20"
          >
            Upgrade
          </Link>
        </div>
        
        <PortfolioChart performanceData={performanceData} />
        
        <div className="flex justify-between text-sm mt-4">
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-gray-400">Today's P&L</p>
            <p className="text-emerald-400 font-medium">+₹24,500</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-400">Overall P&L</p>
            <p className="text-emerald-400 font-medium">+₹1,45,500</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioOverview;
