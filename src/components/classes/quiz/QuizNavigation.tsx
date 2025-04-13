
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isAnswered: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  isFirstQuestion,
  isLastQuestion,
  isAnswered,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex justify-between gap-3">
      <Button 
        variant="secondary" 
        size="md"
        onClick={onPrevious} 
        disabled={isFirstQuestion}
        className="flex-1"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </Button>
      <Button 
        variant="default"
        size="md"
        onClick={onNext} 
        disabled={!isAnswered}
        className="flex-1"
      >
        <span>{isLastQuestion ? "Finish" : "Next"}</span>
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuizNavigation;
