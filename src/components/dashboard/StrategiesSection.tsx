
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import StrategyItem from "./StrategyItem";
import { Button } from "@/components/ui/button";

interface StrategiesSectionProps {
  strategies: Array<{
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
  }>;
  hasPremium: boolean;
  onPremiumClick: () => void;
  showSignupPromo?: boolean;
}

const StrategiesSection = ({ 
  strategies, 
  hasPremium, 
  onPremiumClick, 
  showSignupPromo = false 
}: StrategiesSectionProps) => {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">Your Strategies</h2>
        <Link to="/strategy-selection" className="flex items-center text-cyan text-sm">
          See all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      {showSignupPromo && (
        <div className="bg-gradient-to-r from-cyan/20 to-cyan/10 p-4 rounded-lg mb-6 border border-cyan/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Save Your Trading Strategies</h3>
              <p className="text-sm text-gray-300">Create an account to save and manage your trading strategies</p>
            </div>
            <Link to="/auth">
              <Button 
                className="bg-cyan hover:bg-cyan/80 text-charcoalPrimary" 
                size="sm"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
      
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
