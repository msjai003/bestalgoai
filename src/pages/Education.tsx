
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
  ChevronRight, 
  Brain, 
  Lightbulb, 
  Infinity,
  ArrowRight,
  Award,
  Play,
  LogIn
} from 'lucide-react';
import { FlashCard } from '@/components/education/FlashCard';
import { ModuleList } from '@/components/education/ModuleList';
import { ProgressTracker } from '@/components/education/ProgressTracker';
import { LevelBadges } from '@/components/education/LevelBadges';
import { Leaderboard } from '@/components/education/Leaderboard';
import { QuizModal } from '@/components/education/QuizModal';
import { useEducation, Level } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Education = () => {
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
    setAutoLaunchQuiz
  } = useEducation();
  
  const { user } = useAuth();
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
      setActiveQuizModule(autoLaunchQuiz);
      setQuizModalOpen(true);
    }
  }, [autoLaunchQuiz]);
  
  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4 max-w-6xl mx-auto">
        {/* Hero section with improved button styling */}
        <section className="py-6 mb-4">
          <div className="bg-charcoalSecondary rounded-xl border border-gray-800/40 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <GraduationCap className="text-cyan mr-2 h-6 w-6" />
                <h2 className="text-cyan text-xl font-bold">Trading Academy</h2>
              </div>
              
              {!user && (
                <Link to="/auth">
                  <Button variant="gradient" size="sm" className="shadow-md">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              <span className="text-cyan">Master Trading</span> from Basics to Pro
            </h1>
            
            <p className="text-gray-300 mb-5 max-w-2xl">
              Interactive flashcards, quizzes, and personalized learning paths to help you become a trading professional.
            </p>
            
            {user ? (
              /* Stats summary for logged in users with button-like badges */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="bg-charcoalPrimary rounded-lg px-4 py-3 flex items-center justify-center border border-gray-800/40 hover:border-cyan/20 transition-colors">
                  <CheckCircle className="text-cyan h-5 w-5 mr-2" />
                  <span>{stats.completedCount}/{stats.totalModules} Modules</span>
                </div>
                
                <div className="bg-charcoalPrimary rounded-lg px-4 py-3 flex items-center justify-center border border-gray-800/40 hover:border-cyan/20 transition-colors">
                  <Trophy className="text-cyan h-5 w-5 mr-2" />
                  <span>{stats.quizzesTaken} Quizzes</span>
                </div>
                
                <div className="bg-charcoalPrimary rounded-lg px-4 py-3 flex items-center justify-center border border-gray-800/40 hover:border-cyan/20 transition-colors">
                  <Award className="text-cyan h-5 w-5 mr-2" />
                  <span>{stats.badgesEarned} Badges</span>
                </div>
                
                {stats.averageScore > 0 && (
                  <div className="bg-charcoalPrimary rounded-lg px-4 py-3 flex items-center justify-center border border-gray-800/40 hover:border-cyan/20 transition-colors">
                    <Brain className="text-cyan h-5 w-5 mr-2" />
                    <span>{stats.averageScore}% Score</span>
                  </div>
                )}
              </div>
            ) : (
              /* Call to action for non-logged in users */
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/auth?signup=true">
                  <Button className="bg-cyan text-charcoalPrimary hover:bg-cyan/90 shadow-lg">
                    Create Free Account
                  </Button>
                </Link>
                <Button variant="outline" className="border-white/20 hover:border-cyan/40 hover:text-cyan">
                  Explore Modules
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Current module and badges as buttons at the top */}
        {user && (
          <section className="mb-5 bg-charcoalSecondary rounded-xl border border-gray-800/40 p-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold flex items-center">
                <BookOpen className="text-cyan mr-2 h-5 w-5" />
                Current Module Progress
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  className="bg-cyan text-charcoalPrimary hover:bg-cyan/90 shadow-sm flex-1 sm:flex-none" 
                  size="sm"
                  onClick={() => handleLaunchQuiz(currentModule)}
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" /> Take Quiz
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-cyan/40 text-cyan hover:bg-cyan/10 flex-1 sm:flex-none"
                >
                  <Award className="h-3.5 w-3.5 mr-1.5" /> My Badges
                </Button>
              </div>
            </div>
            
            {/* Top badges row */}
            <div className="mb-4">
              <LevelBadges level={currentLevel} earnedBadges={earnedBadges} canShare={true} />
            </div>
          </section>
        )}
        
        {/* Progress tracker - only show if logged in */}
        {user && (
          <ProgressTracker progress={progress} earnedBadges={earnedBadges} />
        )}
        
        {/* Level tabs with improved styling */}
        <section className="mb-6">
          <Tabs defaultValue={currentLevel} onValueChange={handleLevelChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-charcoalSecondary border border-gray-800/40 shadow-md">
              <TabsTrigger value="basics" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
                <BookOpen className="h-4 w-4" />
                <span>Basics</span>
              </TabsTrigger>
              <TabsTrigger value="intermediate" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
                <Brain className="h-4 w-4" />
                <span>Intermediate</span>
              </TabsTrigger>
              <TabsTrigger value="pro" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
                <Infinity className="h-4 w-4" />
                <span>Pro</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics">
              <div className="bg-charcoalSecondary rounded-xl border border-gray-800/40 p-5 mb-6 shadow-md">
                <div className="flex items-center mb-3">
                  <BookOpen className="h-5 w-5 text-cyan mr-2" />
                  <h2 className="text-lg font-bold">Trading Basics</h2>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Master the fundamentals of trading, market mechanics, and essential terminology.
                </p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyan mr-1" />
                  <span>{completedModules.basics} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                  <div className="bg-cyan h-2 rounded-full animate-progress" style={{ width: `${(completedModules.basics / 15) * 100}%` }}></div>
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
              <div className="bg-charcoalSecondary rounded-xl border border-gray-800/40 p-5 mb-6 shadow-md">
                <div className="flex items-center mb-3">
                  <Brain className="h-5 w-5 text-cyan mr-2" />
                  <h2 className="text-lg font-bold">Intermediate Trading</h2>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Advanced trading strategies, technical analysis, and risk management techniques.
                </p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyan mr-1" />
                  <span>{completedModules.intermediate} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                  <div className="bg-cyan h-2 rounded-full animate-progress" style={{ width: `${(completedModules.intermediate / 15) * 100}%` }}></div>
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
              <div className="bg-charcoalSecondary rounded-xl border border-gray-800/40 p-5 mb-6 shadow-md">
                <div className="flex items-center mb-3">
                  <Infinity className="h-5 w-5 text-cyan mr-2" />
                  <h2 className="text-lg font-bold">Professional Algo Trading</h2>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Algorithmic trading, quantitative analysis, and automated strategy development.
                </p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyan mr-1" />
                  <span>{completedModules.pro} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                  <div className="bg-cyan h-2 rounded-full animate-progress" style={{ width: `${(completedModules.pro / 15) * 100}%` }}></div>
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
        
        {/* Current flashcard - if logged in */}
        {user && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Current Study Material</h2>
              <Button 
                className="bg-cyan text-charcoalPrimary hover:bg-cyan/90 text-xs flex items-center shadow-sm" 
                size="sm" 
                onClick={() => handleLaunchQuiz(currentModule)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Take Quiz
              </Button>
            </div>
            
            <div className="bg-charcoalSecondary rounded-xl border border-gray-800/40 p-5 shadow-md">
              <FlashCard />
            </div>
          </section>
        )}
        
        {/* Leaderboard section - show for all users */}
        <Leaderboard showSignupPrompt={!user} />
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
      
      <BottomNav />
    </div>
  );
};

export default Education;
