
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { mockPerformanceData } from "@/data/mockData";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasPremium } = usePremiumStatus();
  
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

  if (user === null) {
    return <DashboardLoading />;
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20">
        <PortfolioOverview performanceData={mockPerformanceData} />
        <QuickActions />
        {/* Recent Strategies section removed as requested */}
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
