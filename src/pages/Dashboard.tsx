
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
import { useEducation } from "@/hooks/useEducation";
import { fetchModuleQuizData } from "@/adapters/educationAdapter";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const currentValue = mockPerformanceData[mockPerformanceData.length - 1].value;
  const { currentLevel, currentModule } = useEducation();
  const [quizData, setQuizData] = useState<any>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  
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
      
      // Fetch quiz data for the current module
      const loadQuizData = async () => {
        setIsLoadingQuiz(true);
        try {
          const data = await fetchModuleQuizData(currentModule);
          setQuizData(data);
        } catch (error) {
          console.error("Error fetching quiz data:", error);
        } finally {
          setIsLoadingQuiz(false);
        }
      };
      
      loadQuizData();
    }
  }, [user, navigate, toast, currentModule]);

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
        
        {/* Education Section */}
        <div className="my-6 bg-charcoalSecondary rounded-xl border border-gray-800/40 p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Current Learning Progress</h2>
          <div className="flex justify-between mb-3">
            <p className="text-sm text-gray-300">
              Current Level: <span className="text-cyan">{currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}</span>
            </p>
            <p className="text-sm text-gray-300">
              Module: <span className="text-cyan">{currentModule}</span>
            </p>
          </div>
          
          {isLoadingQuiz ? (
            <div className="text-center py-4">
              <Loader className="h-5 w-5 animate-spin text-cyan mx-auto mb-2" />
              <p className="text-xs text-gray-300">Loading quiz data...</p>
            </div>
          ) : quizData && quizData.questions && quizData.questions.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-white">Quiz Questions from Database:</p>
              <div className="bg-charcoalPrimary/60 rounded-lg p-3 space-y-2">
                <p className="text-xs text-gray-300">{quizData.questions.length} questions available</p>
                <p className="text-xs text-cyan">Sample: "{quizData.questions[0].question}"</p>
              </div>
              <div className="flex justify-end">
                <button 
                  className="text-xs px-3 py-1 bg-cyan text-charcoalPrimary rounded hover:bg-cyan/90 transition-colors"
                  onClick={() => navigate('/education')}
                >
                  Continue Learning
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-charcoalPrimary/60 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-300">No quiz questions found in database for this module.</p>
              <button 
                className="text-xs px-3 py-1 mt-2 bg-cyan text-charcoalPrimary rounded hover:bg-cyan/90 transition-colors"
                onClick={() => navigate('/education')}
              >
                View Education Section
              </button>
            </div>
          )}
        </div>
        
        <QuickAccessSection />
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
