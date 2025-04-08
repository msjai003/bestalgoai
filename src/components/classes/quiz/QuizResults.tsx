
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onRestartQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  correctAnswers,
  totalQuestions,
  onRestartQuiz
}) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassed = correctAnswers / totalQuestions >= 0.7;

  return (
    <Card className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40">
      <h2 className="text-xl font-bold mb-4">Quiz Complete!</h2>
      <p className="mb-4">You scored {correctAnswers} out of {totalQuestions} questions correctly.</p>
      
      <div className="mb-6">
        <div className="text-4xl font-bold text-cyan my-2">
          {percentage}%
        </div>
        <Progress 
          value={percentage} 
          className="h-2 w-full bg-charcoalPrimary"
        />
      </div>
      
      {isPassed ? (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
          <p className="text-green-300 font-medium">
            Great job! You've passed this quiz.
          </p>
        </div>
      ) : (
        <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4 mb-6">
          <p className="text-orange-300">
            You need 70% to pass. Keep studying and try again!
          </p>
        </div>
      )}
      
      <Button 
        onClick={onRestartQuiz}
        className="bg-cyan text-charcoalPrimary hover:bg-cyan/90 w-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </Card>
  );
};

export default QuizResults;
