
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { educationData } from '@/data/educationData';

// Define and export types needed by components
export type Level = 'basics' | 'intermediate' | 'pro';

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  level: Level;
  unlocked: boolean;
}

export interface EducationItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  estimated_time: number;
  created_at: string;
}

export interface UserProgress {
  education_id: string;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  timeSpent: number;
  totalQuestions: number;
}

export const useEducation = () => {
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level>('basics');
  const [currentModule, setCurrentModule] = useState('module1');
  const [currentCard, setCurrentCard] = useState(0);
  const [completedModules, setCompletedModules] = useState({ basics: 0, intermediate: 0, pro: 0 });
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const [autoLaunchQuiz, setAutoLaunchQuiz] = useState<string | null>(null);
  const [progress, setProgress] = useState({ overall: 0, basics: 0, intermediate: 0, pro: 0 });
  const [usingRealData, setUsingRealData] = useState(false);
  const [loadingQuizData, setLoadingQuizData] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchEducationItems();
      fetchUserProgress(userId);
    }
  }, [userId]);

  const fetchEducationItems = async () => {
    setIsLoading(true);
    try {
      // Since we're using mock data instead of an actual Supabase table,
      // We'll skip the database query and use the local data instead
      // In a real app, this would be:
      // const { data, error } = await supabase.from('education').select('*');
      
      // For now, just set the mock data directly
      const mockEducationItems: EducationItem[] = [];
      setEducationItems(mockEducationItems);
      
      // Calculate the progress based on local data
      calculateProgress();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching education items",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the issue with the function that previously used 'eq'
  const fetchUserProgress = async (userId: string) => {
    try {
      // Instead of using rpc function, use local mock data
      // In a real app, this would be a query to the user_education_progress table
      return [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  };

  const markAsComplete = async (educationId: string) => {
    if (!userId) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to save progress.",
      });
      return;
    }

    try {
      // In a real app, this would be:
      // const { error } = await supabase
      //   .from('user_education_progress')
      //   .upsert({ 
      //     user_id: userId,
      //     education_id: educationId,
      //     completed: true 
      //   });
      
      toast({
        title: "Education item marked as complete!",
      });
      
      // Refresh user progress after marking as complete
      fetchUserProgress(userId);
    } catch (err: any) {
      toast({
        title: "Error marking as complete",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  // Add new functions required by components
  const selectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
  };
  
  const nextCard = () => {
    const module = educationData[currentLevel].find(m => m.id === currentModule);
    if (module && currentCard < module.flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };
  
  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };
  
  const markModuleViewed = (moduleId: string) => {
    console.log(`Module ${moduleId} marked as viewed`);
    // In a real app, this would be saved to the database
  };
  
  const getModuleStatus = (moduleId: string, index: number) => {
    const isCompleted = false; // would be determined from user progress
    const isLocked = index > completedModules[currentLevel]; // unlock sequentially
    const isActive = moduleId === currentModule;
    
    return { isCompleted, isLocked, isActive };
  };
  
  const startQuiz = () => {
    console.log('Starting quiz');
    // Logic to start a quiz
  };
  
  const submitQuizAnswer = (answer: number, timeSpent: number) => {
    console.log(`Submitted answer: ${answer}, time spent: ${timeSpent}`);
    // Logic to submit quiz answer
  };
  
  const fetchQuizData = async (moduleId: string) => {
    setLoadingQuizData(true);
    try {
      // In a real app, would fetch from Supabase
      const module = educationData[currentLevel].find(m => m.id === moduleId);
      setLoadingQuizData(false);
      return module?.quiz || [];
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setLoadingQuizData(false);
      return [];
    }
  };
  
  const calculateProgress = () => {
    // Calculate progress percentages based on completed modules
    const total = educationData.basics.length + educationData.intermediate.length + educationData.pro.length;
    const completed = completedModules.basics + completedModules.intermediate + completedModules.pro;
    
    setProgress({
      overall: Math.round((completed / total) * 100),
      basics: Math.round((completedModules.basics / educationData.basics.length) * 100),
      intermediate: Math.round((completedModules.intermediate / educationData.intermediate.length) * 100),
      pro: Math.round((completedModules.pro / educationData.pro.length) * 100)
    });
  };
  
  const getStats = () => {
    return {
      completedCount: completedModules.basics + completedModules.intermediate + completedModules.pro,
      totalModules: educationData.basics.length + educationData.intermediate.length + educationData.pro.length,
      quizzesTaken: Object.keys(quizResults).length,
      badgesEarned: earnedBadges.length,
      averageScore: calculateAverageScore()
    };
  };
  
  const calculateAverageScore = () => {
    const scores = Object.values(quizResults).map(result => result.score);
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((total, score) => total + score, 0);
    return Math.round((sum / scores.length) * 100);
  };

  return {
    educationItems,
    userProgress,
    isLoading,
    error,
    markAsComplete,
    // Add missing properties that components are expecting
    currentLevel,
    setCurrentLevel,
    currentModule,
    setCurrentModule,
    currentCard,
    nextCard,
    prevCard,
    completedModules,
    earnedBadges,
    startQuiz,
    progress,
    getStats,
    autoLaunchQuiz,
    setAutoLaunchQuiz,
    usingRealData,
    loadingQuizData,
    selectModule,
    getModuleStatus,
    moduleProgress: progress,
    quizResults,
    markModuleViewed,
    submitQuizAnswer,
    fetchQuizData
  };
};
