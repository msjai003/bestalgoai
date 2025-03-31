
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import StrategyItem from "./StrategyItem";

interface StrategiesSectionProps {
  strategies: Array<{
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
  }>;
  hasPremium: boolean;
  onPremiumClick: () => void;
}

const StrategiesSection = ({ strategies, hasPremium, onPremiumClick }: StrategiesSectionProps) => {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">Your Strategies</h2>
        <Link to="/strategy-selection" className="flex items-center text-cyan text-sm">
          See all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      {strategies.map((strategy) => (
        <StrategyItem 
          key={strategy.id} 
          strategy={strategy} 
          hasPremium={hasPremium} 
          onPremiumClick={onPremiumClick} 
        />
      ))}
    </section>
  );
};

export default StrategiesSection;
