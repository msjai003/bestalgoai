
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <button 
      onClick={onSelect}
      disabled={isAnswered}
      className="w-full text-left"
    >
      <Card 
        className={cn(
          "p-4 border transition-all duration-300 hover:border-cyan/50 group",
          selected 
            ? isCorrectOption
              ? "bg-green-900/20 border-green-500"
              : "bg-red-900/20 border-red-500"
            : "bg-[#1A1A1A] border-gray-700 hover:bg-[#1A1A1A]/80",
          !isAnswered && "cursor-pointer hover:scale-[1.02] hover:shadow-lg"
        )}
      >
        <div className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center mr-3 transition-colors",
            selected 
              ? isCorrectOption
                ? "border-green-500 bg-green-500/20" 
                : "border-red-500 bg-red-500/20"
              : "border-cyan bg-cyan/10 group-hover:bg-cyan/20"
          )}>
            <span className="font-medium text-sm text-cyan">{getOptionLabel(index)}</span>
          </div>
          <span className={cn(
            "text-gray-200 group-hover:text-white transition-colors",
            selected && "font-medium"
          )}>{option}</span>
          
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
    </button>
  );
};

export default QuizOption;

