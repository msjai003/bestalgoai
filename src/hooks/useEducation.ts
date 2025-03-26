
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { educationData } from '@/data/educationData';

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

  // Calculate overall progress
  const progress = {
    overall: Math.round(((completedModules.basics + completedModules.intermediate + completedModules.pro) / 45) * 100),
    basics: Math.round((completedModules.basics / 15) * 100),
    intermediate: Math.round((completedModules.intermediate / 15) * 100),
    pro: Math.round((completedModules.pro / 15) * 100)
  };

  // Filter earned badges
  const earnedBadges = badges.filter(badge => badge.unlocked);
  
  // Save user progress whenever it changes
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

  // Handle module selection
  const selectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    const savedCard = localStorage.getItem(`education_card_${moduleId}`);
    setCurrentCard(savedCard ? parseInt(savedCard, 10) : 0);
  };

  // Mark module as viewed
  const markModuleViewed = (moduleId: string) => {
    if (moduleViews[moduleId]) return; // Already viewed
    
    setModuleViews(prev => ({
      ...prev,
      [moduleId]: true
    }));
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
  const submitQuizAnswer = (
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
        
        // Check if any badges should be unlocked
        checkBadgeUnlocks(currentLevel, prev => prev[currentLevel] + 1);
        
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
    setAutoLaunchQuiz(null);
  };

  // Check if any badges should be unlocked
  const checkBadgeUnlocks = (level: Level, completedCount: number) => {
    const newBadges = [...badges];
    const completed = completedCount;
    
    // First module completion badge
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
      }
    }
    
    // Half-way badge
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
      }
    }
    
    // All modules completed badge
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
      }
    }
    
    setBadges(newBadges);
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
    setAutoLaunchQuiz
  };
};
