
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

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [hasWelcomed, setHasWelcomed] = useState<boolean>(false);
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
      
      // Get welcome message for newly registered users
      const checkRegistrationTime = async () => {
        if (hasWelcomed) return;
        
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData && sessionData.session) {
            const creationTime = new Date(sessionData.session.user.created_at);
            const now = new Date();
            const minutesSinceCreation = (now.getTime() - creationTime.getTime()) / (1000 * 60);
            
            // Show welcome toast only if: 
            // 1. Account was created in the last 5 minutes
            // 2. Welcome message hasn't been shown before (checked via localStorage)
            const hasShownWelcome = localStorage.getItem('welcomeShown');
            
            if (minutesSinceCreation < 5 && !hasShownWelcome) {
              toast({
                title: "Welcome to BestAlgo.ai!",
                description: "Your account has been created successfully. Check your email for a welcome message.",
                duration: 6000,
              });
              // Mark welcome message as shown
              localStorage.setItem('welcomeShown', 'true');
              setHasWelcomed(true);
            }
          }
        } catch (error) {
          console.error('Error checking user registration time:', error);
        }
      };
      
      checkPremium();
      checkRegistrationTime();
    }
  }, [user, navigate, toast, hasWelcomed]);

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
