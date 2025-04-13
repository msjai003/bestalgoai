
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Plus, TrendingUp, Wallet, BarChart } from "lucide-react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import QuickAccessSection from "@/components/dashboard/QuickAccessSection";
import { mockPerformanceData } from "@/components/dashboard/DashboardData";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const currentValue = mockPerformanceData[mockPerformanceData.length - 1].value;
  
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

  const handleStartNewStrategy = () => {
    navigate('/strategy-selection');
  };

  // Dashboard metrics with improved styling
  const dashboardMetrics = [
    { title: "Daily P&L", value: "+₹12,450", change: "+2.3%", icon: <TrendingUp className="h-5 w-5 text-emerald-400" />, color: "text-emerald-400" },
    { title: "Capital Used", value: "₹3,25,000", change: "65%", icon: <Wallet className="h-5 w-5 text-cyan" />, color: "text-white" },
    { title: "Active Strategies", value: "3", change: "+1 today", icon: <BarChart className="h-5 w-5 text-cyan" />, color: "text-white" }
  ];

  return (
    <div className="main-container">
      <Header />
      <main className="page-container pb-24">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {dashboardMetrics.map((metric, index) => (
            <div key={index} className="bg-charcoalSecondary p-4 rounded-xl border border-gray-800/40 shadow-sm fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">{metric.title}</span>
                {metric.icon}
              </div>
              <p className={`${metric.color} text-lg font-semibold`}>{metric.value}</p>
              <p className="text-xs text-gray-400">{metric.change}</p>
            </div>
          ))}
        </div>
        
        <PortfolioOverview 
          performanceData={mockPerformanceData} 
          currentValue={currentValue} 
        />
        
        <div className="fixed bottom-24 right-6 z-40">
          <Button
            onClick={handleStartNewStrategy}
            variant="fab"
            aria-label="Start New Strategy"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        
        <QuickAccessSection />
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
