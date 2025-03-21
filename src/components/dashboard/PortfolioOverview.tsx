
import React from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PortfolioOverviewProps {
  performanceData: Array<{
    date: string;
    value: number;
  }>;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ performanceData }) => {
  return (
    <section id="portfolio-overview" className="p-4">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 shadow-xl border border-gray-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
            <p className="text-2xl font-bold text-white">₹12,45,678</p>
          </div>
          <Link 
            to="/subscription" 
            className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-sm hover:bg-emerald-400/20"
          >
            Upgrade
          </Link>
        </div>
        
        <div className="h-36 my-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => `₹${value/100000}L`} />
              <Tooltip formatter={(value) => [`₹${value}`, 'Value']} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#FF00D4" 
                strokeWidth={2}
                dot={{ stroke: '#FF00D4', strokeWidth: 2, r: 4 }}
                activeDot={{ stroke: '#FF00D4', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between text-sm mt-4">
          <div>
            <p className="text-gray-400">Today's P&L</p>
            <p className="text-emerald-400 font-medium">+₹24,500</p>
          </div>
          <div>
            <p className="text-gray-400">Overall P&L</p>
            <p className="text-emerald-400 font-medium">+₹1,45,500</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioOverview;
