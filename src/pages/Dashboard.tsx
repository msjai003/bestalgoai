
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
import GoogleUserWelcome from "@/components/dashboard/GoogleUserWelcome"; 
import { mockPerformanceData } from "@/components/dashboard/DashboardData";

const Dashboard = () => {
  const { toast } = useToast();
  const { user, googleUserDetails, fetchGoogleUserDetails } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const currentValue = mockPerformanceData[mockPerformanceData.length - 1].value;
  
  useEffect(() => {
    if (!user) {
      // Check if we have a session but user state is not set yet
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access the dashboard.",
            variant: "destructive",
          });
          navigate('/auth');
        }
      };
      
      checkSession();
      return;
    }
    
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // If user is logged in with Google, try to fetch their details
        if (user && !googleUserDetails && fetchGoogleUserDetails) {
          await fetchGoogleUserDetails();
        }
        
        // Check premium status
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
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, navigate, toast, googleUserDetails, fetchGoogleUserDetails]);

  if (isLoading) {
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
        <GoogleUserWelcome />
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
