
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
import { 
  Loader, 
  ChevronRight, 
  TrendingUp, 
  Lock, 
  Play, 
  Building, 
  Shield, 
  GraduationCap, 
  BarChart3, 
  Star, 
  Users,
  FileBarChart,
  Heart
} from "lucide-react";

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
      <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <section id="portfolio-overview" className="mt-4">
          <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
                <p className="text-2xl font-bold text-white">₹12,45,678</p>
              </div>
              <Link 
                to="/subscription" 
                className="text-cyan bg-cyan/10 px-3 py-1.5 rounded-lg text-sm hover:bg-cyan/20 transition-colors border border-cyan/20"
              >
                Upgrade
              </Link>
            </div>
            
            <div className="h-36 my-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Value']}
                    contentStyle={{ 
                      backgroundColor: '#1F1F1F', 
                      borderColor: '#333',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00BCD4" 
                    strokeWidth={2}
                    dot={{ stroke: '#00BCD4', strokeWidth: 2, r: 4, fill: '#121212' }}
                    activeDot={{ 
                      stroke: '#00BCD4', 
                      strokeWidth: 2, 
                      r: 6, 
                      fill: '#00BCD4'
                    }}
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

        <section className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white">Quick Access</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link to="/strategy-selection" className="block">
              <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
                <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-cyan" />
                </div>
                <span className="text-gray-200">Strategies</span>
              </div>
            </Link>
            
            <Link to="/strategy-management" className="block">
              <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
                <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
                  <Heart className="h-5 w-5 text-cyan" />
                </div>
                <span className="text-gray-200">Wishlist</span>
              </div>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link to="/backtest-report" className="block">
              <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
                <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
                  <FileBarChart className="h-5 w-5 text-cyan" />
                </div>
                <span className="text-gray-200">Backtest</span>
              </div>
            </Link>
            
            <Link to="/live-trading" className="block">
              <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
                <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
                  <Play className="h-5 w-5 text-cyan" />
                </div>
                <span className="text-gray-200">Trading</span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link to="/broker-integration" className="block">
              <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
                <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
                  <Building className="h-5 w-5 text-cyan" />
                </div>
                <span className="text-gray-200">Brokers</span>
              </div>
            </Link>
            
            <Link to="/education" className="block">
              <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
                <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
                  <GraduationCap className="h-5 w-5 text-cyan" />
                </div>
                <span className="text-gray-200">Education</span>
              </div>
            </Link>
          </div>
        </section>
        
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Your Strategies</h2>
            <Link to="/strategy-selection" className="flex items-center text-cyan text-sm">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          {mockStrategies.map((strategy) => (
            <Link 
              key={strategy.id} 
              to={`/strategy-details/${strategy.id}`} 
              className="block mb-3"
              onClick={strategy.isPremium && !hasPremium ? (e) => {
                e.preventDefault();
                handlePremiumClick();
              } : undefined}
            >
              <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 hover:border-cyan/30 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-white">{strategy.name}</h3>
                  {strategy.isPremium && !hasPremium && (
                    <span className="bg-amber-900/30 border border-amber-500/30 text-amber-500 text-xs px-2 py-1 rounded-md flex items-center">
                      <Lock className="h-3 w-3 mr-1" /> Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{strategy.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-3">
                    <div className="text-xs">
                      <div className="text-gray-500 mb-1">Success Rate</div>
                      <div className="text-cyan font-medium">N/A</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-gray-500 mb-1">Avg. Profit</div>
                      <div className="text-green-400 font-medium">N/A</div>
                    </div>
                  </div>
                  <span className="text-cyan text-xs">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
