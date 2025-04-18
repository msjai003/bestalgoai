
import React from 'react';
import { Card } from '@/components/ui/card';
import QuizOption from './QuizOption';
import QuizNavigation from './QuizNavigation';
import { QuizQuestion } from '@/components/classes/ProQuiz';
import { cn } from '@/lib/utils';

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
    <Card className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-800/40 shadow-lg">
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
          <span>Question {currentQuestionIndex + 1}</span>
          <span className="text-cyan">{currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">{currentQuestion.question}</h3>
        
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
      
      {isAnswered && currentQuestion.explanation && (
        <div className={cn(
          "p-4 rounded-lg mb-6 transition-all duration-300",
          selectedOption === correctOptionIndex 
            ? "bg-green-900/20 border border-green-500/30"
            : "bg-red-900/20 border border-red-500/30"
        )}>
          <p className="text-sm text-gray-100 mb-2">
            <span className="font-semibold text-cyan">Explanation:</span> {currentQuestion.explanation}
          </p>
          {currentQuestion.example && (
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-cyan">Example:</span> {currentQuestion.example}
            </p>
          )}
        </div>
      )}
      
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

