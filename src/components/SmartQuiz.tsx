
import React from 'react';
import { Card } from '@/components/ui/card';
import QuizQuestion from './quiz/QuizQuestion';
import QuizComplete from './quiz/QuizComplete';
import { useQuiz } from '@/hooks/useQuiz';

const SmartQuiz = () => {
  const {
    questions,
    current,
    selected,
    result,
    finalLevel,
    handleSelect,
    handleNext,
  } = useQuiz();

  if (finalLevel) {
    return <QuizComplete finalLevel={finalLevel} />;
  }

  if (questions.length === 0) {
    return (
      <Card className="glass-card p-8 text-center mt-10 max-w-xl mx-auto rounded-3xl">
        <p className="text-gray-400">Loading your assessment...</p>
      </Card>
    );
  }

  return (
    <QuizQuestion
      currentQuestion={questions[current]}
      current={current}
      questionsLength={questions.length}
      selected={selected}
      result={result}
      onSelect={handleSelect}
      onNext={handleNext}
    />
  );
};

export default SmartQuiz;
