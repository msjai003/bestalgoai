
import React from 'react';
import { Card } from '@/components/ui/card';
import QuizOption from './QuizOption';
import QuizNavigation from './QuizNavigation';
import { QuizQuestion } from '@/components/classes/ProQuiz';

interface QuizQuestionCardProps {
  currentQuestion: QuizQuestion;
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  questions: QuizQuestion[];
  onOptionSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  getCorrectOptionIndex: (correctAnswer: string) => number;
  getOptionLabel: (index: number) => string;
}

const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  currentQuestion,
  currentQuestionIndex,
  selectedOption,
  isAnswered,
  questions,
  onOptionSelect,
  onPrevious,
  onNext,
  getCorrectOptionIndex,
  getOptionLabel
}) => {
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const correctOptionIndex = getCorrectOptionIndex(currentQuestion.correctAnswer);

  return (
    <Card className="bg-charcoalSecondary rounded-xl p-5 border border-gray-800/40">
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-1">
          Question {currentQuestionIndex + 1}
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <QuizOption
              key={index}
              option={option}
              index={index}
              selected={selectedOption === index}
              isCorrect={isAnswered ? index === correctOptionIndex : null}
              isAnswered={isAnswered}
              onSelect={() => onOptionSelect(index)}
              getOptionLabel={getOptionLabel}
            />
          ))}
        </div>
      </div>
      
      <QuizNavigation
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        isAnswered={isAnswered}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </Card>
  );
};

export default QuizQuestionCard;
