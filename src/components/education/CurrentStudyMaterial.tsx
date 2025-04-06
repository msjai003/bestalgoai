
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader } from 'lucide-react';
import { FlashCard } from '@/components/education/FlashCard';
import { useTheme } from '@/contexts/ThemeContext';

interface CurrentStudyMaterialProps {
  currentModule: string;
  onLaunchQuiz: (moduleId: string) => void;
  isLoadingQuiz: boolean;
}

export const CurrentStudyMaterial: React.FC<CurrentStudyMaterialProps> = ({
  currentModule,
  onLaunchQuiz,
  isLoadingQuiz
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Current Study Material</h2>
        <Button 
          className={`${isDarkMode ? 'bg-cyan text-charcoalPrimary hover:bg-cyan/90' : 'bg-blue-500 text-white hover:bg-blue-600'} text-xs flex items-center`} 
          size="sm" 
          onClick={() => onLaunchQuiz(currentModule)}
          disabled={isLoadingQuiz}
        >
          {isLoadingQuiz ? (
            <Loader className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 mr-1.5" />
          )}
          {isLoadingQuiz ? 'Loading...' : 'Take Quiz'}
        </Button>
      </div>
      
      <FlashCard />
    </section>
  );
};
