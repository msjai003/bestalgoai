
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
    <div className="flex justify-between gap-2">
      <Button 
        variant="secondary" 
        size="sm"
        onClick={onPrevious} 
        disabled={isFirstQuestion}
        className="flex-1"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </Button>
      <Button 
        size="sm"
        onClick={onNext} 
        disabled={!isAnswered}
        className="flex-1 bg-cyan text-charcoalPrimary hover:bg-cyan/90"
      >
        <span>{isLastQuestion ? "Finish" : "Next"}</span>
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuizNavigation;
