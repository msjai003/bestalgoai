
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Link } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, TrendingUp, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data since database connection is removed
const mockPerformanceData = [
  { date: '1/5', value: 1200000 },
  { date: '2/5', value: 1250000 },
  { date: '3/5', value: 1245000 },
  { date: '4/5', value: 1275000 },
  { date: '5/5', value: 1245678 },
];

const mockStrategies = [
  { 
    id: '1', 
    name: 'Moving Average Crossover', 
    description: 'A trend-following strategy based on the crossover of two moving averages'
  },
  { 
    id: '2', 
    name: 'RSI Reversal', 
    description: 'Identifies potential market reversals using the Relative Strength Index'
  },
  { 
    id: '3', 
    name: 'Bollinger Band Squeeze', 
    description: 'Capitalizes on breakouts when volatility increases after a period of contraction'
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is logged in, if not redirect to auth page
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  // If still checking authentication, show loading
  if (user === null) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-[#FF00D4] mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20">
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
                <LineChart data={mockPerformanceData}>
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

        <section id="quick-actions" className="px-4 mt-6">
          <div className="grid grid-cols-5 gap-3">
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
            <Link to="/broker-integration" className="block">
              <QuickActionButton icon="fa-building-columns" label="Brokers" />
            </Link>
          </div>
        </section>
        
        <section id="recent-strategies" className="p-4 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Strategies</h3>
            <Link to="/strategy-selection" className="text-[#FF00D4] text-sm flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {mockStrategies.map((strategy) => (
              <div key={strategy.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{strategy.name}</h4>
                  <div className="flex items-center text-emerald-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12.4%</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
                <Link 
                  to={`/strategy-details/${strategy.id}`}
                  className="text-[#FF00D4] text-sm hover:underline"
                >
                  View details
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

const QuickActionButton = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex flex-col items-center bg-gray-800/30 rounded-xl p-3">
    <i className={`fa-solid ${icon} text-[#FF00D4] text-xl mb-2`}></i>
    <span className="text-gray-300 text-xs">{label}</span>
  </div>
);

export default Dashboard;
