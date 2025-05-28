
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
    <section id="portfolio-overview" className="mt-4">
      <div className="bg-charcoalSecondary rounded-xl p-6 lg:p-8 border border-gray-800/40 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-gray-400 text-sm mb-1">Portfolio Value</h2>
            <p className="text-3xl lg:text-4xl font-bold text-white">{formattedValue}</p>
          </div>
          <Button 
            variant="logout"
            size="sm"
            asChild
            className="text-charcoalPrimary px-6 py-2 lg:px-8 lg:py-3 self-start lg:self-center"
          >
            <Link to="/subscription">Upgrade</Link>
          </Button>
        </div>
        
        <div className="mb-6">
          <PortfolioChart performanceData={performanceData} />
        </div>
        
        <div className="grid grid-cols-2 gap-6 lg:gap-8">
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-gray-400 text-sm mb-1">Today's P&L</p>
            <p className="text-emerald-400 font-semibold text-lg lg:text-xl">+₹24,500</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-400 text-sm mb-1">Overall P&L</p>
            <p className="text-emerald-400 font-semibold text-lg lg:text-xl">+₹1,45,500</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioOverview;
