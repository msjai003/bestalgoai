
import React from "react";
import { Link } from "react-router-dom";
import { Building, Shield } from "lucide-react";
import QuickActionButton from "./QuickActionButton";

const QuickActions: React.FC = () => {
  return (
    <section id="quick-actions" className="px-4 mt-6">
      <div className="grid grid-cols-4 gap-3">
        <Link to="/strategy-selection" className="block">
          <QuickActionButton icon="fa-chart-line" label="Strategies" />
        </Link>
        <QuickActionButton icon="fa-magnifying-glass-chart" label="Analysis" />
        <Link to="/subscription" className="block">
          <QuickActionButton icon="fa-star" label="Premium" />
        </Link>
        <Link to="/community" className="block">
          <QuickActionButton icon="fa-users" label="Community" />
        </Link>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link to="/broker-integration" className="block">
          <QuickActionButton 
            icon="fa-building" 
            label="Brokers" 
            lucideIcon={<Building className="text-[#FF00D4] h-5 w-5" />}
          />
        </Link>
        <Link to="/risk-management" className="block">
          <QuickActionButton 
            icon="fa-shield" 
            label="Risk" 
            lucideIcon={<Shield className="text-[#FF00D4] h-5 w-5" />}
          />
        </Link>
      </div>
    </section>
  );
};

export default QuickActions;
