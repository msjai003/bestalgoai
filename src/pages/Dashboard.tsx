
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
import StrategiesSection from "@/components/dashboard/StrategiesSection";
import { mockPerformanceData } from "@/components/dashboard/DashboardData";
import { syncPremiumAccess, checkUserPremiumStatus } from "@/lib/supabase/subscription";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [isSyncingPremium, setIsSyncingPremium] = useState(false);
  const [dashboardStrategies, setDashboardStrategies] = useState<any[]>([]);
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
          
          // Fetch some predefined strategies for dashboard display
          const { data: predefinedData, error } = await supabase
            .from('predefined_strategies')
            .select('*')
            .order('id', { ascending: true })
            .limit(3);
            
          if (!error && predefinedData) {
            // Process strategies to identify premium ones using the package field
            const processedStrategies = predefinedData.map(strategy => {
              // Ensure ID is a number for comparison
              const strategyIdNumber = typeof strategy.id === 'string' ? parseInt(strategy.id, 10) : Number(strategy.id);
              
              // Check if strategy is premium based on package field
              const isPremium = strategy.package === 'premium';
              
              console.log(`Dashboard strategy ${strategyIdNumber}: ${strategy.name}, isPremium: ${isPremium}, package: ${strategy.package}`);
              
              return {
                id: strategyIdNumber,
                name: strategy.name,
                description: strategy.description,
                isPremium: isPremium,
                package: strategy.package
              };
            });
            setDashboardStrategies(processedStrategies);
          }
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
        // Using the checkUserPremiumStatus function to check premium status
        // This will check if the user has a paid Premium/Pro/Elite plan
        const isPremium = await checkUserPremiumStatus(user.id);
        setHasPremium(isPremium);
        
        console.log('Premium status check result:', isPremium);
        
        // If the user has premium, sync their access to unlock strategies
        if (isPremium && !isSyncingPremium) {
          setIsSyncingPremium(true);
          const syncResult = await syncPremiumAccess(user.id, true);
          setIsSyncingPremium(false);
          
          if (syncResult) {
            console.log("Premium access synced successfully");
          }
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    
    checkPremium();
  }, [user, isSyncingPremium]);

  const handlePremiumClick = () => {
    navigate('/pricing');
  };

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
        
        {dashboardStrategies.length > 0 && (
          <StrategiesSection
            strategies={dashboardStrategies}
            hasPremium={hasPremium}
            onPremiumClick={handlePremiumClick}
            showSignupPromo={!user}
          />
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
