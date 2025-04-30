
import React from 'react';
import { BookOpen, BarChart, BookText, Workflow, TrendingUp, Heart, School, Briefcase } from 'lucide-react';
import QuickAccessItem from './QuickAccessItem';
import { useNavigate } from 'react-router-dom';

export const QuickAccessSection = () => {
  const navigate = useNavigate();

  // Handler to navigate to orders page
  const handleNavigateToOrders = () => {
    navigate('/orders');
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <QuickAccessItem
          icon={TrendingUp}
          text="Trading"
          route="/live-trading"
          className=""
        />
        
        <QuickAccessItem
          icon={BarChart}
          text="Backtest"
          route="/zenflow-backtest"
          className=""
        />
        
        <QuickAccessItem
          icon={BookOpen}
          text="Education"
          route="/education"
          className=""
        />
        
        <QuickAccessItem
          icon={School}
          text="Classes"
          route="/classes"
          className=""
        />
        
        <QuickAccessItem
          icon={Workflow}
          text="Strategies"
          route="/strategy-selection"
          className=""
        />
        
        <QuickAccessItem
          icon={Heart}
          text="Wishlist"
          route="/strategy-management"
          className=""
        />
        
        <QuickAccessItem
          icon={BookText}
          text="Brokers"
          route="/broker-integration"
          className=""
        />
        
        <QuickAccessItem
          icon={Briefcase}
          text="Results"
          route="/orders"
          onClick={handleNavigateToOrders}
          className=""
        />
      </div>
    </section>
  );
};

export default QuickAccessSection;
