
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

export const useEducation = () => {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState<Level>('basics');
  const [currentModule, setCurrentModule] = useState<string>('module1');
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>({});
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [completedModules, setCompletedModules] = useState<CompletedModules>({
    basics: 0,
    intermediate: 0,
    pro: 0
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

  // Initialize badges
  useEffect(() => {
    // This would typically come from an API or localStorage
    const initialBadges: Badge[] = [
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
    
    setBadges(initialBadges);
  }, []);

  // Handle module selection
  const selectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    setCurrentCard(0);
  };

  // Flip to next card
  const nextCard = () => {
    const moduleData = educationData[currentLevel].find(m => m.id === currentModule);
    
    if (moduleData && currentCard < moduleData.flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
    } else {
      // Last card reached
      toast({
        title: "Module complete!",
        description: "You've reached the end of this module. Take the quiz to test your knowledge.",
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
  const submitQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Mark module as completed
      setModuleProgress(prev => ({
        ...prev,
        [currentModule]: true
      }));
      
      // Update completed modules count
      setCompletedModules(prev => ({
        ...prev,
        [currentLevel]: prev[currentLevel] + 1
      }));
      
      // Check if any badges should be unlocked
      checkBadgeUnlocks();
      
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
  };

  // Check if any badges should be unlocked
  const checkBadgeUnlocks = () => {
    const newBadges = [...badges];
    const completed = completedModules[currentLevel] + 1;
    
    // First module completion badge
    if (completed === 1) {
      const badgeToUnlock = newBadges.find(
        badge => badge.level === currentLevel && badge.id === `${currentLevel}-starter`
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
        badge => badge.level === currentLevel && badge.id === `${currentLevel}-half`
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
        badge => badge.level === currentLevel && badge.id === `${currentLevel}-complete`
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
    progress
  };
};
