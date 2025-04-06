
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Lock, Share, Clock, Award, X, Loader, Bookmark, BookmarkCheck } from 'lucide-react';
import { useEducation } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';
import { Level } from '@/hooks/useEducation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ModuleListProps {
  level: Level;
  currentModule: string;
  completedModules: number;
  onLaunchQuiz: (moduleId: string) => void;
  modules?: any[]; // Optional modules to override the default ones
  bookmarkedModules?: Record<string, boolean>;
  onToggleBookmark?: (moduleId: string) => void;
  isDarkMode?: boolean;
}

export const ModuleList = ({ 
  level, 
  currentModule, 
  completedModules, 
  onLaunchQuiz, 
  modules,
  bookmarkedModules = {},
  onToggleBookmark,
  isDarkMode = true
}: ModuleListProps) => {
  const { selectModule, getModuleStatus, moduleProgress, quizResults } = useEducation();
  const { toast } = useToast();
  const [loadingQuizModule, setLoadingQuizModule] = React.useState<string | null>(null);
  const moduleSource = modules || educationData[level];
  
  const handleShare = (moduleTitle: string) => {
    const shareText = `I'm learning about "${moduleTitle}" in the Trading Academy! Join me to master trading from basics to pro.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join me in Trading Academy',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Share text copied!",
        description: "Share text copied to clipboard. Paste it to share with friends!",
      });
    });
  };
  
  const formatSeconds = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins}m`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m`;
    }
  };
  
  const handleQuizClick = (moduleId: string) => {
    if (loadingQuizModule) return; // Prevent multiple clicks during loading
    
    setLoadingQuizModule(moduleId);
    
    // Call onLaunchQuiz with a slight delay to show loading state
    setTimeout(() => {
      try {
        onLaunchQuiz(moduleId);
      } catch (error) {
        console.error("Error launching quiz:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz. Please try again.",
          variant: "destructive"
        });
      } finally {
        // Always clear loading state, even if there was an error
        setLoadingQuizModule(null);
      }
    }, 500);
  };
  
  const isBookmarked = (moduleId: string) => bookmarkedModules[moduleId] || false;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {moduleSource.map((module, index) => {
        const { isCompleted, isLocked, isActive } = getModuleStatus(module.id, index);
        const quizResult = quizResults[module.id];
        const isLoadingQuiz = loadingQuizModule === module.id;
        const bookmarked = isBookmarked(module.id);
        
        return (
          <Card 
            key={module.id}
            className={cn(
              "premium-card hover:shadow-xl transition-all duration-300 relative overflow-hidden",
              isActive ? `border-${isDarkMode ? 'cyan' : 'blue-500'}/50 hover:-translate-y-1` : "",
              isLocked ? "opacity-70" : "",
              isCompleted ? "border-green-500/30" : "",
              isDarkMode ? "bg-charcoalSecondary text-white" : "bg-white text-gray-800"
            )}
          >
            {isActive && (
              <div className={`absolute top-0 left-0 w-1 h-full bg-${isDarkMode ? 'cyan' : 'blue-500'}`}></div>
            )}
            {isCompleted && (
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : isLocked ? (
                    <Lock className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <BookOpen className={`h-5 w-5 text-${isDarkMode ? 'cyan' : 'blue-500'} mr-2`} />
                  )}
                  <h4 className="font-medium">Module {index + 1}</h4>
                </div>
                <div className="flex items-center gap-1">
                  {isCompleted && (
                    <>
                      <Badge variant="success" className="text-xs">Completed</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 p-1"
                        onClick={() => handleShare(module.title)}
                      >
                        <Share className="h-3 w-3 text-gray-400 hover:text-cyan" />
                      </Button>
                    </>
                  )}
                  {!isCompleted && isActive && (
                    <Badge variant="outline" className={`text-xs text-${isDarkMode ? 'cyan' : 'blue-500'}`}>In Progress</Badge>
                  )}
                  {onToggleBookmark && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 p-1"
                      onClick={() => onToggleBookmark(module.id)}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="h-3 w-3 text-yellow-400" />
                      ) : (
                        <Bookmark className="h-3 w-3 text-gray-400 hover:text-yellow-400" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>{module.description}</p>
              
              <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                <div className="flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  <span>{module.flashcards.length} flashcards</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>~{module.estimatedTime} min</span>
                </div>
              </div>
              
              {/* Quiz stats if completed */}
              {quizResult && (
                <div className={`mb-3 p-2 rounded text-xs ${
                  quizResult.passed ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {quizResult.passed ? (
                        <Award className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      <span>Quiz: {quizResult.score}/{quizResult.totalQuestions}</span>
                    </div>
                    <div>
                      {formatSeconds(quizResult.timeSpent)}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button 
                  variant={isActive ? "default" : isLocked ? "secondary" : "outline"}
                  size="sm"
                  className={cn(
                    "w-full", 
                    isLocked ? 'opacity-50 cursor-not-allowed' : '',
                    isDarkMode ? 
                      (isActive ? 'bg-cyan text-charcoalPrimary' : '') : 
                      (isActive ? 'bg-blue-500 text-white' : '')
                  )}
                  onClick={() => !isLocked && selectModule(module.id)}
                  disabled={isLocked || isLoadingQuiz}
                >
                  {isActive ? 'Continue' : isLocked ? 'Locked' : isCompleted ? 'Review' : 'Start'}
                </Button>
                
                <Button 
                  variant={isCompleted ? "outline" : "secondary"}
                  size="sm"
                  className={cn(
                    "w-full",
                    isLocked || (!isCompleted && !isActive) ? 'opacity-50 cursor-not-allowed' : '',
                    quizResult?.passed ? 'border-green-500 text-green-500 hover:bg-green-500/10' : '',
                    isLoadingQuiz ? 'cursor-not-allowed opacity-80' : '',
                    !isDarkMode && !isCompleted && !isLocked && isActive ? 'bg-gray-100 text-gray-700 border border-gray-300' : ''
                  )}
                  onClick={() => !isLocked && !isLoadingQuiz && handleQuizClick(module.id)}
                  disabled={isLocked || (!isCompleted && !isActive) || isLoadingQuiz}
                >
                  {isLoadingQuiz ? (
                    <>
                      <Loader className="h-3 w-3 mr-1 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : quizResult?.passed ? (
                    'Retake Quiz'
                  ) : quizResult ? (
                    'Try Again'
                  ) : (
                    'Take Quiz'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
