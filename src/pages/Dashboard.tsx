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
  ResponsiveContainer,
  Dot,
  ReferenceLine
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

interface CustomDotProps {
  cx: number;
  cy: number;
  payload: any;
  value: number;
  index: number;
  dataKey: string;
}

const CustomizedDot = (props: CustomDotProps) => {
  const { cx, cy, stroke, payload, value, index, dataKey } = props;
  const animationDelay = index * 0.2; // Stagger animation
  const dotColor = payload.trend === "up" ? "#4CAF50" : "#F44336";
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      stroke={dotColor}
      strokeWidth={2}
      fill="#121212"
      style={{
        animation: `pulseDot 2s infinite ${animationDelay}s`
      }}
      className="animated-dot"
    />
  );
};

const generateEnhancedData = (baseData: any[]) => {
  // Create a copy to avoid mutating the original
  return baseData.map(item => ({
    ...item,
    animatedValue: item.value + (Math.random() * 20000 - 10000), // Slight random variation
  }));
};

const mockPerformanceData = [
  { date: '1/5', value: 1200000, trend: 'up' },
  { date: '2/5', value: 1300000, trend: 'up' },
  { date: '3/5', value: 1250000, trend: 'down' },
  { date: '4/5', value: 1200000, trend: 'down' },
  { date: '5/5', value: 1180000, trend: 'down' },
  { date: '6/5', value: 1230000, trend: 'up' },
  { date: '7/5', value: 1280000, trend: 'up' },
  { date: '8/5', value: 1350000, trend: 'up' },
  { date: '9/5', value: 1320000, trend: 'down' },
  { date: '10/5', value: 1380000, trend: 'up' },
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

const SegmentedLine = ({ points }: { points: any[] }) => {
  return (
    <g>
      {points.map((point, index) => {
        if (index === points.length - 1) return null;
        
        const nextPoint = points[index + 1];
        const trend = point.payload.trend;
        const color = trend === 'up' ? '#4CAF50' : '#F44336';
        
        return (
          <line
            key={`line-${index}`}
            x1={point.x}
            y1={point.y}
            x2={nextPoint.x}
            y2={nextPoint.y}
            stroke={color}
            strokeWidth={2}
            className="recharts-curve recharts-line-curve"
          />
        );
      })}
    </g>
  );
};

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  
  if (!active || !payload || !payload.length) {
    return null;
  }

  const value = payload[0].value;
  const trend = payload[0].payload.trend;
  const color = trend === 'up' ? '#4CAF50' : '#F44336';

  return (
    <div className="bg-charcoalSecondary p-2 border border-gray-800 rounded-lg shadow-lg">
      <p className="text-gray-300 mb-1">{label}</p>
      <p style={{ color }}>₹{new Intl.NumberFormat('en-IN').format(value)}</p>
    </div>
  );
};

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [animatedData, setAnimatedData] = useState(mockPerformanceData);
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimatedData(generateEnhancedData(mockPerformanceData));
      setAnimationKey(prev => prev + 1);
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
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

  const currentValue = mockPerformanceData[mockPerformanceData.length - 1].value;
  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(currentValue);

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <section id="portfolio-overview" className="mt-4">
          <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
                <p className="text-2xl font-bold text-white">{formattedValue}</p>
              </div>
              <Link 
                to="/subscription" 
                className="text-cyan bg-cyan/10 px-3 py-1.5 rounded-lg text-sm hover:bg-cyan/20 transition-colors border border-cyan/20"
              >
                Upgrade
              </Link>
            </div>
            
            <div className="h-48 my-6 relative">
              <div className="absolute inset-0 bg-cyan/5 animate-pulse rounded-lg opacity-30"></div>
              
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={animatedData} 
                  key={animationKey}
                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888" 
                    axisLine={{ strokeWidth: 1, stroke: '#444' }}
                    tickLine={{ stroke: '#444' }}
                  />
                  <YAxis 
                    stroke="#888" 
                    tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
                    axisLine={{ strokeWidth: 1, stroke: '#444' }}
                    tickLine={{ stroke: '#444' }}
                    domain={['dataMin - 50000', 'dataMax + 50000']}
                  />
                  <Tooltip 
                    formatter={(value: number) => [
                      `₹${new Intl.NumberFormat('en-IN').format(value)}`,
                      'Value'
                    ]}
                    contentStyle={{ 
                      backgroundColor: '#1F1F1F', 
                      borderColor: '#333',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{
                      color: '#CCC'
                    }}
                    itemStyle={{
                      color: '#4CAF50'
                    }}
                    animationDuration={300}
                    animationEasing="ease-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="transparent"
                    strokeWidth={2}
                    dot={<CustomizedDot />}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    activeDot={{ 
                      stroke: '#00BCD4', 
                      strokeWidth: 2, 
                      r: 6, 
                      fill: '#00BCD4',
                      className: "animate-ping-slow"
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
              
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <g className="recharts-layer recharts-line-dots">
                  {animatedData.map((entry, index) => {
                    if (index === animatedData.length - 1) return null;
                    
                    if (index === 0) return null;
                    
                    const prevEntry = animatedData[index - 1];
                    const color = entry.trend === 'up' ? '#4CAF50' : '#F44336';
                    
                    return (
                      <line
                        key={`line-${index}`}
                        className="animate-draw"
                        style={{ 
                          animation: `drawLine 1.5s ease-in-out ${index * 0.1}s forwards`,
                          strokeDasharray: "40",
                          strokeDashoffset: "40"
                        }}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
            
            <div className="flex justify-between text-sm mt-4">
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <p className="text-gray-400">Today's P&L</p>
                <p className="text-emerald-400 font-medium">+₹24,500</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
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
