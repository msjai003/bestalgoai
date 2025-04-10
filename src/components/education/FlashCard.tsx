
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { FlipCardActions } from './FlipCardActions';

interface FlashCardProps {
  question: string;
  answer: string;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrevious: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({
  question,
  answer,
  currentIndex,
  totalCount,
  onNext,
  onPrevious
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="mb-4">
      <p className="text-gray-400 mb-4">Question {currentIndex} of {totalCount}</p>
      
      <div className="perspective-1000 relative w-full">
        <div 
          className={`w-full transition-all duration-500 ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front side (Question) */}
          <div 
            className={`bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 shadow-lg backface-hidden ${isFlipped ? 'hidden' : 'block'}`}
          >
            <div className="mb-3">
              <span className="text-sm text-cyan">Basic • Question {currentIndex}</span>
              <h3 className="text-xl font-medium text-white mt-1 mb-4">Question</h3>
              <p className="text-white text-lg">{question}</p>
            </div>
            
            <Button
              className="w-full mt-8 text-cyan border border-cyan/30 hover:bg-cyan/10 bg-transparent rounded-full"
              onClick={handleFlip}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Flip to Answer
            </Button>
          </div>
          
          {/* Back side (Answer) */}
          <div 
            className={`absolute top-0 left-0 w-full h-full bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 shadow-lg backface-hidden rotate-y-180 ${isFlipped ? 'block' : 'hidden'}`}
          >
            <div className="mb-3">
              <span className="text-sm text-cyan">Basic • Answer {currentIndex}</span>
              <h3 className="text-xl font-medium text-white mt-1 mb-4">Answer</h3>
              <p className="text-white text-lg">{answer}</p>
            </div>
            
            <Button
              className="w-full mt-8 text-cyan border border-cyan/30 hover:bg-cyan/10 bg-transparent rounded-full"
              onClick={handleFlip}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Flip to Question
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between gap-4 mt-4">
        <Button 
          variant="outline" 
          className="flex-1 rounded-full border-gray-700 bg-charcoalSecondary text-white"
          onClick={onPrevious}
          disabled={currentIndex === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Prev
        </Button>
        <Button 
          variant="cyan"
          className="flex-1 rounded-full"
          onClick={onNext}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashCard;
