
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Lock, Share } from 'lucide-react';
import { useEducation } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';
import { Level } from '@/hooks/useEducation';
import { useToast } from '@/hooks/use-toast';

interface ModuleListProps {
  level: Level;
  currentModule: string;
  completedModules: number;
}

export const ModuleList = ({ level, currentModule, completedModules }: ModuleListProps) => {
  const { selectModule } = useEducation();
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module, index) => {
        const isCompleted = index < completedModules;
        const isLocked = index > completedModules;
        const isActive = module.id === currentModule;
        
        return (
          <Card 
            key={module.id}
            className={`premium-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
              isActive ? 'border-cyan/50' : ''
            }`}
          >
            {isActive && (
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan"></div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-cyan mr-2" />
                  ) : isLocked ? (
                    <Lock className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-cyan mr-2" />
                  )}
                  <h4 className="font-medium">Module {index + 1}</h4>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-1 rounded-full">Completed</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 p-1"
                      onClick={() => handleShare(module.title)}
                    >
                      <Share className="h-3 w-3 text-gray-400 hover:text-cyan" />
                    </Button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{module.description}</p>
              <div className="text-xs text-gray-400 mb-3">{module.flashcards.length} flashcards • {module.estimatedTime} min</div>
              
              <Button 
                variant={isActive ? "default" : isLocked ? "secondary" : "outline"}
                className={`w-full ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isLocked && selectModule(module.id)}
                disabled={isLocked}
              >
                {isActive ? 'Currently Studying' : isLocked ? 'Locked' : 'Start Learning'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
