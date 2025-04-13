
import React from 'react';
import { BookOpen, BarChart, BookText, Workflow, TrendingUp, Heart, School } from 'lucide-react';
import QuickAccessItem from './QuickAccessItem';

export const QuickAccessSection = () => {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-5">Quick Access</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <QuickAccessItem
          icon={TrendingUp}
          text="Trading"
          route="/live-trading"
        />
        
        <QuickAccessItem
          icon={BarChart}
          text="Backtest"
          route="/zenflow-backtest"
        />
        
        <QuickAccessItem
          icon={BookOpen}
          text="Education"
          route="/education"
        />
        
        <QuickAccessItem
          icon={School}
          text="Classes"
          route="/classes"
        />
        
        <QuickAccessItem
          icon={Workflow}
          text="Strategies"
          route="/strategy-selection"
        />
        
        <QuickAccessItem
          icon={Heart}
          text="Wishlist"
          route="/strategy-management"
        />
      </div>
    </section>
  );
};

export default QuickAccessSection;
