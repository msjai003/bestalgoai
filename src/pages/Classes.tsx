
import React, { useState } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Infinity, Award, BarChart } from 'lucide-react';
import BasicQuestionsSection from '@/components/classes/BasicQuestionsSection';
import IntermediateQuestionsSection from '@/components/classes/IntermediateQuestionsSection';
import ProQuestionsSection from '@/components/classes/ProQuestionsSection';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Classes = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth');
  };

  // Mock user progress data
  const userProgress = {
    basic: 85,
    intermediate: 45,
    pro: 10,
    completedModules: 12,
    totalModules: 30,
    completedQuizzes: 8,
    totalQuizzes: 15,
    currentLevel: 3,
    experiencePoints: 750,
    nextLevelAt: 1000
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        {!user && (
          <div className="flex justify-end mb-4">
            <Button
              variant="logout"
              className="font-medium"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </div>
        )}
        
        {user && (
          <div className="bg-charcoalSecondary rounded-xl p-4 mb-6 border border-gray-800/40">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan" />
              Your Learning Progress
            </h2>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Level {userProgress.currentLevel}</span>
                <span>Level {userProgress.currentLevel + 1}</span>
              </div>
              <Progress value={(userProgress.experiencePoints / userProgress.nextLevelAt) * 100} className="h-2" />
              <p className="text-xs text-gray-400 mt-1">
                {userProgress.experiencePoints} / {userProgress.nextLevelAt} XP
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/70 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="h-4 w-4 text-cyan" />
                  <span className="text-sm">Module Progress</span>
                </div>
                <p className="text-xl font-bold">
                  {userProgress.completedModules}/{userProgress.totalModules}
                </p>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-cyan" />
                  <span className="text-sm">Quizzes Completed</span>
                </div>
                <p className="text-xl font-bold">
                  {userProgress.completedQuizzes}/{userProgress.totalQuizzes}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="my-4">
          <h1 className="text-2xl font-bold mb-4">Trading Classes</h1>
          <p className="text-gray-300">Explore our trading questions and answers to boost your knowledge</p>
        </div>
        
        <Tabs defaultValue="basic" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-charcoalSecondary border border-gray-800/40">
            <TabsTrigger value="basic" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary data-[state=active]:rounded-full">
              <BookOpen className="h-4 w-4" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary data-[state=active]:rounded-full">
              <Brain className="h-4 w-4" />
              <span>Intermediate</span>
            </TabsTrigger>
            <TabsTrigger value="pro" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary data-[state=active]:rounded-full">
              <Infinity className="h-4 w-4" />
              <span>Pro</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicQuestionsSection />
          </TabsContent>
          
          <TabsContent value="intermediate">
            <IntermediateQuestionsSection />
          </TabsContent>
          
          <TabsContent value="pro">
            <ProQuestionsSection />
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Classes;
