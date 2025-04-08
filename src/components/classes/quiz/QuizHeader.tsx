
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  progress
}) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Professional Algo Trading Quiz</h2>
      
      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
        <div>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>
      
      <Progress value={progress} className="h-1 w-full bg-charcoalPrimary mb-4" />
    </>
  );
};

export default QuizHeader;
