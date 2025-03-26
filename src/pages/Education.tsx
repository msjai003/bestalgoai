
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, Trophy, CheckCircle, Clock, ChevronRight, Brain, Lightbulb, Infinity } from 'lucide-react';
import { FlashCard } from '@/components/education/FlashCard';
import { ModuleList } from '@/components/education/ModuleList';
import { ProgressTracker } from '@/components/education/ProgressTracker';
import { LevelBadges } from '@/components/education/LevelBadges';
import { Leaderboard } from '@/components/education/Leaderboard';
import { QuizModal } from '@/components/education/QuizModal';
import { useEducation, Level } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';

const Education = () => {
  const { 
    currentLevel, 
    currentModule,
    setCurrentLevel,
    completedModules,
    earnedBadges,
    startQuiz,
    progress
  } = useEducation();
  
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  
  // Create a handler to safely cast the string to Level type
  const handleLevelChange = (value: string) => {
    setCurrentLevel(value as Level);
  };
  
  // Get current module data for the quiz
  const currentModuleData = educationData[currentLevel]?.find(m => m.id === currentModule);
  
  // Handle quiz start
  const handleStartQuiz = () => {
    startQuiz();
    setQuizModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      
      <main className="container mx-auto px-4 pb-20">
        {/* Hero section */}
        <section className="relative py-8 md:py-12 mb-6">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <GraduationCap className="text-cyan mr-2 h-7 w-7" />
              <h2 className="text-cyan text-xl font-bold">Trading Academy</h2>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              <span className="text-cyan">Master Trading</span> from Basics to Pro
            </h1>
            
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Interactive flashcards, quizzes, and personalized learning paths to help you become an expert trader
            </p>
          </div>
        </section>
        
        {/* Progress tracker */}
        <ProgressTracker progress={progress} earnedBadges={earnedBadges} />
        
        {/* Leaderboard */}
        <Leaderboard />
        
        {/* Level tabs */}
        <section className="mb-8">
          <Tabs defaultValue={currentLevel} onValueChange={handleLevelChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basics" className="flex gap-2 items-center">
                <BookOpen className="h-4 w-4" />
                <span>Basics</span>
              </TabsTrigger>
              <TabsTrigger value="intermediate" className="flex gap-2 items-center">
                <Brain className="h-4 w-4" />
                <span>Intermediate</span>
              </TabsTrigger>
              <TabsTrigger value="pro" className="flex gap-2 items-center">
                <Infinity className="h-4 w-4" />
                <span>Pro</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics">
              <div className="premium-card p-4 md:p-6 mb-6">
                <div className="flex items-center mb-3">
                  <BookOpen className="h-5 w-5 text-cyan mr-2" />
                  <h2 className="text-lg md:text-xl font-bold">Trading Basics</h2>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Master the fundamentals of trading, market mechanics, and essential terminology. Perfect for beginners.
                </p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyan mr-1" />
                  <span>{completedModules.basics} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                  <div className="bg-cyan h-2 rounded-full" style={{ width: `${(completedModules.basics / 15) * 100}%` }}></div>
                </div>
                <LevelBadges level="basics" earnedBadges={earnedBadges} />
              </div>
              
              <ModuleList level="basics" currentModule={currentModule} completedModules={completedModules.basics} />
            </TabsContent>
            
            <TabsContent value="intermediate">
              <div className="premium-card p-4 md:p-6 mb-6">
                <div className="flex items-center mb-3">
                  <Brain className="h-5 w-5 text-cyan mr-2" />
                  <h2 className="text-lg md:text-xl font-bold">Intermediate Trading</h2>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Advanced trading strategies, technical analysis, and risk management techniques.
                </p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyan mr-1" />
                  <span>{completedModules.intermediate} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                  <div className="bg-cyan h-2 rounded-full" style={{ width: `${(completedModules.intermediate / 15) * 100}%` }}></div>
                </div>
                <LevelBadges level="intermediate" earnedBadges={earnedBadges} />
              </div>
              
              <ModuleList level="intermediate" currentModule={currentModule} completedModules={completedModules.intermediate} />
            </TabsContent>
            
            <TabsContent value="pro">
              <div className="premium-card p-4 md:p-6 mb-6">
                <div className="flex items-center mb-3">
                  <Infinity className="h-5 w-5 text-cyan mr-2" />
                  <h2 className="text-lg md:text-xl font-bold">Professional Algo Trading</h2>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Algorithmic trading, quantitative analysis, and automated strategy development and optimization.
                </p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyan mr-1" />
                  <span>{completedModules.pro} of 15 modules completed</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                  <div className="bg-cyan h-2 rounded-full" style={{ width: `${(completedModules.pro / 15) * 100}%` }}></div>
                </div>
                <LevelBadges level="pro" earnedBadges={earnedBadges} />
              </div>
              
              <ModuleList level="pro" currentModule={currentModule} completedModules={completedModules.pro} />
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Current flashcard */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Current Study Material</h2>
            <Button 
              variant="outline" 
              className="text-xs border-cyan/40 text-cyan hover:bg-cyan/10" 
              onClick={handleStartQuiz}
            >
              Take Quiz <ChevronRight className="ml-1 h-3 w-3" />
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
        />
      )}
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Education;
