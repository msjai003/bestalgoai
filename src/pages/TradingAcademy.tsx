
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  CheckCircle, 
  Clock, 
  RefreshCcw,
  Brain, 
  Lightbulb, 
  Infinity,
  Award,
  Play,
  LogIn,
  Loader,
  Bookmark,
  Settings,
  Moon,
  Sun
} from 'lucide-react';

import { FlashCard } from '@/components/education/FlashCard';
import { ModuleList } from '@/components/education/ModuleList';
import { ProgressTracker } from '@/components/education/ProgressTracker';
import { LevelBadges } from '@/components/education/LevelBadges';
import { Leaderboard } from '@/components/education/Leaderboard';
import { QuizModal } from '@/components/education/QuizModal';
import { useEducation, Level } from '@/hooks/useEducation';
import { useAIEducation } from '@/hooks/useAIEducation';
import { educationData } from '@/data/educationData';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AiCoachTip } from '@/components/education/AiCoachTip';
import confetti from 'canvas-confetti';

const levelDescriptions = {
  basics: "Master the fundamentals of trading, market mechanics, and essential terminology to build a solid foundation for your trading journey.",
  intermediate: "Advanced trading strategies, technical analysis, and risk management techniques to elevate your trading skills to the next level.",
  pro: "Professional algorithmic trading, quantitative analysis, and automated strategy development for sophisticated market participation."
};

const TradingAcademy = () => {
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
    usingRealData,
    loadingQuizData
  } = useEducation();
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuizModule, setActiveQuizModule] = useState<string>(currentModule);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [bookmarkedModules, setBookmarkedModules] = useState<Record<string, boolean>>({});
  
  const { 
    modules: aiModules, 
    loading: aiModulesLoading, 
    regenerateModules,
    regenerating
  } = useAIEducation(currentLevel, user && usingRealData);
  
  const stats = getStats();
  
  const moduleSource = aiModules.length > 0 ? aiModules : educationData[currentLevel];
  const currentModuleData = moduleSource?.find(m => m.id === activeQuizModule);
  
  // Trigger confetti when completing a module or earning a badge
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  const handleLevelChange = (value: string) => {
    setCurrentLevel(value as Level);
  };
  
  const handleLaunchQuiz = (moduleId: string) => {
    try {
      // If already loading, prevent multiple clicks
      if (isLoadingQuiz) return;
      
      setIsLoadingQuiz(true);
      setActiveQuizModule(moduleId);
      startQuiz();
      
      // Add a timeout to ensure data is loaded
      setTimeout(() => {
        try {
          setQuizModalOpen(true);
        } catch (error) {
          console.error("Error opening quiz modal:", error);
          toast({
            title: "Error",
            description: "Failed to open quiz. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingQuiz(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error in handleLaunchQuiz:", error);
      toast({
        title: "Error launching quiz",
        description: "There was a problem starting the quiz. Please try again.",
        variant: "destructive"
      });
      setIsLoadingQuiz(false);
    }
  };
  
  const toggleBookmark = (moduleId: string) => {
    setBookmarkedModules(prev => {
      const newBookmarks = { ...prev, [moduleId]: !prev[moduleId] };
      localStorage.setItem('bookmarked_modules', JSON.stringify(newBookmarks));
      
      if (newBookmarks[moduleId]) {
        toast({
          title: "Module Bookmarked",
          description: "This module has been added to your bookmarks.",
        });
      } else {
        toast({
          title: "Bookmark Removed",
          description: "This module has been removed from your bookmarks.",
        });
      }
      
      return newBookmarks;
    });
  };
  
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('dark_mode', String(newMode));
      return newMode;
    });
  };
  
  // Load bookmarks from local storage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarked_modules');
    if (savedBookmarks) {
      setBookmarkedModules(JSON.parse(savedBookmarks));
    }
    
    // Auto-set dark mode after 6pm if not manually set
    const savedTheme = localStorage.getItem('dark_mode');
    if (savedTheme === null) {
      const hour = new Date().getHours();
      setIsDarkMode(hour >= 18 || hour < 6);
    } else {
      setIsDarkMode(savedTheme === 'true');
    }
  }, []);
  
  useEffect(() => {
    if (autoLaunchQuiz) {
      setActiveQuizModule(autoLaunchQuiz);
      startQuiz();
      setQuizModalOpen(true);
    }
  }, [autoLaunchQuiz, startQuiz]);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-100'} transition-colors duration-300 text-${isDarkMode ? 'white' : 'gray-800'}`}>
      <Header />
      
      <main className="pt-16 pb-20 px-4 max-w-7xl mx-auto">
        <section className="py-8 mb-6">
          <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-6 shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <GraduationCap className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2 h-6 w-6`} />
                <h2 className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} text-xl font-bold`}>Trading Academy</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-gray-800/10`}
                  onClick={toggleTheme}
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                
                {!user && (
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className={`${isDarkMode ? 'border-cyan/30 text-cyan hover:bg-cyan/10' : 'border-blue-300 text-blue-500 hover:bg-blue-50'}`}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-3">
              <span className={isDarkMode ? 'text-cyan' : 'text-blue-500'}>Master Trading</span> from Basics to Pro
            </h1>
            
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Interactive flashcards, quizzes, and AI-personalized learning paths to become a confident trader
            </p>
            
            {user ? (
              <div className="flex flex-wrap gap-4 mt-5">
                <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
                  <CheckCircle className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
                  <span className="text-sm">{stats.completedCount}/{stats.totalModules} Modules</span>
                </div>
                
                <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
                  <Trophy className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
                  <span className="text-sm">{stats.quizzesTaken} Quizzes</span>
                </div>
                
                <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
                  <Award className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
                  <span className="text-sm">{stats.badgesEarned} Badges</span>
                </div>
                
                {stats.averageScore > 0 && (
                  <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
                    <Brain className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
                    <span className="text-sm">{stats.averageScore}% Score</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/auth?signup=true">
                  <Button className={isDarkMode ? 'bg-cyan text-charcoalPrimary hover:bg-cyan/90' : 'bg-blue-500 text-white hover:bg-blue-600'}>
                    Create Free Account
                  </Button>
                </Link>
                <Button variant="outline" className={isDarkMode ? 'border-white/20' : 'border-gray-300'}>
                  Explore Modules
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {user && (
          <>
            <ProgressTracker progress={progress} earnedBadges={earnedBadges} />
            <AiCoachTip level={currentLevel} completedModules={completedModules} />
          </>
        )}
        
        <section className="mb-8">
          <Tabs defaultValue={currentLevel} onValueChange={handleLevelChange} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className={`grid w-fit grid-cols-3 ${isDarkMode ? 'bg-charcoalSecondary border border-gray-800/40' : 'bg-white border border-gray-200'}`}>
                <TabsTrigger value="basics" className={`flex gap-2 items-center ${isDarkMode ? 'data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary' : 'data-[state=active]:bg-blue-500 data-[state=active]:text-white'}`}>
                  <BookOpen className="h-4 w-4" />
                  <span>Basics</span>
                </TabsTrigger>
                <TabsTrigger value="intermediate" className={`flex gap-2 items-center ${isDarkMode ? 'data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary' : 'data-[state=active]:bg-blue-500 data-[state=active]:text-white'}`}>
                  <Brain className="h-4 w-4" />
                  <span>Intermediate</span>
                </TabsTrigger>
                <TabsTrigger value="pro" className={`flex gap-2 items-center ${isDarkMode ? 'data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary' : 'data-[state=active]:bg-blue-500 data-[state=active]:text-white'}`}>
                  <Infinity className="h-4 w-4" />
                  <span>Pro</span>
                </TabsTrigger>
              </TabsList>
              
              {user && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${isDarkMode ? 'border-cyan/20 text-cyan' : 'border-blue-200 text-blue-500'} gap-1`}
                  onClick={regenerateModules}
                  disabled={regenerating}
                >
                  {regenerating ? (
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-3.5 w-3.5" />
                  )}
                  <span>Regenerate AI Modules</span>
                </Button>
              )}
            </div>
            
            {aiModulesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className={`animate-spin h-8 w-8 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />
                <span>Loading AI-enhanced modules...</span>
              </div>
            ) : (
              <>
                <TabsContent value="basics">
                  <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-5 mb-6 shadow-md transition-all duration-300`}>
                    <div className="flex items-center mb-3">
                      <BookOpen className={`h-5 w-5 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />
                      <h2 className="text-lg font-bold">Trading Basics</h2>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
                      {levelDescriptions.basics}
                    </p>
                    <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-1`} />
                      <span>{completedModules.basics} of 15 modules completed</span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-100'} rounded-full h-2 mb-4`}>
                      <div className={`${isDarkMode ? 'bg-cyan' : 'bg-blue-500'} h-2 rounded-full transition-all duration-700 ease-in-out`} style={{ width: `${(completedModules.basics / 15) * 100}%` }}></div>
                    </div>
                    <LevelBadges level="basics" earnedBadges={earnedBadges} />
                  </div>
                  
                  <ModuleList 
                    level={currentLevel} 
                    currentModule={currentModule} 
                    completedModules={completedModules[currentLevel]}
                    onLaunchQuiz={handleLaunchQuiz}
                    modules={aiModules.length > 0 ? aiModules : undefined}
                    bookmarkedModules={bookmarkedModules}
                    onToggleBookmark={toggleBookmark}
                    isDarkMode={isDarkMode}
                  />
                </TabsContent>
                
                <TabsContent value="intermediate">
                  <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-5 mb-6 shadow-md transition-all duration-300`}>
                    <div className="flex items-center mb-3">
                      <Brain className={`h-5 w-5 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />
                      <h2 className="text-lg font-bold">Intermediate Trading</h2>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
                      {levelDescriptions.intermediate}
                    </p>
                    <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-1`} />
                      <span>{completedModules.intermediate} of 15 modules completed</span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-100'} rounded-full h-2 mb-4`}>
                      <div className={`${isDarkMode ? 'bg-cyan' : 'bg-blue-500'} h-2 rounded-full transition-all duration-700 ease-in-out`} style={{ width: `${(completedModules.intermediate / 15) * 100}%` }}></div>
                    </div>
                    <LevelBadges level="intermediate" earnedBadges={earnedBadges} />
                  </div>
                  
                  <ModuleList 
                    level={currentLevel} 
                    currentModule={currentModule} 
                    completedModules={completedModules[currentLevel]}
                    onLaunchQuiz={handleLaunchQuiz}
                    modules={aiModules.length > 0 ? aiModules : undefined}
                    bookmarkedModules={bookmarkedModules}
                    onToggleBookmark={toggleBookmark}
                    isDarkMode={isDarkMode}
                  />
                </TabsContent>
                
                <TabsContent value="pro">
                  <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-5 mb-6 shadow-md transition-all duration-300`}>
                    <div className="flex items-center mb-3">
                      <Infinity className={`h-5 w-5 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />
                      <h2 className="text-lg font-bold">Professional Algo Trading</h2>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
                      {levelDescriptions.pro}
                    </p>
                    <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-1`} />
                      <span>{completedModules.pro} of 15 modules completed</span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-100'} rounded-full h-2 mb-4`}>
                      <div className={`${isDarkMode ? 'bg-cyan' : 'bg-blue-500'} h-2 rounded-full transition-all duration-700 ease-in-out`} style={{ width: `${(completedModules.pro / 15) * 100}%` }}></div>
                    </div>
                    <LevelBadges level="pro" earnedBadges={earnedBadges} />
                  </div>
                  
                  <ModuleList 
                    level={currentLevel} 
                    currentModule={currentModule} 
                    completedModules={completedModules[currentLevel]}
                    onLaunchQuiz={handleLaunchQuiz}
                    modules={aiModules.length > 0 ? aiModules : undefined}
                    bookmarkedModules={bookmarkedModules}
                    onToggleBookmark={toggleBookmark}
                    isDarkMode={isDarkMode}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </section>
        
        {user && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Current Study Material</h2>
              <Button 
                className={`${isDarkMode ? 'bg-cyan text-charcoalPrimary hover:bg-cyan/90' : 'bg-blue-500 text-white hover:bg-blue-600'} text-xs flex items-center`} 
                size="sm" 
                onClick={() => handleLaunchQuiz(currentModule)}
                disabled={isLoadingQuiz}
              >
                {isLoadingQuiz ? (
                  <Loader className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                )}
                {isLoadingQuiz ? 'Loading...' : 'Take Quiz'}
              </Button>
            </div>
            
            <FlashCard />
          </section>
        )}
        
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

export default TradingAcademy;
