
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Link } from "react-router-dom";
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, TrendingUp, TrendingDown, Loader } from 'lucide-react';

const Dashboard = () => {
  const [portfolioValue, setPortfolioValue] = useState("₹12,45,678");
  const [todaysPnL, setTodaysPnL] = useState("+₹24,500");
  const [overallPnL, setOverallPnL] = useState("+₹1,45,500");
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [performanceData, setPerformanceData] = useState([
    { date: '1/5', value: 1200000 },
    { date: '2/5', value: 1250000 },
    { date: '3/5', value: 1245000 },
    { date: '4/5', value: 1275000 },
    { date: '5/5', value: 1245678 },
  ]);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setIsLoading(true);
        
        // Fetch some strategies to display
        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .limit(3);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setStrategies(data);
          toast({
            title: "Connected to database",
            description: "Successfully fetched data from Supabase",
          });
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
        toast({
          title: "Database Error",
          description: "Could not fetch strategies. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategies();
  }, [toast]);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20">
        <section id="portfolio-overview" className="p-4">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 shadow-xl border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
                <p className="text-2xl font-bold text-white">{portfolioValue}</p>
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
                <p className="text-emerald-400 font-medium">{todaysPnL}</p>
              </div>
              <div>
                <p className="text-gray-400">Overall P&L</p>
                <p className="text-emerald-400 font-medium">{overallPnL}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="quick-actions" className="px-4 mt-6">
          <div className="grid grid-cols-4 gap-4">
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
        </section>
        
        <section id="recent-strategies" className="p-4 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Strategies</h3>
            <Link to="/strategy-selection" className="text-[#FF00D4] text-sm flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="h-6 w-6 text-[#FF00D4] animate-spin" />
              <span className="ml-2 text-gray-400">Loading strategies...</span>
            </div>
          ) : strategies.length > 0 ? (
            <div className="space-y-3">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{strategy.name}</h4>
                    <div className="flex items-center text-emerald-400 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+12.4%</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{strategy.description || "No description available"}</p>
                  <Link 
                    to={`/strategy-details/${strategy.id}`}
                    className="text-[#FF00D4] text-sm hover:underline"
                  >
                    View details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 text-center">
              <p className="text-gray-400 mb-4">No strategies found</p>
              <Link 
                to="/strategy-selection"
                className="bg-[#FF00D4]/20 text-[#FF00D4] px-4 py-2 rounded-lg hover:bg-[#FF00D4]/30"
              >
                Explore Strategies
              </Link>
            </div>
          )}
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
