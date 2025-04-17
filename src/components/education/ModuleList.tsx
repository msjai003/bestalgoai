
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { educationData } from '@/data/educationData';
import { useEducation } from '@/hooks/useEducation';

interface ModuleListProps {
  level: 'basics' | 'intermediate' | 'pro';
  currentModule: string;
  completedModules: number;
  onLaunchQuiz: (moduleId: string) => void;
}

export const ModuleList = ({ level, currentModule, completedModules, onLaunchQuiz }: ModuleListProps) => {
  const { selectModule, getModuleStatus } = useEducation();
  const modules = educationData[level];
  
  return (
    <div className="space-y-3 mb-8">
      {modules.map((module, index) => {
        const { isCompleted, isLocked, isActive } = getModuleStatus(module.id, index);
        
        return (
          <Card 
            key={module.id}
            className={`p-4 module-item ${isActive ? 'current animated-glow' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="mr-3 text-2xl">{module.icon}</div>
                <div>
                  <h3 className="font-medium flex items-center">
                    {module.title}
                    {isCompleted && (
                      <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                    )}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-1">{module.description}</p>
                </div>
              </div>
              
              {isLocked ? (
                <div className="flex items-center text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-xs">Locked</span>
                </div>
              ) : (
                <div className="flex space-x-2">
                  {!isActive && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => selectModule(module.id)}
                    >
                      Study
                    </Button>
                  )}
                  
                  <Button 
                    size="sm"
                    className={`text-xs ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan hover:bg-cyan/90'} text-white flex items-center`}
                    onClick={() => onLaunchQuiz(module.id)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Quiz
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
