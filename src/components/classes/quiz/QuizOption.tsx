
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface QuizOptionProps {
  option: string;
  index: number;
  selected: boolean;
  isCorrect: boolean | null;
  isAnswered: boolean;
  onSelect: () => void;
  getOptionLabel: (index: number) => string;
}

const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  index,
  selected,
  isCorrect,
  isAnswered,
  onSelect,
  getOptionLabel
}) => {
  const isCorrectOption = isCorrect === true;
  const isIncorrectSelected = selected && isCorrect === false;

  return (
    <div 
      onClick={onSelect}
      className="w-full cursor-pointer"
    >
      <Card 
        className={`p-4 border transition-colors ${
          selected 
            ? isCorrectOption
              ? 'bg-green-900/30 border-green-500'
              : 'bg-red-900/30 border-red-500'
            : 'bg-charcoalPrimary border-gray-700 hover:border-gray-500'
        }`}
      >
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
            selected 
              ? isCorrectOption
                ? 'border-green-500 bg-green-500/20' 
                : 'border-red-500 bg-red-500/20'
              : 'border-gray-500'
          }`}>
            <span className="font-medium text-sm">{getOptionLabel(index)}</span>
          </div>
          <span>{option}</span>
          
          {isAnswered && (
            <div className="ml-auto">
              {isCorrectOption && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {isIncorrectSelected && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizOption;
