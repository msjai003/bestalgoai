
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { QuizModal } from '@/components/education/QuizModal';
import { useEducation } from '@/hooks/useEducation';
import { useAIEducation } from '@/hooks/useAIEducation';
import { educationData } from '@/data/educationData';
import { useAuth } from '@/contexts/AuthContext';
import { AiCoachTip } from '@/components/education/AiCoachTip';
import { ProgressTracker } from '@/components/education/ProgressTracker';
import { Leaderboard } from '@/components/education/Leaderboard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AcademyHeader } from '@/components/education/AcademyHeader';
import { AcademyLevelTabs } from '@/components/education/AcademyLevelTabs';
import { useQuiz } from '@/hooks/useQuiz';
import { useBookmarks } from '@/hooks/useBookmarks';

const TradingAcademy = () => {
  // Use context and hooks
  const { user } = useAuth();
  const { 
    currentLevel, 
    currentModule,
    setCurrentLevel,
    completedModules,
    earnedBadges,
    startQuiz,
    progress,
    getStats,
    autoLaunchQuiz,
    setAutoLaunchQuiz,
    usingRealData
  } = useEducation();
  
  const { 
    modules: aiModules, 
    loading: aiModulesLoading, 
    regenerateModules,
    regenerating
  } = useAIEducation(currentLevel, user && usingRealData);
  
  const {
    isLoadingQuiz,
    quizModalOpen,
    setQuizModalOpen,
    activeQuizModule,
    setActiveQuizModule,
    handleLaunchQuiz,
    triggerCelebration
  } = useQuiz();
  
  const { bookmarkedModules, toggleBookmark } = useBookmarks();
  
  // Get modules based on AI or standard data
  const moduleSource = aiModules.length > 0 ? aiModules : educationData[currentLevel];
  const currentModuleData = moduleSource?.find(m => m.id === activeQuizModule);
  const stats = getStats();
  
  // Launch quiz handler
  const launchQuiz = (moduleId: string) => {
    handleLaunchQuiz(startQuiz, moduleId);
  };
  
  // Auto-launch quiz effect
  useEffect(() => {
    if (autoLaunchQuiz) {
      setActiveQuizModule(autoLaunchQuiz);
      startQuiz();
      setQuizModalOpen(true);
    }
  }, [autoLaunchQuiz, startQuiz, setActiveQuizModule, setQuizModalOpen]);
  
  // Use theme context
  const TradingAcademyContent = () => {
    const { isDarkMode } = useTheme();
    
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-100'} transition-colors duration-300 text-${isDarkMode ? 'white' : 'gray-800'}`}>
        <Header />
        
        <main className="pt-16 pb-20 px-4 max-w-7xl mx-auto">
          <AcademyHeader stats={stats} />
          
          {user && (
            <>
              <ProgressTracker progress={progress} earnedBadges={earnedBadges} />
              <AiCoachTip level={currentLevel} completedModules={completedModules} />
            </>
          )}
          
          <AcademyLevelTabs
            currentLevel={currentLevel}
            onLevelChange={setCurrentLevel}
            completedModules={completedModules}
            earnedBadges={earnedBadges}
            aiModulesLoading={aiModulesLoading}
            regenerateModules={regenerateModules}
            regenerating={regenerating}
            currentModule={currentModule}
            modules={moduleSource}
            bookmarkedModules={bookmarkedModules}
            onToggleBookmark={toggleBookmark}
            onLaunchQuiz={launchQuiz}
          />
          
          <Leaderboard showSignupPrompt={!user} isDarkMode={isDarkMode} />
        </main>
        
        {currentModuleData && (
          <QuizModal
            open={quizModalOpen}
            onOpenChange={setQuizModalOpen}
            quiz={usingRealData ? undefined : currentModuleData.quiz}
            moduleTitle={currentModuleData.title}
            moduleId={activeQuizModule}
            autoLaunch={!!autoLaunchQuiz}
            onQuizComplete={triggerCelebration}
            isDarkMode={isDarkMode}
          />
        )}
        
        <BottomNav />
      </div>
    );
  };
  
  return (
    <ThemeProvider>
      <TooltipProvider>
        <TradingAcademyContent />
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default TradingAcademy;
