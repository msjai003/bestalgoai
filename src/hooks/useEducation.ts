
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { educationData } from '@/data/educationData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type Level = 'basics' | 'intermediate' | 'pro';
export type ModuleProgress = { [key: string]: boolean };
export type CompletedModules = { basics: number; intermediate: number; pro: number };
export type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  level: Level;
  unlocked: boolean;
};

type ModuleViews = {
  [key: string]: boolean;
};

type QuizResults = {
  [key: string]: {
    completed: boolean;
    passed: boolean;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    completedAt: string;
  };
};

export const useEducation = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const [currentLevel, setCurrentLevel] = useState<Level>(() => {
    const savedLevel = localStorage.getItem('education_currentLevel');
    return (savedLevel as Level) || 'basics';
  });
  
  const [currentModule, setCurrentModule] = useState<string>(() => {
    const savedModule = localStorage.getItem('education_currentModule');
    return savedModule || 'module1';
  });
  
  const [currentCard, setCurrentCard] = useState<number>(() => {
    const savedCard = localStorage.getItem(`education_card_${currentModule}`);
    return savedCard ? parseInt(savedCard, 10) : 0;
  });
  
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(() => {
    const savedProgress = localStorage.getItem('education_moduleProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });
  
  const [moduleViews, setModuleViews] = useState<ModuleViews>(() => {
    const savedViews = localStorage.getItem('education_moduleViews');
    return savedViews ? JSON.parse(savedViews) : {};
  });
  
  const [quizResults, setQuizResults] = useState<QuizResults>(() => {
    const savedResults = localStorage.getItem('education_quizResults');
    return savedResults ? JSON.parse(savedResults) : {};
  });
  
  const [badges, setBadges] = useState<Badge[]>(() => {
    const savedBadges = localStorage.getItem('education_badges');
    
    if (savedBadges) {
      return JSON.parse(savedBadges);
    }
    
    // Initialize badges
    return [
      {
        id: 'basics-starter',
        name: 'Trading Novice',
        description: 'Completed first basic module',
        image: '🏆',
        level: 'basics',
        unlocked: false
      },
      {
        id: 'basics-half',
        name: 'Trading Enthusiast',
        description: 'Completed 50% of basics',
        image: '🥈',
        level: 'basics',
        unlocked: false
      },
      {
        id: 'basics-complete',
        name: 'Trading Graduate',
        description: 'Completed all basic modules',
        image: '🎓',
        level: 'basics',
        unlocked: false
      },
      {
        id: 'intermediate-starter',
        name: 'Market Analyst',
        description: 'Completed first intermediate module',
        image: '📊',
        level: 'intermediate',
        unlocked: false
      },
      {
        id: 'intermediate-half',
        name: 'Technical Trader',
        description: 'Completed 50% of intermediate',
        image: '📈',
        level: 'intermediate',
        unlocked: false
      },
      {
        id: 'intermediate-complete',
        name: 'Trading Strategist',
        description: 'Completed all intermediate modules',
        image: '🏅',
        level: 'intermediate',
        unlocked: false
      },
      {
        id: 'pro-starter',
        name: 'Algo Initiate',
        description: 'Completed first pro module',
        image: '🤖',
        level: 'pro',
        unlocked: false
      },
      {
        id: 'pro-half',
        name: 'Quant Developer',
        description: 'Completed 50% of pro',
        image: '💻',
        level: 'pro',
        unlocked: false
      },
      {
        id: 'pro-complete',
        name: 'Algo Trading Master',
        description: 'Completed all pro modules',
        image: '👑',
        level: 'pro',
        unlocked: false
      },
    ];
  });
  
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [autoLaunchQuiz, setAutoLaunchQuiz] = useState<string | null>(null);
  
  const [completedModules, setCompletedModules] = useState<CompletedModules>(() => {
    const savedCompleted = localStorage.getItem('education_completedModules');
    return savedCompleted ? JSON.parse(savedCompleted) : {
      basics: 0,
      intermediate: 0,
      pro: 0
    };
  });
  
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Calculate overall progress
  const progress = {
    overall: Math.round(((completedModules.basics + completedModules.intermediate + completedModules.pro) / 45) * 100),
    basics: Math.round((completedModules.basics / 15) * 100),
    intermediate: Math.round((completedModules.intermediate / 15) * 100),
    pro: Math.round((completedModules.pro / 15) * 100)
  };

  // Filter earned badges
  const earnedBadges = badges.filter(badge => badge.unlocked);
  
  // Fetch user data from Supabase when authenticated
  useEffect(() => {
    const fetchUserEducationData = async () => {
      if (!isAuthenticated) return;
      
      setIsLoadingData(true);
      try {
        // Fetch user education progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_education_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (progressError && progressError.code !== 'PGRST116') {
          console.error('Error fetching user education progress:', progressError);
        }
        
        if (progressData) {
          // Update local state with database values
          setCurrentLevel(progressData.current_level as Level);
          setCurrentModule(progressData.current_module);
          setCurrentCard(progressData.current_card);
        } else if (isAuthenticated) {
          // Create new progress record for authenticated user
          const { error: insertError } = await supabase
            .from('user_education_progress')
            .insert({
              user_id: user.id,
              current_level: currentLevel,
              current_module: currentModule,
              current_card: currentCard
            });
          
          if (insertError) {
            console.error('Error creating user education progress:', insertError);
          }
        }
        
        // Fetch completed modules
        const { data: completedData, error: completedError } = await supabase
          .from('user_completed_modules')
          .select('level, module_id')
          .eq('user_id', user.id);
        
        if (completedError) {
          console.error('Error fetching completed modules:', completedError);
        }
        
        if (completedData && completedData.length > 0) {
          // Count completed modules by level
          const newCompletedModules = {
            basics: completedData.filter(item => item.level === 'basics').length,
            intermediate: completedData.filter(item => item.level === 'intermediate').length,
            pro: completedData.filter(item => item.level === 'pro').length
          };
          
          setCompletedModules(newCompletedModules);
          
          // Update module progress
          const newModuleProgress: ModuleProgress = {};
          completedData.forEach(item => {
            newModuleProgress[item.module_id] = true;
          });
          
          setModuleProgress(newModuleProgress);
        }
        
        // Fetch module views
        const { data: viewsData, error: viewsError } = await supabase
          .from('user_module_views')
          .select('module_id')
          .eq('user_id', user.id);
        
        if (viewsError) {
          console.error('Error fetching module views:', viewsError);
        }
        
        if (viewsData && viewsData.length > 0) {
          // Update module views
          const newModuleViews: ModuleViews = {};
          viewsData.forEach(item => {
            newModuleViews[item.module_id] = true;
          });
          
          setModuleViews(newModuleViews);
        }
        
        // Fetch quiz results
        const { data: quizData, error: quizError } = await supabase
          .from('user_quiz_results')
          .select('*')
          .eq('user_id', user.id);
        
        if (quizError) {
          console.error('Error fetching quiz results:', quizError);
        }
        
        if (quizData && quizData.length > 0) {
          // Update quiz results
          const newQuizResults: QuizResults = {};
          quizData.forEach(item => {
            newQuizResults[item.module_id] = {
              completed: true,
              passed: item.passed,
              score: item.score,
              totalQuestions: item.total_questions,
              timeSpent: item.time_spent,
              completedAt: item.completed_at
            };
          });
          
          setQuizResults(newQuizResults);
        }
        
        // Fetch earned badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_earned_badges')
          .select('badge_id')
          .eq('user_id', user.id);
        
        if (badgesError) {
          console.error('Error fetching earned badges:', badgesError);
        }
        
        if (badgesData && badgesData.length > 0) {
          // Update badges
          const updatedBadges = badges.map(badge => {
            if (badgesData.some(item => item.badge_id === badge.id)) {
              return { ...badge, unlocked: true };
            }
            return badge;
          });
          
          setBadges(updatedBadges);
        }
      } catch (error) {
        console.error('Error fetching user education data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchUserEducationData();
  }, [isAuthenticated, user]);
  
  // Save user progress to Supabase when it changes
  useEffect(() => {
    const saveUserProgress = async () => {
      if (!isAuthenticated) {
        // Save to localStorage for non-authenticated users
        localStorage.setItem('education_currentLevel', currentLevel);
        localStorage.setItem('education_currentModule', currentModule);
        localStorage.setItem(`education_card_${currentModule}`, currentCard.toString());
        localStorage.setItem('education_moduleProgress', JSON.stringify(moduleProgress));
        localStorage.setItem('education_moduleViews', JSON.stringify(moduleViews));
        localStorage.setItem('education_quizResults', JSON.stringify(quizResults));
        localStorage.setItem('education_completedModules', JSON.stringify(completedModules));
        localStorage.setItem('education_badges', JSON.stringify(badges));
        return;
      }
      
      try {
        // Update user education progress
        const { error: updateError } = await supabase
          .from('user_education_progress')
          .upsert({
            user_id: user.id,
            current_level: currentLevel,
            current_module: currentModule,
            current_card: currentCard
          });
        
        if (updateError) {
          console.error('Error updating user education progress:', updateError);
        }
      } catch (error) {
        console.error('Error saving user progress:', error);
      }
    };
    
    // Don't save during initial data loading
    if (!isLoadingData) {
      saveUserProgress();
    }
  }, [
    isAuthenticated, 
    user, 
    currentLevel, 
    currentModule, 
    currentCard,
    isLoadingData
  ]);

  // Handle module selection
  const selectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    const savedCard = localStorage.getItem(`education_card_${moduleId}`);
    setCurrentCard(savedCard ? parseInt(savedCard, 10) : 0);
  };

  // Mark module as viewed
  const markModuleViewed = async (moduleId: string) => {
    if (moduleViews[moduleId]) return; // Already viewed
    
    setModuleViews(prev => ({
      ...prev,
      [moduleId]: true
    }));
    
    if (isAuthenticated) {
      try {
        // Insert module view in database
        await supabase
          .from('user_module_views')
          .insert({
            user_id: user.id,
            module_id: moduleId
          });
      } catch (error) {
        console.error('Error marking module as viewed:', error);
      }
    }
  };

  // Flip to next card
  const nextCard = () => {
    const moduleData = educationData[currentLevel].find(m => m.id === currentModule);
    
    if (moduleData && currentCard < moduleData.flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
    } else if (moduleData) {
      // Last card reached, prompt to take quiz
      setAutoLaunchQuiz(currentModule);
      
      toast({
        title: "Module complete!",
        description: "You've reached the end of this module. The quiz will open automatically to test your knowledge.",
      });
    }
  };

  // Flip to previous card
  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
    }
  };

  // Start the quiz for current module
  const startQuiz = () => {
    setQuizActive(true);
  };

  // Submit quiz answer
  const submitQuizAnswer = async (
    moduleId: string, 
    isPassed: boolean, 
    score: number, 
    totalQuestions: number, 
    timeSpent: number
  ) => {
    // Record quiz results
    setQuizResults(prev => ({
      ...prev,
      [moduleId]: {
        completed: true,
        passed: isPassed,
        score,
        totalQuestions,
        timeSpent,
        completedAt: new Date().toISOString()
      }
    }));
    
    if (isAuthenticated) {
      try {
        // Save quiz result to database
        await supabase
          .from('user_quiz_results')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            passed: isPassed,
            score,
            total_questions: totalQuestions,
            time_spent: timeSpent
          });
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
    
    if (isPassed) {
      // Mark module as completed if not already
      if (!moduleProgress[moduleId]) {
        // Update module progress
        setModuleProgress(prev => ({
          ...prev,
          [moduleId]: true
        }));
        
        // Update completed modules count
        setCompletedModules(prev => {
          const updatedLevel = {
            ...prev,
            [currentLevel]: prev[currentLevel] + 1
          };
          
          return updatedLevel;
        });
        
        // Save completed module to database if authenticated
        if (isAuthenticated) {
          try {
            await supabase
              .from('user_completed_modules')
              .insert({
                user_id: user.id,
                level: currentLevel,
                module_id: moduleId
              });
          } catch (error) {
            console.error('Error saving completed module:', error);
          }
        }
        
        // Check if any badges should be unlocked
        // This is the line with the error - we need to pass the current level and the new completed count directly
        const newCompletedCount = completedModules[currentLevel] + 1;
        checkBadgeUnlocks(currentLevel, newCompletedCount);
        
        // Get the next module ID
        const currentModules = educationData[currentLevel];
        const currentIndex = currentModules.findIndex(m => m.id === moduleId);
        
        if (currentIndex < currentModules.length - 1) {
          // There is a next module in this level
          const nextModuleId = currentModules[currentIndex + 1].id;
          
          // Auto-select next module
          setTimeout(() => {
            selectModule(nextModuleId);
            
            toast({
              title: "Next Module Unlocked!",
              description: `You can now continue to ${currentModules[currentIndex + 1].title}`,
            });
          }, 1000);
        } else if (currentLevel === 'basics') {
          // Completed all basics, move to intermediate
          setTimeout(() => {
            setCurrentLevel('intermediate');
            selectModule('module1');
            
            toast({
              title: "Intermediate Level Unlocked!",
              description: "Congratulations! You've completed the Basics level and unlocked Intermediate learning.",
            });
          }, 1000);
        } else if (currentLevel === 'intermediate') {
          // Completed all intermediate, move to pro
          setTimeout(() => {
            setCurrentLevel('pro');
            selectModule('module1');
            
            toast({
              title: "Pro Level Unlocked!",
              description: "Congratulations! You've completed the Intermediate level and unlocked Pro learning.",
            });
          }, 1000);
        } else {
          // Completed everything!
          toast({
            title: "Congratulations! 🎉",
            description: "You've completed all modules in the Trading Academy!",
          });
        }
      }
      
      toast({
        title: "Quiz Passed! 🎉",
        description: "Congratulations! You've completed this module.",
      });
    } else {
      toast({
        title: "Try Again",
        description: "Review the material and try the quiz again.",
        variant: "destructive"
      });
    }
    
    setQuizActive(false);
    // Important: Reset autoLaunchQuiz after the quiz is completed
    setAutoLaunchQuiz(null);
  };

  // Check if any badges should be unlocked
  const checkBadgeUnlocks = async (level: Level, completedCount: number) => {
    const newBadges = [...badges];
    const completed = completedCount;
    let badgeUnlocked = false;
    let unlockedBadgeId = '';
    
    // First module completion badge
    if (completed === 1) {
      const badgeToUnlock = newBadges.find(
        badge => badge.level === level && badge.id === `${level}-starter`
      );
      
      if (badgeToUnlock && !badgeToUnlock.unlocked) {
        badgeToUnlock.unlocked = true;
        badgeUnlocked = true;
        unlockedBadgeId = badgeToUnlock.id;
        
        toast({
          title: `Badge Unlocked: ${badgeToUnlock.name}`,
          description: badgeToUnlock.description,
        });
      }
    }
    
    // Half-way badge
    if (completed === 8) {
      const badgeToUnlock = newBadges.find(
        badge => badge.level === level && badge.id === `${level}-half`
      );
      
      if (badgeToUnlock && !badgeToUnlock.unlocked) {
        badgeToUnlock.unlocked = true;
        badgeUnlocked = true;
        unlockedBadgeId = badgeToUnlock.id;
        
        toast({
          title: `Badge Unlocked: ${badgeToUnlock.name}`,
          description: badgeToUnlock.description,
        });
      }
    }
    
    // All modules completed badge
    if (completed === 15) {
      const badgeToUnlock = newBadges.find(
        badge => badge.level === level && badge.id === `${level}-complete`
      );
      
      if (badgeToUnlock && !badgeToUnlock.unlocked) {
        badgeToUnlock.unlocked = true;
        badgeUnlocked = true;
        unlockedBadgeId = badgeToUnlock.id;
        
        toast({
          title: `Badge Unlocked: ${badgeToUnlock.name}`,
          description: badgeToUnlock.description,
        });
      }
    }
    
    setBadges(newBadges);
    
    // Save unlocked badge to database if authenticated
    if (badgeUnlocked && isAuthenticated) {
      try {
        await supabase
          .from('user_earned_badges')
          .insert({
            user_id: user.id,
            badge_id: unlockedBadgeId
          });
      } catch (error) {
        console.error('Error saving earned badge:', error);
      }
    }
  };

  // Get module status - locked, active, completed
  const getModuleStatus = (moduleId: string, index: number) => {
    const isCompleted = moduleProgress[moduleId] || false;
    const currentModules = educationData[currentLevel];
    const previousModuleId = index > 0 ? currentModules[index - 1].id : null;
    const isPreviousCompleted = previousModuleId ? moduleProgress[previousModuleId] || false : true;
    
    // First module is always unlocked, others require previous module completion
    const isLocked = index > 0 && !isPreviousCompleted;
    const isActive = moduleId === currentModule;
    
    return {
      isCompleted,
      isLocked,
      isActive
    };
  };
  
  // Get quiz statistics and overall performance
  const getStats = () => {
    const totalModules = Object.keys(educationData).reduce(
      (sum, level) => sum + educationData[level as Level].length, 
      0
    );
    
    const completedCount = Object.values(moduleProgress).filter(Boolean).length;
    const quizzesTaken = Object.keys(quizResults).length;
    
    let totalScore = 0;
    let totalMaxScore = 0;
    let totalTimeSpent = 0;
    
    Object.values(quizResults).forEach(result => {
      if (result.completed) {
        totalScore += result.score;
        totalMaxScore += result.totalQuestions;
        totalTimeSpent += result.timeSpent;
      }
    });
    
    const averageScore = totalMaxScore > 0 
      ? Math.round((totalScore / totalMaxScore) * 100) 
      : 0;
    
    return {
      totalModules,
      completedCount,
      quizzesTaken,
      averageScore,
      totalTimeSpent,
      badgesEarned: earnedBadges.length
    };
  };

  return {
    currentLevel,
    setCurrentLevel,
    currentModule,
    selectModule,
    currentCard,
    nextCard,
    prevCard,
    moduleProgress,
    badges,
    earnedBadges,
    quizActive,
    startQuiz,
    submitQuizAnswer,
    completedModules,
    progress,
    getModuleStatus,
    moduleViews,
    markModuleViewed,
    quizResults,
    getStats,
    autoLaunchQuiz,
    setAutoLaunchQuiz,
    isLoadingData
  };
};
