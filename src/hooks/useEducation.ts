import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { educationData } from '@/data/educationData';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchUserEducationData,
  markModuleCompleted,
  markModuleViewed,
  saveQuizResult,
  saveEarnedBadge,
  updateEducationProgress,
  fetchModuleQuizData
} from '@/adapters/educationAdapter';

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

  const [usingRealData, setUsingRealData] = useState<boolean>(false);
  const [loadingQuizData, setLoadingQuizData] = useState<boolean>(false);

  const progress = {
    overall: Math.round(((completedModules.basics + completedModules.intermediate + completedModules.pro) / 45) * 100),
    basics: Math.round((completedModules.basics / 15) * 100),
    intermediate: Math.round((completedModules.intermediate / 15) * 100),
    pro: Math.round((completedModules.pro / 15) * 100)
  };

  const earnedBadges = badges.filter(badge => badge.unlocked);

  useEffect(() => {
    localStorage.setItem('education_currentLevel', currentLevel);
    localStorage.setItem('education_currentModule', currentModule);
    localStorage.setItem(`education_card_${currentModule}`, currentCard.toString());
    localStorage.setItem('education_moduleProgress', JSON.stringify(moduleProgress));
    localStorage.setItem('education_moduleViews', JSON.stringify(moduleViews));
    localStorage.setItem('education_quizResults', JSON.stringify(quizResults));
    localStorage.setItem('education_completedModules', JSON.stringify(completedModules));
    localStorage.setItem('education_badges', JSON.stringify(badges));
  }, [
    currentLevel, 
    currentModule, 
    currentCard, 
    moduleProgress, 
    moduleViews,
    quizResults,
    completedModules, 
    badges
  ]);

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        const userData = await fetchUserEducationData(user.id);
        if (userData) {
          setUsingRealData(true);
        }
      };
      loadUserData();
    }
  }, [user]);

  const selectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    const savedCard = localStorage.getItem(`education_card_${moduleId}`);
    setCurrentCard(savedCard ? parseInt(savedCard, 10) : 0);
    
    if (user) {
      updateEducationProgress(user.id, {
        currentModule: moduleId
      }).catch(error => console.error("Error updating module selection:", error));
    }
  };

  const markModuleViewedHandler = async (moduleId: string) => {
    if (moduleViews[moduleId]) return;
    
    setModuleViews(prev => ({
      ...prev,
      [moduleId]: true
    }));
    
    if (user) {
      try {
        await markModuleViewed(user.id, moduleId);
      } catch (error) {
        console.error("Error marking module as viewed:", error);
      }
    }
  };

  const nextCard = () => {
    const moduleData = educationData[currentLevel].find(m => m.id === currentModule);
    
    if (moduleData && currentCard < moduleData.flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
    } else if (moduleData) {
      setAutoLaunchQuiz(currentModule);
      
      toast({
        title: "Module complete!",
        description: "You've reached the end of this module. The quiz will open automatically to test your knowledge.",
      });
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
    }
  };

  const startQuiz = () => {
    setQuizActive(true);
  };

  const fetchQuizData = async (moduleId: string) => {
    if (!user) return null;
    
    setLoadingQuizData(true);
    try {
      const quizData = await fetchModuleQuizData(moduleId);
      setLoadingQuizData(false);
      return quizData;
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoadingQuizData(false);
      return null;
    }
  };

  const completeQuiz = async (quizResult: {
    moduleId: string, 
    passed: boolean, 
    score: number, 
    totalQuestions: number, 
    timeSpent: number
  }) => {
    const { moduleId, passed, score, totalQuestions, timeSpent } = quizResult;
    
    setQuizResults(prev => ({
      ...prev,
      [moduleId]: {
        completed: true,
        passed,
        score,
        totalQuestions,
        timeSpent,
        completedAt: new Date().toISOString()
      }
    }));
    
    if (passed) {
      if (!moduleProgress[moduleId]) {
        setModuleProgress(prev => ({
          ...prev,
          [moduleId]: true
        }));
        
        setCompletedModules(prev => {
          const updatedLevel = {
            ...prev,
            [currentLevel]: prev[currentLevel] + 1
          };
          
          return updatedLevel;
        });
        
        const newCompletedCount = completedModules[currentLevel] + 1;
        checkBadgeUnlocks(currentLevel, newCompletedCount);
        
        const currentModules = educationData[currentLevel];
        const currentIndex = currentModules.findIndex(m => m.id === moduleId);
        
        if (currentIndex < currentModules.length - 1) {
          const nextModuleId = currentModules[currentIndex + 1].id;
          
          setTimeout(() => {
            selectModule(nextModuleId);
            
            toast({
              title: "Next Module Unlocked!",
              description: `You can now continue to ${currentModules[currentIndex + 1].title}`,
            });
          }, 1000);
        } else if (currentLevel === 'basics') {
          setTimeout(() => {
            setCurrentLevel('intermediate');
            selectModule('module1');
            
            toast({
              title: "Intermediate Level Unlocked!",
              description: "Congratulations! You've completed the Basics level and unlocked Intermediate learning.",
            });
          }, 1000);
        } else if (currentLevel === 'intermediate') {
          setTimeout(() => {
            setCurrentLevel('pro');
            selectModule('module1');
            
            toast({
              title: "Pro Level Unlocked!",
              description: "Congratulations! You've completed the Intermediate level and unlocked Pro learning.",
            });
          }, 1000);
        } else {
          toast({
            title: "Congratulations! 🎉",
            description: "You've completed all modules in the Trading Academy!",
          });
        }
        
        if (user) {
          try {
            await saveQuizResult(user.id, {
              moduleId,
              score,
              totalQuestions,
              passed,
              timeSpent
            });
            
            await markModuleCompleted(user.id, moduleId, currentLevel);
          } catch (error) {
            console.error("Error saving quiz completion:", error);
          }
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
    setAutoLaunchQuiz(null);
  };

  const submitQuizAnswer = (
    moduleId: string, 
    passed: boolean, 
    score: number, 
    totalQuestions: number, 
    timeSpent: number
  ) => {
    return completeQuiz({
      moduleId,
      passed,
      score,
      totalQuestions,
      timeSpent
    });
  };

  const checkBadgeUnlocks = async (level: Level, completedCount: number) => {
    const newBadges = [...badges];
    const completed = completedCount;
    
    if (completed === 1) {
      const badgeToUnlock = newBadges.find(
        badge => badge.level === level && badge.id === `${level}-starter`
      );
      
      if (badgeToUnlock && !badgeToUnlock.unlocked) {
        badgeToUnlock.unlocked = true;
        toast({
          title: `Badge Unlocked: ${badgeToUnlock.name}`,
          description: badgeToUnlock.description,
        });
        
        if (user) {
          try {
            await saveEarnedBadge(user.id, badgeToUnlock.id);
          } catch (error) {
            console.error("Error saving earned badge:", error);
          }
        }
      }
    }
    
    if (completed === 8) {
      const badgeToUnlock = newBadges.find(
        badge => badge.level === level && badge.id === `${level}-half`
      );
      
      if (badgeToUnlock && !badgeToUnlock.unlocked) {
        badgeToUnlock.unlocked = true;
        toast({
          title: `Badge Unlocked: ${badgeToUnlock.name}`,
          description: badgeToUnlock.description,
        });
        
        if (user) {
          try {
            await saveEarnedBadge(user.id, badgeToUnlock.id);
          } catch (error) {
            console.error("Error saving earned badge:", error);
          }
        }
      }
    }
    
    if (completed === 15) {
      const badgeToUnlock = newBadges.find(
        badge => badge.level === level && badge.id === `${level}-complete`
      );
      
      if (badgeToUnlock && !badgeToUnlock.unlocked) {
        badgeToUnlock.unlocked = true;
        toast({
          title: `Badge Unlocked: ${badgeToUnlock.name}`,
          description: badgeToUnlock.description,
        });
        
        if (user) {
          try {
            await saveEarnedBadge(user.id, badgeToUnlock.id);
          } catch (error) {
            console.error("Error saving earned badge:", error);
          }
        }
      }
    }
    
    setBadges(newBadges);
  };

  const getModuleStatus = (moduleId: string, index: number) => {
    const isCompleted = moduleProgress[moduleId] || false;
    const currentModules = educationData[currentLevel];
    const previousModuleId = index > 0 ? currentModules[index - 1].id : null;
    const isPreviousCompleted = previousModuleId ? moduleProgress[previousModuleId] || false : true;
    
    const isLocked = index > 0 && !isPreviousCompleted;
    const isActive = moduleId === currentModule;
    
    return {
      isCompleted,
      isLocked,
      isActive
    };
  };

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
    completeQuiz,
    submitQuizAnswer,
    completedModules,
    progress,
    getModuleStatus,
    moduleViews,
    markModuleViewed: markModuleViewedHandler,
    quizResults,
    getStats,
    autoLaunchQuiz,
    setAutoLaunchQuiz,
    fetchQuizData,
    loadingQuizData,
    usingRealData
  };
};
