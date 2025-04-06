
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Infinity, RefreshCcw, Loader, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModuleList } from '@/components/education/ModuleList';
import { LevelBadges } from '@/components/education/LevelBadges';
import { Level, Badge as BadgeType } from '@/hooks/useEducation';
import { useTheme } from '@/contexts/ThemeContext';

const levelDescriptions = {
  basics: "Master the fundamentals of trading, market mechanics, and essential terminology to build a solid foundation for your trading journey.",
  intermediate: "Advanced trading strategies, technical analysis, and risk management techniques to elevate your trading skills to the next level.",
  pro: "Professional algorithmic trading, quantitative analysis, and automated strategy development for sophisticated market participation."
};

interface AcademyLevelTabsProps {
  currentLevel: Level;
  onLevelChange: (level: Level) => void;
  completedModules: {
    basics: number;
    intermediate: number;
    pro: number;
  };
  earnedBadges: BadgeType[];
  aiModulesLoading: boolean;
  regenerateModules: () => void;
  regenerating: boolean;
  currentModule: string;
  modules: any[];
  bookmarkedModules: Record<string, boolean>;
  onToggleBookmark: (moduleId: string) => void;
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
  bookmarkedModules,
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
        </div>
        
        {aiModulesLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className={`animate-spin h-8 w-8 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />
            <span>Loading AI-enhanced modules...</span>
          </div>
        ) : (
          <>
            <TabsContent value="basics">
              <LevelInfo 
                level="basics" 
                description={levelDescriptions.basics}
                completedModules={completedModules.basics}
                earnedBadges={earnedBadges}
                isDarkMode={isDarkMode}
              />
              
              <ModuleList 
                level={currentLevel} 
                currentModule={currentModule} 
                completedModules={completedModules[currentLevel]}
                onLaunchQuiz={onLaunchQuiz}
                modules={modules.length > 0 ? modules : undefined}
                bookmarkedModules={bookmarkedModules}
                onToggleBookmark={onToggleBookmark}
                isDarkMode={isDarkMode}
              />
            </TabsContent>
            
            <TabsContent value="intermediate">
              <LevelInfo 
                level="intermediate" 
                description={levelDescriptions.intermediate}
                completedModules={completedModules.intermediate}
                earnedBadges={earnedBadges}
                isDarkMode={isDarkMode}
              />
              
              <ModuleList 
                level={currentLevel} 
                currentModule={currentModule} 
                completedModules={completedModules[currentLevel]}
                onLaunchQuiz={onLaunchQuiz}
                modules={modules.length > 0 ? modules : undefined}
                bookmarkedModules={bookmarkedModules}
                onToggleBookmark={onToggleBookmark}
                isDarkMode={isDarkMode}
              />
            </TabsContent>
            
            <TabsContent value="pro">
              <LevelInfo 
                level="pro" 
                description={levelDescriptions.pro}
                completedModules={completedModules.pro}
                earnedBadges={earnedBadges}
                isDarkMode={isDarkMode}
              />
              
              <ModuleList 
                level={currentLevel} 
                currentModule={currentModule} 
                completedModules={completedModules[currentLevel]}
                onLaunchQuiz={onLaunchQuiz}
                modules={modules.length > 0 ? modules : undefined}
                bookmarkedModules={bookmarkedModules}
                onToggleBookmark={onToggleBookmark}
                isDarkMode={isDarkMode}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </section>
  );
};

interface LevelInfoProps {
  level: Level;
  description: string;
  completedModules: number;
  earnedBadges: BadgeType[];
  isDarkMode: boolean;
}

const LevelInfo: React.FC<LevelInfoProps> = ({ level, description, completedModules, earnedBadges, isDarkMode }) => {
  const getLevelIcon = () => {
    switch (level) {
      case 'basics':
        return <BookOpen className={`h-5 w-5 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />;
      case 'intermediate':
        return <Brain className={`h-5 w-5 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />;
      case 'pro':
        return <Infinity className={`h-5 w-5 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2`} />;
    }
  };
  
  const getLevelTitle = () => {
    switch (level) {
      case 'basics':
        return 'Trading Basics';
      case 'intermediate':
        return 'Intermediate Trading';
      case 'pro':
        return 'Professional Algo Trading';
    }
  };
  
  return (
    <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-5 mb-6 shadow-md transition-all duration-300`}>
      <div className="flex items-center mb-3">
        {getLevelIcon()}
        <h2 className="text-lg font-bold">{getLevelTitle()}</h2>
      </div>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
        {description}
      </p>
      <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
        <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-1`} />
        <span>{completedModules} of 15 modules completed</span>
      </div>
      <div className={`w-full ${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-100'} rounded-full h-2 mb-4`}>
        <div className={`${isDarkMode ? 'bg-cyan' : 'bg-blue-500'} h-2 rounded-full transition-all duration-700 ease-in-out`} style={{ width: `${(completedModules / 15) * 100}%` }}></div>
      </div>
      <LevelBadges level={level} earnedBadges={earnedBadges} />
    </div>
  );
};
