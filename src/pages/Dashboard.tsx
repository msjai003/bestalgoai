
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import QuickAccessSection from "@/components/dashboard/QuickAccessSection";
import { mockPerformanceData } from "@/components/dashboard/DashboardData";
import { syncPremiumAccess, checkUserPremiumStatus } from "@/lib/supabase/subscription";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [isSyncingPremium, setIsSyncingPremium] = useState(false);
  const currentValue = mockPerformanceData[mockPerformanceData.length - 1].value;
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log('No active session found on dashboard, redirecting to auth');
          toast({
            title: "Authentication Required",
            description: "Please log in to access the dashboard.",
            variant: "destructive",
          });
          navigate('/auth');
        } else {
          setIsVerifyingAuth(false);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setIsVerifyingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  useEffect(() => {
    if (!user) {
      return;
    }
    
    const checkPremium = async () => {
      try {
        // Check if the user has a paid Premium/Pro/Elite plan
        const isPremium = await checkUserPremiumStatus(user.id);
        setHasPremium(isPremium);
        
        console.log('Premium status check result:', isPremium);
        
        // If the user has premium, sync their access to unlock strategies
        if (isPremium && !isSyncingPremium) {
          setIsSyncingPremium(true);
          
          // Make sure to sync premium access on load
          const syncResult = await syncPremiumAccess(user.id, true);
          setIsSyncingPremium(false);
          
          if (syncResult) {
            console.log("Premium access synced successfully");
          } else {
            console.error("Failed to sync premium access");
          }
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsSyncingPremium(false);
      }
    };
    
    // Check premium status on initial load
    checkPremium();
    
    // Also set up a periodic check to ensure premium status is up to date
    const checkInterval = setInterval(checkPremium, 30000); // Check every 30 seconds
    
    return () => clearInterval(checkInterval);
  }, [user, isSyncingPremium]);

  if (isVerifyingAuth || user === null) {
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
        <PortfolioOverview 
          performanceData={mockPerformanceData} 
          currentValue={currentValue} 
        />
        <QuickAccessSection />
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
