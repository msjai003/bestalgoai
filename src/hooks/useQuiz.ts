
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export const useQuiz = () => {
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuizModule, setActiveQuizModule] = useState<string>('');
  
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  const handleLaunchQuiz = (startQuiz: () => void, moduleId: string) => {
    try {
      // If already loading, prevent multiple clicks
      if (isLoadingQuiz) return;
      
      setIsLoadingQuiz(true);
      setActiveQuizModule(moduleId);
      startQuiz();
      
      // Add a timeout to ensure data is loaded
      setTimeout(() => {
        try {
          setQuizModalOpen(true);
        } catch (error) {
          console.error("Error opening quiz modal:", error);
          toast({
            title: "Error",
            description: "Failed to open quiz. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingQuiz(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error in handleLaunchQuiz:", error);
      toast({
        title: "Error launching quiz",
        description: "There was a problem starting the quiz. Please try again.",
        variant: "destructive"
      });
      setIsLoadingQuiz(false);
    }
  };
  
  return {
    isLoadingQuiz,
    quizModalOpen,
    setQuizModalOpen,
    activeQuizModule,
    setActiveQuizModule,
    handleLaunchQuiz,
    triggerCelebration
  };
};
