
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
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-[#8B5CF6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-48 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Animated glow effects */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cyan rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan rounded-full animate-pulse opacity-80" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan rounded-full animate-pulse opacity-80" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2LTJoLTF2MnptMCAydjFoMXYtMWgtMXptLTItMmgxdjFoLTF2LTF6bTIgMGgxdjFoLTF2LTF6bS0yIDJoMXYxaC0xdi0xem0yLTRoMXYxaC0xVjMwem0tMi0yaDF2MWgtMXYtMXptMiAwaDF2MWgtMXYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
      </div>

      <Header />
      <main className="relative pt-16 pb-20 z-10">
        <section id="portfolio-overview" className="p-4">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-800/60 relative overflow-hidden">
            {/* Card decorative elements */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan/5 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
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
            
            <div className="h-36 my-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 to-transparent rounded-lg"></div>
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
                      backdropFilter: 'blur(12px)',
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
                      fill: '#00BCD4',
                      className: 'animate-micro-glow'
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
                lucideIcon={<Building className="text-[#00BCD4] h-5 w-5" />}
              />
            </Link>
            <Link to="/risk-management" className="block">
              <QuickActionButton 
                icon="fa-shield" 
                label="Risk" 
                lucideIcon={<Shield className="text-[#00BCD4] h-5 w-5" />}
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
  icon, 
  label, 
  lucideIcon 
}: { 
  icon: string; 
  label: string;
  lucideIcon?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center bg-gray-800/40 backdrop-blur-md rounded-xl p-3 border border-gray-700/30 shadow-lg hover:bg-gray-800/60 transition-all hover:-translate-y-0.5 hover:shadow-cyan/5">
    <div className="mb-1 w-8 h-8 flex items-center justify-center">
      {lucideIcon || <i className={`fa-solid ${icon} text-[#00BCD4] text-xl`}></i>}
    </div>
    <span className="text-gray-300 text-xs font-medium">{label}</span>
  </div>
);

export default Dashboard;
