
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Question, AnswerResult } from './types';

interface QuizQuestionProps {
  currentQuestion: Question;
  current: number;
  questionsLength: number;
  selected: string | null;
  result: AnswerResult | null;
  onSelect: (option: string) => void;
  onNext: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  currentQuestion,
  current,
  questionsLength,
  selected,
  result,
  onSelect,
  onNext,
}) => {
  const progress = ((current + 1) / questionsLength) * 100;

  return (
    <Card className="glass-card p-8 max-w-2xl mx-auto rounded-3xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            Question {current + 1} of {questionsLength}
          </span>
          <span className="text-sm text-cyan">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 w-full bg-[#121212] rounded-full" />
      </div>

      <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
      
      <div className="space-y-3 mb-6">
        {Array.isArray(currentQuestion.options) && currentQuestion.options.map((opt, idx) => (
          <Button
            key={idx}
            variant="outline"
            className={`w-full justify-start rounded-full text-left p-4 transition-all duration-300 
              ${selected === opt && result?.is_correct
                ? 'border-cyan bg-cyan/10 text-cyan'
                : selected === opt && !result?.is_correct
                ? 'border-red-500 bg-red-500/10 text-red-500'
                : 'bg-[#121212] border-cyan/30 text-white hover:bg-cyan/10 hover:border-cyan'
              }`}
            onClick={() => onSelect(opt)}
            disabled={selected !== null}
          >
            {selected === opt && (
              result?.is_correct ?
                <CheckCircle2 className="h-5 w-5 mr-2 inline text-cyan" /> :
                <XCircle className="h-5 w-5 mr-2 inline text-red-500" />
            )}
            {opt}
          </Button>
        ))}
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-full bg-[#121212]/50 space-y-4">
          <p>
            <span className="font-semibold text-cyan">Explanation:</span>{' '}
            <span className="text-gray-300">{result.explanation}</span>
          </p>
          <p>
            <span className="font-semibold text-cyan">Example:</span>{' '}
            <span className="text-gray-300">{result.example}</span>
          </p>
        </div>
      )}

      {selected && (
        <div className="mt-6 text-right">
          <Button
            onClick={onNext}
            className="bg-cyan text-[#121212] hover:bg-cyan/90 rounded-full"
          >
            {current < questionsLength - 1 ? (
              <>
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Complete Quiz'
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default QuizQuestion;
