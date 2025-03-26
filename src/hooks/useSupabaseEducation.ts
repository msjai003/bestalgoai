
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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

export const useSupabaseEducation = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<Level>('basics');
  const [currentModule, setCurrentModule] = useState<string>('');
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>({});
  const [moduleViews, setModuleViews] = useState<{ [key: string]: boolean }>({});
  const [quizResults, setQuizResults] = useState<{
    [key: string]: {
      completed: boolean;
      passed: boolean;
      score: number;
      totalQuestions: number;
      timeSpent: number;
      completedAt: string;
    };
  }>({});
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [autoLaunchQuiz, setAutoLaunchQuiz] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<CompletedModules>({
    basics: 0,
    intermediate: 0,
    pro: 0,
  });

  // Load user progress from Supabase
  useEffect(() => {
    if (!user) return;
    
    const loadUserProgress = async () => {
      setLoading(true);
      try {
        // Fetch user progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (progressError) throw progressError;
        
        // If no progress record exists, create one
        if (!progressData) {
          const { error: insertError } = await supabase
            .from('user_progress')
            .insert({
              user_id: user.id,
              current_level: 'basics',
              completed_basics: 0,
              completed_intermediate: 0,
              completed_pro: 0
            });
          
          if (insertError) throw insertError;
        } else {
          // Set state from existing progress
          setCurrentLevel(progressData.current_level as Level);
          setCompletedModules({
            basics: progressData.completed_basics,
            intermediate: progressData.completed_intermediate, 
            pro: progressData.completed_pro
          });
          
          if (progressData.current_module_id) {
            // Fetch current module info
            const { data: moduleData } = await supabase
              .from('learning_modules')
              .select('id')
              .eq('id', progressData.current_module_id)
              .maybeSingle();
              
            if (moduleData) {
              setCurrentModule(moduleData.id);
            }
          }
        }
        
        // Fetch module progress
        const { data: moduleProgressData, error: moduleProgressError } = await supabase
          .from('module_progress')
          .select('*')
          .eq('user_id', user.id);
        
        if (moduleProgressError) throw moduleProgressError;
        
        // Convert to the format expected by our UI
        const progressMap: ModuleProgress = {};
        const viewsMap: { [key: string]: boolean } = {};
        
        if (moduleProgressData) {
          moduleProgressData.forEach(item => {
            progressMap[item.module_id] = item.is_completed;
            viewsMap[item.module_id] = item.module_viewed;
            
            // If this is the current module, set the current card index
            if (item.module_id === currentModule) {
              setCurrentCard(item.current_card_index);
            }
          });
        }
        
        setModuleProgress(progressMap);
        setModuleViews(viewsMap);
        
        // Fetch quiz attempts
        const { data: quizAttemptsData, error: quizAttemptsError } = await supabase
          .from('quiz_attempts')
          .select('*, quizzes(module_id)')
          .eq('user_id', user.id);
          
        if (quizAttemptsError) throw quizAttemptsError;
        
        // Convert to the format expected by our UI
        const quizResultsMap: {
          [key: string]: {
            completed: boolean;
            passed: boolean;
            score: number;
            totalQuestions: number;
            timeSpent: number;
            completedAt: string;
          };
        } = {};
        
        if (quizAttemptsData) {
          quizAttemptsData.forEach(attempt => {
            const moduleId = attempt.quizzes?.module_id;
            if (moduleId) {
              quizResultsMap[moduleId] = {
                completed: true,
                passed: attempt.is_passed,
                score: attempt.score,
                totalQuestions: attempt.total_questions,
                timeSpent: attempt.time_spent,
                completedAt: attempt.completed_at
              };
            }
          });
        }
        
        setQuizResults(quizResultsMap);
        
        // Fetch badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('badges')
          .select('*')
          .order('level', { ascending: true });
          
        if (badgesError) throw badgesError;
        
        // Fetch user badges
        const { data: userBadgesData, error: userBadgesError } = await supabase
          .from('user_badges')
          .select('badge_id')
          .eq('user_id', user.id);
          
        if (userBadgesError) throw userBadgesError;
        
        // Create unlocked badges map
        const unlockedBadgeIds = userBadgesData ? userBadgesData.map(ub => ub.badge_id) : [];
        
        // Convert to the format expected by our UI
        const badgesList: Badge[] = badgesData ? badgesData.map(badge => ({
          id: badge.id,
          name: badge.name,
          description: badge.description || '',
          image: badge.image_url || '🏆',
          level: badge.level as Level,
          unlocked: unlockedBadgeIds.includes(badge.id)
        })) : [];
        
        setBadges(badgesList);
      } catch (error: any) {
        console.error('Error loading education data:', error);
        toast({
          title: "Error loading your progress",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProgress();
  }, [user, toast]);

  // Calculate overall progress
  const progress = {
    overall: Math.round(((completedModules.basics + completedModules.intermediate + completedModules.pro) / 45) * 100),
    basics: Math.round((completedModules.basics / 15) * 100),
    intermediate: Math.round((completedModules.intermediate / 15) * 100),
    pro: Math.round((completedModules.pro / 15) * 100)
  };

  // Filter earned badges
  const earnedBadges = badges.filter(badge => badge.unlocked);

  // Update user progress in Supabase
  const updateUserProgress = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          current_level: currentLevel,
          current_module_id: currentModule,
          completed_basics: completedModules.basics,
          completed_intermediate: completedModules.intermediate,
          completed_pro: completedModules.pro,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating user progress:', error);
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Update module progress in Supabase
  const updateModuleProgress = async (moduleId: string, isCompleted: boolean, cardIndex: number) => {
    if (!user) return;
    
    try {
      // Check if record exists
      const { data, error: checkError } = await supabase
        .from('module_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('module_progress')
          .update({
            is_completed: isCompleted,
            current_card_index: cardIndex,
            completed_at: isCompleted ? new Date().toISOString() : null
          })
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('module_progress')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            is_completed: isCompleted,
            current_card_index: cardIndex
          });
        
        if (error) throw error;
      }
      
      // Update local state
      setModuleProgress(prev => ({
        ...prev,
        [moduleId]: isCompleted
      }));
    } catch (error: any) {
      console.error('Error updating module progress:', error);
      toast({
        title: "Error saving module progress",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Mark module as viewed
  const markModuleViewed = async (moduleId: string) => {
    if (!user || moduleViews[moduleId]) return; // Already viewed
    
    try {
      // Check if record exists
      const { data, error: checkError } = await supabase
        .from('module_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('module_progress')
          .update({ module_viewed: true })
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('module_progress')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            module_viewed: true
          });
        
        if (error) throw error;
      }
      
      // Update local state
      setModuleViews(prev => ({
        ...prev,
        [moduleId]: true
      }));
    } catch (error: any) {
      console.error('Error marking module as viewed:', error);
    }
  };

  // Submit quiz results
  const submitQuizAnswer = async (
    moduleId: string,
    isPassed: boolean,
    score: number,
    totalQuestions: number,
    timeSpent: number
  ) => {
    if (!user) return;
    
    try {
      // Get quiz ID for this module
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('id')
        .eq('module_id', moduleId)
        .maybeSingle();
      
      if (quizError) throw quizError;
      
      if (!quizData?.id) {
        console.error('No quiz found for module:', moduleId);
        return;
      }
      
      // Record quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quizData.id,
          score,
          total_questions: totalQuestions,
          is_passed: isPassed,
          time_spent: timeSpent
        });
      
      if (attemptError) throw attemptError;
      
      // Update local state
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
          await updateModuleProgress(moduleId, true, 0);
          
          // Update completed modules count
          const updatedCompletedModules = {
            ...completedModules,
            [currentLevel]: completedModules[currentLevel] + 1
          };
          
          setCompletedModules(updatedCompletedModules);
          
          // Update user progress
          await updateUserProgress();
          
          // Check if any badges should be unlocked
          checkBadgeUnlocks(currentLevel, updatedCompletedModules[currentLevel]);
        }
      }
      
      setQuizActive(false);
      setAutoLaunchQuiz(null);
    } catch (error: any) {
      console.error('Error submitting quiz results:', error);
      toast({
        title: "Error saving quiz results",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Check and unlock badges
  const checkBadgeUnlocks = async (level: Level, completedCount: number) => {
    if (!user) return;
    
    try {
      // Get badges for this level that match the completion count
      const { data: eligibleBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('level', level)
        .lte('achievement_criteria->count', completedCount);
      
      if (badgesError) throw badgesError;
      
      if (!eligibleBadges?.length) return;
      
      // Get already unlocked badges
      const { data: unlockedBadges, error: unlockedError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);
      
      if (unlockedError) throw unlockedError;
      
      const unlockedIds = unlockedBadges ? unlockedBadges.map(ub => ub.badge_id) : [];
      
      // Find badges to unlock
      const badgesToUnlock = eligibleBadges.filter(badge => !unlockedIds.includes(badge.id));
      
      if (!badgesToUnlock.length) return;
      
      // Insert new badges
      const badgeInserts = badgesToUnlock.map(badge => ({
        user_id: user.id,
        badge_id: badge.id
      }));
      
      const { error: insertError } = await supabase
        .from('user_badges')
        .insert(badgeInserts);
      
      if (insertError) throw insertError;
      
      // Update local state
      const updatedBadges = badges.map(badge => {
        const shouldUnlock = badgesToUnlock.some(b => b.id === badge.id);
        if (shouldUnlock && !badge.unlocked) {
          // Show toast notification
          toast({
            title: `Badge Unlocked: ${badge.name}`,
            description: badge.description,
          });
          return { ...badge, unlocked: true };
        }
        return badge;
      });
      
      setBadges(updatedBadges);
    } catch (error: any) {
      console.error('Error unlocking badges:', error);
    }
  };
  
  // Handle module selection
  const selectModule = async (moduleId: string) => {
    if (!user) return;
    
    setCurrentModule(moduleId);
    
    try {
      // Get current card index for this module
      const { data, error } = await supabase
        .from('module_progress')
        .select('current_card_index')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();
      
      if (error) throw error;
      
      // Set current card index
      setCurrentCard(data?.current_card_index || 0);
      
      // Update user progress
      await supabase
        .from('user_progress')
        .update({
          current_module_id: moduleId
        })
        .eq('user_id', user.id);
        
    } catch (error: any) {
      console.error('Error selecting module:', error);
    }
  };
  
  // Flip to next card
  const nextCard = async () => {
    if (!user || !currentModule) return;
    
    const newCardIndex = currentCard + 1;
    setCurrentCard(newCardIndex);
    
    try {
      // Update card index in database
      await updateModuleProgress(currentModule, false, newCardIndex);
      
      // Check if this was the last card
      const { data: moduleData, error: moduleError } = await supabase
        .from('learning_modules')
        .select('id')
        .eq('id', currentModule)
        .maybeSingle();
      
      if (moduleError) throw moduleError;
      
      if (moduleData) {
        // Get flashcard count
        const { count, error: countError } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('module_id', currentModule);
        
        if (countError) throw countError;
        
        // If last card reached, prompt to take quiz
        if (count !== null && newCardIndex >= count) {
          setAutoLaunchQuiz(currentModule);
          
          toast({
            title: "Module complete!",
            description: "You've reached the end of this module. The quiz will open automatically to test your knowledge.",
          });
        }
      }
    } catch (error: any) {
      console.error('Error updating card index:', error);
    }
  };
  
  // Flip to previous card
  const prevCard = async () => {
    if (!user || !currentModule || currentCard <= 0) return;
    
    const newCardIndex = currentCard - 1;
    setCurrentCard(newCardIndex);
    
    try {
      // Update card index in database
      await updateModuleProgress(currentModule, false, newCardIndex);
    } catch (error: any) {
      console.error('Error updating card index:', error);
    }
  };
  
  // Start the quiz for current module
  const startQuiz = () => {
    setQuizActive(true);
  };
  
  // Get module status - locked, active, completed
  const getModuleStatus = async (moduleId: string, index: number) => {
    if (!user) {
      return { isCompleted: false, isLocked: true, isActive: false };
    }
    
    const isCompleted = moduleProgress[moduleId] || false;
    const isActive = moduleId === currentModule;
    
    // Get modules for this level
    const { data: modules, error } = await supabase
      .from('learning_modules')
      .select('id')
      .eq('level', currentLevel)
      .order('sort_order', { ascending: true });
    
    if (error || !modules) {
      console.error('Error getting modules:', error);
      return { isCompleted, isLocked: index > 0, isActive };
    }
    
    // Previous module is the one with index-1
    const previousModuleId = index > 0 ? modules[index - 1]?.id : null;
    const isPreviousCompleted = previousModuleId ? moduleProgress[previousModuleId] || false : true;
    
    // First module is always unlocked, others require previous module completion
    const isLocked = index > 0 && !isPreviousCompleted;
    
    return {
      isCompleted,
      isLocked,
      isActive
    };
  };
  
  // Get quiz statistics and overall performance
  const getStats = async () => {
    if (!user) {
      return {
        totalModules: 0,
        completedCount: 0,
        quizzesTaken: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        badgesEarned: 0
      };
    }
    
    try {
      // Get total modules count
      const { count: totalModules, error: modulesError } = await supabase
        .from('learning_modules')
        .select('*', { count: 'exact', head: true });
      
      if (modulesError) throw modulesError;
      
      // Get quiz attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id);
      
      if (attemptsError) throw attemptsError;
      
      const quizzesTaken = attempts?.length || 0;
      
      let totalScore = 0;
      let totalMaxScore = 0;
      let totalTimeSpent = 0;
      
      attempts?.forEach(attempt => {
        totalScore += attempt.score;
        totalMaxScore += attempt.total_questions;
        totalTimeSpent += attempt.time_spent;
      });
      
      const averageScore = totalMaxScore > 0 
        ? Math.round((totalScore / totalMaxScore) * 100) 
        : 0;
      
      return {
        totalModules: totalModules || 0,
        completedCount: Object.values(moduleProgress).filter(Boolean).length,
        quizzesTaken,
        averageScore,
        totalTimeSpent,
        badgesEarned: earnedBadges.length
      };
    } catch (error: any) {
      console.error('Error getting stats:', error);
      return {
        totalModules: 0,
        completedCount: 0,
        quizzesTaken: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        badgesEarned: 0
      };
    }
  };

  return {
    loading,
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
