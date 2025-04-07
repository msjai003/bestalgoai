
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: string;
  answer: string;
}

const QuestionCard = ({ question, answer }: QuestionCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn(
        "relative w-full border border-gray-800 rounded-xl bg-charcoalSecondary p-6 h-56 mb-4 cursor-pointer transition-all duration-300 transform perspective-1000",
        isFlipped ? "shadow-lg shadow-cyan/5" : "hover:shadow-md"
      )}
      onClick={handleClick}
    >
      <div 
        className={cn(
          "absolute inset-0 w-full h-full backface-hidden transition-all duration-500 ease-in-out p-6 flex flex-col justify-center",
          isFlipped ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
        )}
      >
        <h3 className="text-xl font-semibold text-white mb-2">{question}</h3>
        <p className="text-gray-400 text-sm">Click to reveal answer</p>
      </div>
      <div 
        className={cn(
          "absolute inset-0 w-full h-full backface-hidden transition-all duration-500 ease-in-out p-6 flex flex-col justify-center bg-charcoalSecondary border border-cyan/20 rounded-xl",
          isFlipped ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0"
        )}
      >
        <p className="text-white">{answer}</p>
        <p className="text-gray-400 text-sm mt-4">Click to go back to question</p>
      </div>
    </div>
  );
};

export default QuestionCard;
