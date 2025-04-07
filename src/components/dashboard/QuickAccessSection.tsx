
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart, BookText, Workflow, TrendingUp, Heart, School } from 'lucide-react';
import QuickAccessItem from './QuickAccessItem';

const QuickAccessSection = () => {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <QuickAccessItem
          icon={<TrendingUp className="h-5 w-5 text-cyan" />}
          title="Trading"
          description="View live trading strategies"
          linkTo="/live-trading"
        />
        
        <QuickAccessItem
          icon={<BarChart className="h-5 w-5 text-cyan" />}
          title="Backtest"
          description="Analyze strategy performance"
          linkTo="/zenflow-backtest"
        />
        
        <QuickAccessItem
          icon={<BookOpen className="h-5 w-5 text-cyan" />}
          title="Education"
          description="Learn trading concepts"
          linkTo="/education"
        />
        
        <QuickAccessItem
          icon={<School className="h-5 w-5 text-cyan" />}
          title="Classes"
          description="Trading masterclasses"
          linkTo="/education"
        />
        
        <QuickAccessItem
          icon={<Workflow className="h-5 w-5 text-cyan" />}
          title="Strategies"
          description="Browse trading strategies"
          linkTo="/strategy-selection"
        />
        
        <QuickAccessItem
          icon={<Heart className="h-5 w-5 text-cyan" />}
          title="Wishlist"
          description="Saved strategies"
          linkTo="/strategy-management"
        />
        
        <QuickAccessItem
          icon={<BookText className="h-5 w-5 text-cyan" />}
          title="Brokers"
          description="Manage broker connections"
          linkTo="/broker-integration"
        />
      </div>
    </section>
  );
};

export default QuickAccessSection;
