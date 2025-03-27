
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
  Users
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-[#00BCD4] mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="relative pt-16 pb-20 z-10">
        <section id="portfolio-overview" className="p-4">
          <div className="bg-charcoalSecondary rounded-2xl p-6 shadow-lg border border-gray-800/60">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
                <p className="text-2xl font-bold text-white">₹12,45,678</p>
              </div>
              <Link 
                to="/subscription" 
                className="text-[#00BCD4] bg-[#00BCD4]/10 px-3 py-1.5 rounded-lg text-sm hover:bg-[#00BCD4]/20 transition-colors border border-[#00BCD4]/20"
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
                      backgroundColor: 'rgba(17, 17, 17, 0.8)', 
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

        <section id="quick-actions" className="px-4 mt-6">
          <h2 className="text-lg font-bold text-white mb-3">Quick Access</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link to="/strategy-selection" className="block">
              <QuickActionButton 
                label="Strategies" 
                icon={<TrendingUp className="h-6 w-6 text-[#00BCD4]" />}
              />
            </Link>
            <Link to="/education" className="block">
              <QuickActionButton 
                label="Levels" 
                icon={<GraduationCap className="h-6 w-6 text-[#00BCD4]" />}
              />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <QuickActionButton 
              label="Analysis" 
              icon={<BarChart3 className="h-6 w-6 text-[#00BCD4]" />}
            />
            <Link to="/subscription" className="block">
              <QuickActionButton 
                label="Premium" 
                icon={<Star className="h-6 w-6 text-[#00BCD4]" />}
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link to="/community" className="block">
              <QuickActionButton 
                label="Community" 
                icon={<Users className="h-6 w-6 text-[#00BCD4]" />}
              />
            </Link>
            <Link to="/broker-integration" className="block">
              <QuickActionButton 
                label="Brokers" 
                icon={<Building className="h-6 w-6 text-[#00BCD4]" />}
              />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Link to="/risk-management" className="block">
              <QuickActionButton 
                label="Risk Management" 
                icon={<Shield className="h-6 w-6 text-[#00BCD4]" />}
                fullWidth
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
  icon,
  fullWidth = false
}: { 
  label: string;
  icon: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <div className={`flex items-center bg-charcoalSecondary rounded-xl p-4 border border-gray-700/30 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-cyan/5 hover:border-cyan/20 ${fullWidth ? 'py-4' : ''}`}>
    <div className="mr-3 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-gray-200 font-medium">{label}</span>
  </div>
);

export default Dashboard;
