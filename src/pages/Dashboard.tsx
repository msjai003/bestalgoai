
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
import { getGoogleDisplayName } from "@/utils/googleAuthUtils";

const Dashboard = () => {
  const { toast } = useToast();
  const { user, googleUserDetails, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentValue = mockPerformanceData[mockPerformanceData.length - 1].value;
  
  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
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
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPremium();
    
    // Welcome message for Google users
    if (googleUserDetails) {
      const displayName = getGoogleDisplayName(googleUserDetails);
      toast({
        title: `Welcome, ${displayName}!`,
        description: "You've successfully signed in with Google.",
      });
    }
  }, [user, navigate, toast, authLoading, googleUserDetails]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        {googleUserDetails && (
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan/10 to-purple-500/10 rounded-xl">
            <h2 className="text-xl font-semibold text-white">
              Welcome, {getGoogleDisplayName(googleUserDetails)}
            </h2>
            <p className="text-gray-300">
              You're signed in with Google. Let's start trading!
            </p>
          </div>
        )}
        
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
