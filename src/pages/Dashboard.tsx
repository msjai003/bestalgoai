
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
import { Loader, ChevronRight, TrendingUp, Lock, Play, Building, Shield } from "lucide-react";

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
          <Loader className="h-8 w-8 animate-spin text-[#00BCD4] mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-charcoalPrimary to-charcoalSecondary min-h-screen">
      <Header />
      <main className="pt-16 pb-20">
        <section id="portfolio-overview" className="p-4">
          <div className="glass-card p-6 shadow-xl border border-cyan/30 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan/5 rounded-full blur-xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-cyan/10 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h2 className="text-gray-400 text-sm font-medium">Portfolio Value</h2>
                <p className="text-3xl font-bold text-white cyan-gradient-text">₹12,45,678</p>
              </div>
              <Link 
                to="/subscription" 
                className="bg-gradient-to-r from-cyan/20 to-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 rounded-lg text-sm hover:bg-cyan/20 transition-all duration-300 shadow-md shadow-cyan/10 font-medium"
              >
                Upgrade
              </Link>
            </div>
            
            <div className="h-48 my-4 cyan-frame backdrop-blur-sm">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Value']} 
                    contentStyle={{
                      backgroundColor: 'rgba(31, 31, 31, 0.8)',
                      borderColor: 'rgba(0, 188, 212, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00BCD4" 
                    strokeWidth={2}
                    dot={{ stroke: '#00BCD4', strokeWidth: 2, r: 4, fill: '#1F1F1F' }}
                    activeDot={{ 
                      stroke: '#00BCD4', 
                      strokeWidth: 2, 
                      r: 6, 
                      fill: '#1F1F1F',
                      className: 'animate-pulse-slow'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-sm mt-6 pt-3 border-t border-gray-800">
              <div>
                <p className="text-gray-400 mb-1">Today's P&L</p>
                <p className="text-emerald-400 font-medium text-lg flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +₹24,500
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Overall P&L</p>
                <p className="text-emerald-400 font-medium text-lg">+₹1,45,500</p>
              </div>
            </div>
          </div>
        </section>

        <section id="quick-actions" className="px-4 mt-6">
          <h3 className="text-lg font-medium text-white mb-3 ml-1">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            <Link to="/strategy-selection" className="block">
              <QuickActionButton 
                label="Strategies" 
                lucideIcon={<i className="fa-solid fa-chart-line text-cyan text-xl"></i>}
                customClass="bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:scale-105"
              />
            </Link>
            <QuickActionButton 
              label="Analysis" 
              lucideIcon={<i className="fa-solid fa-magnifying-glass-chart text-cyan text-xl"></i>}
              customClass="bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:scale-105"
            />
            <Link to="/subscription" className="block">
              <QuickActionButton 
                label="Premium" 
                lucideIcon={<i className="fa-solid fa-star text-cyan text-xl"></i>}
                customClass="bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:scale-105"
              />
            </Link>
            <Link to="/community" className="block">
              <QuickActionButton 
                label="Community" 
                lucideIcon={<i className="fa-solid fa-users text-cyan text-xl"></i>}
                customClass="bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:scale-105"
              />
            </Link>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link to="/broker-integration" className="block">
              <QuickActionButton 
                label="Brokers" 
                lucideIcon={<Building className="text-cyan h-5 w-5" />}
                customClass="bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:scale-105"
              />
            </Link>
            <Link to="/risk-management" className="block">
              <QuickActionButton 
                label="Risk" 
                lucideIcon={<Shield className="text-cyan h-5 w-5" />}
                customClass="bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:scale-105"
              />
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

const QuickActionButton = ({ 
  label, 
  lucideIcon,
  customClass
}: { 
  label: string;
  lucideIcon: React.ReactNode;
  customClass?: string;
}) => (
  <div className={`flex flex-col items-center justify-center rounded-xl p-3 border border-gray-700/50 transition-all duration-300 shadow-lg ${customClass || ''}`}>
    <div className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner cyan-outline">
      {lucideIcon}
    </div>
    <span className="text-gray-300 font-medium">{label}</span>
  </div>
);

export default Dashboard;
