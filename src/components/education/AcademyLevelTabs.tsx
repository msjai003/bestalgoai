
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Infinity, RefreshCw, Loader } from 'lucide-react';
import { ModuleList } from '@/components/education/ModuleList';
import { LevelBadges } from '@/components/education/LevelBadges';
import { Level } from '@/hooks/useEducation';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AcademyLevelTabsProps {
  currentLevel: Level;
  onLevelChange: (level: Level) => void;
  completedModules: { basics: number; intermediate: number; pro: number };
  earnedBadges: any[];
  aiModulesLoading: boolean;
  regenerateModules: () => void;
  regenerating: boolean;
  currentModule: string;
  modules: any[];
  bookmarkedModules?: Record<string, boolean>;
  onToggleBookmark?: (moduleId: string) => void;
  onLaunchQuiz: (moduleId: string) => void;
}

export const AcademyLevelTabs: React.FC<AcademyLevelTabsProps> = ({
  currentLevel,
  onLevelChange,
  completedModules,
  earnedBadges,
  aiModulesLoading,
  regenerateModules,
  regenerating,
  currentModule,
  modules,
  bookmarkedModules = {},
  onToggleBookmark,
  onLaunchQuiz
}) => {
  const { isDarkMode } = useTheme();
  
  const handleLevelChange = (value: string) => {
    onLevelChange(value as Level);
  };
  
  return (
    <section className="mb-8">
      <Tabs defaultValue={currentLevel} onValueChange={handleLevelChange} className="w-full">
        <div className="flex items-center justify-between mb-3">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4 bg-charcoalSecondary border border-gray-800/40">
            <TabsTrigger value="basics" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Basics</span>
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Intermediate</span>
            </TabsTrigger>
            <TabsTrigger value="pro" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
              <Infinity className="h-4 w-4" />
              <span className="hidden sm:inline">Pro</span>
            </TabsTrigger>
          </TabsList>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex items-center gap-1 border-cyan/30 text-cyan hover:bg-cyan/10"
                onClick={regenerateModules}
                disabled={regenerating || aiModulesLoading}
              >
                {regenerating ? (
                  <Loader className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                )}
                <span>Regenerate AI Content</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate fresh AI-enhanced content based on your current learning profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <TabsContent value="basics">
          <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-5 mb-6`}>
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 text-cyan mr-2" />
              <h2 className="text-lg font-bold">Trading Basics</h2>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
              Master the fundamentals of trading, market mechanics, and essential terminology with AI-personalized learning.
            </p>
            <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                <div className="bg-cyan h-2 rounded-full" style={{ width: `${(completedModules.basics / 15) * 100}%` }}></div>
              </div>
            </div>
            <LevelBadges level="basics" earnedBadges={earnedBadges} />
          </div>
          
          {aiModulesLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader className="h-8 w-8 text-cyan animate-spin mb-4" />
              <p className="text-gray-400">Generating personalized AI learning content...</p>
            </div>
          ) : (
            <ModuleList 
              level="basics" 
              currentModule={currentModule} 
              completedModules={completedModules.basics}
              onLaunchQuiz={onLaunchQuiz}
              modules={modules}
              bookmarkedModules={bookmarkedModules}
              onToggleBookmark={onToggleBookmark}
              isDarkMode={isDarkMode}
            />
          )}
        </TabsContent>
        
        <TabsContent value="intermediate">
          <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-5 mb-6`}>
            <div className="flex items-center mb-3">
              <Brain className="h-5 w-5 text-cyan mr-2" />
              <h2 className="text-lg font-bold">Intermediate Trading</h2>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
              Advanced trading strategies, technical analysis, and risk management with AI-tailored content.
            </p>
            <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                <div className="bg-cyan h-2 rounded-full" style={{ width: `${(completedModules.intermediate / 15) * 100}%` }}></div>
              </div>
            </div>
            <LevelBadges level="intermediate" earnedBadges={earnedBadges} />
          </div>
          
          {aiModulesLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader className="h-8 w-8 text-cyan animate-spin mb-4" />
              <p className="text-gray-400">Generating personalized AI learning content...</p>
            </div>
          ) : (
            <ModuleList 
              level="intermediate" 
              currentModule={currentModule} 
              completedModules={completedModules.intermediate}
              onLaunchQuiz={onLaunchQuiz}
              modules={modules}
              bookmarkedModules={bookmarkedModules}
              onToggleBookmark={onToggleBookmark}
              isDarkMode={isDarkMode}
            />
          )}
        </TabsContent>
        
        <TabsContent value="pro">
          <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-5 mb-6`}>
            <div className="flex items-center mb-3">
              <Infinity className="h-5 w-5 text-cyan mr-2" />
              <h2 className="text-lg font-bold">Professional Algo Trading</h2>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
              Algorithmic trading, quantitative analysis, and automated strategy development with AI customization.
            </p>
            <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-4">
                <div className="bg-cyan h-2 rounded-full" style={{ width: `${(completedModules.pro / 15) * 100}%` }}></div>
              </div>
            </div>
            <LevelBadges level="pro" earnedBadges={earnedBadges} />
          </div>
          
          {aiModulesLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader className="h-8 w-8 text-cyan animate-spin mb-4" />
              <p className="text-gray-400">Generating personalized AI learning content...</p>
            </div>
          ) : (
            <ModuleList 
              level="pro" 
              currentModule={currentModule} 
              completedModules={completedModules.pro}
              onLaunchQuiz={onLaunchQuiz}
              modules={modules}
              bookmarkedModules={bookmarkedModules}
              onToggleBookmark={onToggleBookmark}
              isDarkMode={isDarkMode}
            />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};
