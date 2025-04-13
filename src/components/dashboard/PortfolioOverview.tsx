
import React from "react";
import { Link } from "react-router-dom";
import PortfolioChart from "./PortfolioChart";
import { Button } from "@/components/ui/button";

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
    <section id="portfolio-overview" className="mt-6 mb-8">
      <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
            <p className="text-2xl font-bold text-white">{formattedValue}</p>
          </div>
          <Button 
            variant="logout"
            size="sm"
            asChild
            className="text-charcoalPrimary px-5 ml-auto"
          >
            <Link to="/subscription">Upgrade</Link>
          </Button>
        </div>
        
        <PortfolioChart performanceData={performanceData} />
        
        <div className="flex justify-between text-sm mt-8">
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-gray-400 mb-2">Today's P&L</p>
            <p className="text-emerald-400 font-medium text-lg">+₹24,500</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-400 mb-2">Overall P&L</p>
            <p className="text-emerald-400 font-medium text-lg">+₹1,45,500</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioOverview;
