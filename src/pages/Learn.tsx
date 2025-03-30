
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Brain, 
  Lightbulb, 
  Infinity, 
  ArrowRight,
  Award,
  BookText,
  Loader
} from 'lucide-react';
import { FlashCard } from '@/components/education/FlashCard';
import { ModuleList } from '@/components/education/ModuleList';
import { ProgressTracker } from '@/components/education/ProgressTracker';
import { LevelBadges } from '@/components/education/LevelBadges';
import { Leaderboard } from '@/components/education/Leaderboard';
import { QuizModal } from '@/components/education/QuizModal';
import { useEducation, Level } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';
import { useAuth } from '@/contexts/AuthContext';

const Learn = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
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
    isLoadingData
  } = useEducation();
  
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuizModule, setActiveQuizModule] = useState<string>(currentModule);
  
  const stats = getStats();
  
  // Create a handler to safely cast the string to Level type
  const handleLevelChange = (value: string) => {
    setCurrentLevel(value as Level);
  };
  
  // Get current module data for the quiz
  const currentModuleData = educationData[currentLevel]?.find(m => m.id === activeQuizModule);
  
  // Handle quiz launch
  const handleLaunchQuiz = (moduleId: string) => {
    setActiveQuizModule(moduleId);
    startQuiz();
    setQuizModalOpen(true);
  };
  
  // Check if there's an auto-launch quiz
  useEffect(() => {
    if (autoLaunchQuiz) {
      console.log("Auto-launching quiz for module:", autoLaunchQuiz);
      setActiveQuizModule(autoLaunchQuiz);
      startQuiz();
      setQuizModalOpen(true);
      // Reset the auto-launch after opening the quiz to prevent multiple opens
      setAutoLaunchQuiz(null);
    }
  }, [autoLaunchQuiz, startQuiz, setAutoLaunchQuiz]);
  
  // Display loading indicator while fetching data
  if (isAuthenticated && isLoadingData) {
    return (
      <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
          <p className="text-lg">Loading your learning progress...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Hero section */}
        <section className="relative py-10 md:py-14 mb-8 glass-card">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 rounded-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5 rounded-xl"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
            <div className="flex items-center justify-center mb-4">
              <BookText className="text-cyan mr-2 h-8 w-8" />
              <h2 className="text-cyan text-2xl font-bold">Trading Academy</h2>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-cyan">Master Trading</span> from Basics to Pro
            </h1>
            
            <p className="text-gray-300 mb-6 text-base md:text-lg max-w-2xl mx-auto">
              Interactive flashcards, quizzes, and personalized learning paths to help you become an expert trader
            </p>
            
            {isAuthenticated && (
              <p className="text-cyan mb-4">Welcome back! We've saved your progress.</p>
            )}
            
            {/* Stats summary */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="premium-card rounded-lg px-5 py-3 flex items-center">
                <CheckCircle className="text-cyan h-5 w-5 mr-3" />
                <span className="text-base">{stats.completedCount}/{stats.totalModules} Modules</span>
              </div>
              
              <div className="premium-card rounded-lg px-5 py-3 flex items-center">
                <Trophy className="text-cyan h-5 w-5 mr-3" />
                <span className="text-base">{stats.quizzesTaken} Quizzes</span>
              </div>
              
              <div className="premium-card rounded-lg px-5 py-3 flex items-center">
                <Award className="text-cyan h-5 w-5 mr-3" />
                <span className="text-base">{stats.badgesEarned} Badges</span>
              </div>
              
              {stats.averageScore > 0 && (
                <div className="premium-card rounded-lg px-5 py-3 flex items-center">
                  <Brain className="text-cyan h-5 w-5 mr-3" />
                  <span className="text-base">{stats.averageScore}% Score</span>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Progress tracker */}
        <ProgressTracker progress={progress} earnedBadges={earnedBadges} />
        
        {/* Leaderboard */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Top Learners</h2>
          <Leaderboard />
        </section>
        
        {/* Level tabs */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Learning Paths</h2>
          <Tabs defaultValue={currentLevel} onValueChange={handleLevelChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basics" className="flex gap-2 items-center py-3">
                <BookOpen className="h-4 w-4" />
                <span>Basics</span>
              </TabsTrigger>
              <TabsTrigger value="intermediate" className="flex gap-2 items-center py-3">
                <Brain className="h-4 w-4" />
                <span>Intermediate</span>
              </TabsTrigger>
              <TabsTrigger value="pro" className="flex gap-2 items-center py-3">
                <Infinity className="h-4 w-4" />
                <span>Pro</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics">
              <div className="premium-card p-6 md:p-8 mb-8">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-cyan mr-3" />
                  <h2 className="text-xl md:text-2xl font-bold">Trading Basics</h2>
                </div>
                <p className="text-gray-300 text-base mb-6">
                  Master the fundamentals of trading, market mechanics, and essential terminology. Perfect for beginners.
                </p>
                <div className="flex items-center text-base text-gray-300 mb-3">
                  <CheckCircle className="h-5 w-5 text-cyan mr-2" />
                  <span>{completedModules.basics} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2.5 mb-6">
                  <div className="bg-cyan h-2.5 rounded-full transition-all duration-500" style={{ width: `${(completedModules.basics / 15) * 100}%` }}></div>
                </div>
                <LevelBadges level="basics" earnedBadges={earnedBadges} />
              </div>
              
              <ModuleList 
                level="basics" 
                currentModule={currentModule} 
                completedModules={completedModules.basics}
                onLaunchQuiz={handleLaunchQuiz}
              />
            </TabsContent>
            
            <TabsContent value="intermediate">
              <div className="premium-card p-6 md:p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Brain className="h-6 w-6 text-cyan mr-3" />
                  <h2 className="text-xl md:text-2xl font-bold">Intermediate Trading</h2>
                </div>
                <p className="text-gray-300 text-base mb-6">
                  Advanced trading strategies, technical analysis, and risk management techniques.
                </p>
                <div className="flex items-center text-base text-gray-300 mb-3">
                  <CheckCircle className="h-5 w-5 text-cyan mr-2" />
                  <span>{completedModules.intermediate} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2.5 mb-6">
                  <div className="bg-cyan h-2.5 rounded-full transition-all duration-500" style={{ width: `${(completedModules.intermediate / 15) * 100}%` }}></div>
                </div>
                <LevelBadges level="intermediate" earnedBadges={earnedBadges} />
              </div>
              
              <ModuleList 
                level="intermediate" 
                currentModule={currentModule} 
                completedModules={completedModules.intermediate}
                onLaunchQuiz={handleLaunchQuiz}
              />
            </TabsContent>
            
            <TabsContent value="pro">
              <div className="premium-card p-6 md:p-8 mb-8">
                <div className="flex items-center mb-4">
                  <Infinity className="h-6 w-6 text-cyan mr-3" />
                  <h2 className="text-xl md:text-2xl font-bold">Professional Algo Trading</h2>
                </div>
                <p className="text-gray-300 text-base mb-6">
                  Algorithmic trading, quantitative analysis, and automated strategy development and optimization.
                </p>
                <div className="flex items-center text-base text-gray-300 mb-3">
                  <CheckCircle className="h-5 w-5 text-cyan mr-2" />
                  <span>{completedModules.pro} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2.5 mb-6">
                  <div className="bg-cyan h-2.5 rounded-full transition-all duration-500" style={{ width: `${(completedModules.pro / 15) * 100}%` }}></div>
                </div>
                <LevelBadges level="pro" earnedBadges={earnedBadges} />
              </div>
              
              <ModuleList 
                level="pro" 
                currentModule={currentModule} 
                completedModules={completedModules.pro}
                onLaunchQuiz={handleLaunchQuiz}
              />
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Current flashcard */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Current Study Material</h2>
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyan/40 text-cyan hover:bg-cyan/10" 
              onClick={() => handleLaunchQuiz(currentModule)}
            >
              Take Quiz <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <FlashCard />
        </section>
      </main>
      
      {currentModuleData && (
        <QuizModal
          open={quizModalOpen}
          onOpenChange={setQuizModalOpen}
          quiz={currentModuleData.quiz}
          moduleTitle={currentModuleData.title}
          moduleId={activeQuizModule}
          autoLaunch={!!autoLaunchQuiz}
        />
      )}
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Learn;
