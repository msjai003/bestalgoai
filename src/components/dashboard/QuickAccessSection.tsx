
import React from "react";
import QuickAccessItem from "./QuickAccessItem";
import { 
  TrendingUp, 
  Heart, 
  FileBarChart, 
  Play, 
  Building, 
  GraduationCap
} from "lucide-react";

const QuickAccessSection = () => {
  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-white">Quick Access</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <QuickAccessItem 
          icon={TrendingUp} 
          text="Strategies" 
          route="/strategy-selection" 
        />
        <QuickAccessItem 
          icon={Heart} 
          text="Wishlist" 
          route="/strategy-management" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <QuickAccessItem 
          icon={FileBarChart} 
          text="Backtest" 
          route="/backtest-report" 
        />
        <QuickAccessItem 
          icon={Play} 
          text="Trading" 
          route="/live-trading" 
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <QuickAccessItem 
          icon={Building} 
          text="Brokers" 
          route="/broker-integration" 
        />
        <QuickAccessItem 
          icon={GraduationCap} 
          text="Education" 
          route="/education" 
        />
      </div>
    </section>
  );
};

export default QuickAccessSection;
