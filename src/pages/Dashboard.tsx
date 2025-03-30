
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
  ArrowUpRight
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
      <div className="min-h-screen flex items-center justify-center bg-charcoalPrimary">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-charcoalPrimary">
      <Header />
      <main className="relative pt-16 pb-20 z-10 px-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user.user_metadata?.name || 'Trader'}</h1>
          <p className="text-gray-400">Manage your strategies and track your portfolio performance</p>
        </section>
        
        {/* Portfolio Overview Card */}
        <section id="portfolio-overview" className="mb-6">
          <Card className="premium-card overflow-hidden border-cyan/20">
            <div className="flex justify-between items-center p-6 pb-0">
              <div>
                <h2 className="text-gray-400 text-sm uppercase tracking-wider font-medium">Portfolio Value</h2>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white mt-1 font-mono">₹12,45,678</p>
                  <span className="text-emerald-400 text-sm flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />2.3%
                  </span>
                </div>
              </div>
              <Link 
                to="/subscription" 
                className="text-cyan bg-cyan/10 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan/20 transition-colors border border-cyan/20 flex items-center"
              >
                <Star className="w-4 h-4 mr-2" /> Upgrade
              </Link>
            </div>
            
            <div className="h-48 my-4 px-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="date" stroke="#888" axisLine={false} />
                  <YAxis 
                    stroke="#888" 
                    tickFormatter={(value) => `₹${value/100000}L`} 
                    axisLine={false}
                    tickLine={false}
                  />
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
            
            <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-charcoalPrimary/30 border-t border-white/5">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Today's P&L</p>
                <p className="text-emerald-400 font-mono font-medium text-xl">+₹24,500</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Overall P&L</p>
                <p className="text-emerald-400 font-mono font-medium text-xl">+₹1,45,500</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Access Section */}
        <section id="quick-actions" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Quick Access</h2>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* First row */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link to="/strategy-selection" className="block">
              <QuickActionButton 
                label="Strategies" 
                icon={<TrendingUp className="h-5 w-5 text-cyan" />}
              />
            </Link>
            <Link to="/community" className="block">
              <QuickActionButton 
                label="Community" 
                icon={<Users className="h-5 w-5 text-cyan" />}
              />
            </Link>
          </div>
          
          {/* Second row */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link to="/backtest-report" className="block">
              <QuickActionButton 
                label="Backtest" 
                icon={<FileBarChart className="h-5 w-5 text-cyan" />}
              />
            </Link>
            <Link to="/subscription" className="block">
              <QuickActionButton 
                label="Premium" 
                icon={<Star className="h-5 w-5 text-cyan" />}
              />
            </Link>
          </div>

          {/* Third row */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/broker-integration" className="block">
              <QuickActionButton 
                label="Brokers" 
                icon={<Building className="h-5 w-5 text-cyan" />}
              />
            </Link>
            <Link to="/risk-management" className="block">
              <QuickActionButton 
                label="Risk Management" 
                icon={<Shield className="h-5 w-5 text-cyan" />}
              />
            </Link>
          </div>
        </section>
        
        {/* Education Section */}
        <section id="education" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Education</h2>
            <Link to="/learn">
              <Button variant="outline" size="sm" className="text-cyan border-cyan/20 hover:bg-cyan/10">
                View All
              </Button>
            </Link>
          </div>
          
          <Card className="premium-card overflow-hidden border-cyan/20">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Trading Fundamentals</h3>
                  <p className="text-gray-400 text-sm">Continue where you left off</p>
                </div>
                <div className="p-2 rounded-full bg-cyan/10">
                  <GraduationCap className="h-6 w-6 text-cyan" />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">Module Progress</p>
                  <p className="text-gray-400 text-sm">3/7 completed</p>
                </div>
                <div className="h-2 bg-charcoalSecondary rounded-full overflow-hidden">
                  <div className="h-full bg-cyan rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              <Button className="w-full mt-4">
                Continue Learning
              </Button>
            </div>
          </Card>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

const QuickActionButton = ({ 
  label, 
  icon,
}: { 
  label: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center h-full bg-charcoalSecondary rounded-xl p-4 border border-gray-700/40 shadow-md transition-all hover:bg-charcoalSecondary/80 hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5">
    <div className="mr-3 flex items-center justify-center bg-charcoalPrimary/50 p-2.5 rounded-lg">
      {icon}
    </div>
    <span className="text-gray-200 font-medium">{label}</span>
  </div>
);

export default Dashboard;
