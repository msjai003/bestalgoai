import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Loader, ChevronRight, TrendingUp, Lock, Play, Building, Shield, Percent } from "lucide-react";

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
    description: 'A trend-following strategy based on the crossover of two moving averages',
    isPremium: false
  },
  { 
    id: '2', 
    name: 'RSI Reversal', 
    description: 'Identifies potential market reversals using the Relative Strength Index',
    isPremium: true
  },
  { 
    id: '3', 
    name: 'Bollinger Band Squeeze', 
    description: 'Capitalizes on breakouts when volatility increases after a period of contraction',
    isPremium: true
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      navigate('/auth');
    } else {
      const checkPremium = async () => {
        try {
          const { data, error } = await supabase
            .from('plan_details')
            .select('*')
            .eq('user_id', user.id)
            .order('selected_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (data && (data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
            setHasPremium(true);
          }
        } catch (error) {
          console.error('Error checking premium status:', error);
        }
      };
      checkPremium();
    }
  }, [user, navigate, toast]);

  const handlePremiumClick = () => {
    if (!hasPremium) {
      toast({
        title: "Premium Feature",
        description: "Please upgrade to access premium strategies",
      });
      navigate('/pricing');
    }
  };

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
          
          <div className="mt-3 grid grid-cols-3 gap-3">
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
                label="Risk Management" 
                lucideIcon={<Shield className="text-[#FF00D4] h-5 w-5" />}
              />
            </Link>
            <Link to="/offers" className="block">
              <QuickActionButton 
                icon="fa-percent" 
                label="Offers" 
                lucideIcon={<Percent className="text-[#FF00D4] h-5 w-5" />}
              />
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
                
                {(!strategy.isPremium || hasPremium) ? (
                  <>
                    <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
                    <Link 
                      to={`/strategy-details/${strategy.id}`}
                      className="text-[#FF00D4] text-sm hover:underline"
                    >
                      View details
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm mb-3">This premium strategy requires a subscription.</p>
                    <div className="flex justify-between items-center">
                      <div 
                        onClick={handlePremiumClick}
                        className="text-[#FF00D4] text-sm cursor-pointer hover:underline flex items-center"
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Unlock with premium
                      </div>
                      {hasPremium && (
                        <Link 
                          to={`/strategy-details/${strategy.id}`}
                          className="text-green-400 text-sm hover:underline flex items-center"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Access strategy
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

const QuickActionButton = ({ 
  icon, 
  label, 
  lucideIcon 
}: { 
  icon: string; 
  label: string;
  lucideIcon?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center bg-gray-800/30 rounded-xl p-3">
    {lucideIcon || <i className={`fa-solid ${icon} text-[#FF00D4] text-xl mb-2`}></i>}
    <span className="text-gray-300 text-xs">{label}</span>
  </div>
);

export default Dashboard;
