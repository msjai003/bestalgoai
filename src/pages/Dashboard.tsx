
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
  const { user, fetchGoogleUserDetails } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const currentValue = mockPerformanceData[mockPerformanceData.length - 1].value;
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking session on dashboard...');
        
        // First check local auth state
        if (user) {
          console.log('User already in state, can proceed with dashboard:', user.id);
          setIsVerifyingAuth(false);
          setSessionChecked(true);
          return;
        }
        
        // Get session explicitly from both storage and Supabase
        const storedSession = localStorage.getItem('supabase.auth.token');
        console.log('Stored session exists:', !!storedSession);
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session on dashboard:', sessionError);
          toast.error('Session verification failed');
          
          // Ensure we're completely logged out before redirecting
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.error('Error during signout:', e);
          }
          
          // Clear any stored tokens
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.removeItem('supabase.auth.token');
          
          window.location.href = '/auth';
          return;
        }
        
        if (sessionData?.session) {
          console.log('Active session found on dashboard for user:', sessionData.session.user.id);
          console.log('Provider:', sessionData.session.user.app_metadata?.provider);
          
          // Reinforce session storage for added reliability
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + sessionData.session.expires_in
          }));
          
          // Force set the session in the client for consistency
          try {
            await supabase.auth.setSession({
              access_token: sessionData.session.access_token,
              refresh_token: sessionData.session.refresh_token
            });
          } catch (e) {
            console.error('Error setting session:', e);
          }
          
          // If this is a Google user, make sure we fetch their details
          if (sessionData.session.user.app_metadata?.provider === 'google') {
            console.log('Google user detected, fetching user details');
            try {
              await fetchGoogleUserDetails();
            } catch (error) {
              console.error('Error fetching Google user details:', error);
            }
          }
          
          setIsVerifyingAuth(false);
          setSessionChecked(true);
        } else {
          console.log('No active session found on dashboard, redirecting to auth');
          toast({
            title: "Authentication Required",
            description: "Please log in to access the dashboard.",
            variant: "destructive",
          });
          window.location.href = '/auth';
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setIsVerifyingAuth(false);
        window.location.href = '/auth';
      }
    };
    
    checkAuth();
  }, [fetchGoogleUserDetails, user, toast]);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in Dashboard:', event);
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        console.log('New sign-in detected in Dashboard');
        setSessionChecked(true);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  useEffect(() => {
    if (!user || !sessionChecked) {
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
      }
    };
    
    checkPremium();
  }, [user, sessionChecked]);

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
