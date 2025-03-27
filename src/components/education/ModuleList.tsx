
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Lock, Share, Clock, Award, X } from 'lucide-react';
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
}

export const ModuleList = ({ level, currentModule, completedModules, onLaunchQuiz }: ModuleListProps) => {
  const { selectModule, getModuleStatus, moduleProgress, quizResults } = useEducation();
  const { toast } = useToast();
  const modules = educationData[level];
  
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module, index) => {
        const { isCompleted, isLocked, isActive } = getModuleStatus(module.id, index);
        const quizResult = quizResults[module.id];
        
        return (
          <Card 
            key={module.id}
            className={cn(
              "premium-card hover:shadow-xl transition-all duration-300 relative overflow-hidden",
              isActive ? "border-cyan/50 hover:-translate-y-1" : "",
              isLocked ? "opacity-70" : "",
              isCompleted ? "border-green-500/30" : ""
            )}
          >
            {isActive && (
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan"></div>
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
                    <BookOpen className="h-5 w-5 text-cyan mr-2" />
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
                    <Badge variant="outline" className="text-xs text-cyan">In Progress</Badge>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{module.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
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
                    isLocked ? 'opacity-50 cursor-not-allowed' : ''
                  )}
                  onClick={() => !isLocked && selectModule(module.id)}
                  disabled={isLocked}
                >
                  {isActive ? 'Continue' : isLocked ? 'Locked' : isCompleted ? 'Review' : 'Start'}
                </Button>
                
                <Button 
                  variant={isCompleted ? "outline" : "secondary"}
                  size="sm"
                  className={cn(
                    "w-full",
                    isLocked || (!isCompleted && !isActive) ? 'opacity-50 cursor-not-allowed' : '',
                    quizResult?.passed ? 'border-green-500 text-green-500 hover:bg-green-500/10' : ''
                  )}
                  onClick={() => !isLocked && onLaunchQuiz(module.id)}
                  disabled={isLocked || (!isCompleted && !isActive)}
                >
                  {quizResult?.passed ? 'Retake Quiz' : quizResult ? 'Try Again' : 'Take Quiz'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
