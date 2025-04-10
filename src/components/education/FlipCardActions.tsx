
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface FlipCardActionsProps {
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isFlipped: boolean;
  isFirstCard: boolean;
  isLastCard: boolean;
}

export const FlipCardActions: React.FC<FlipCardActionsProps> = ({
  onFlip,
  onNext,
  onPrevious,
  isFlipped,
  isFirstCard,
  isLastCard
}) => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <Button
        className="w-full text-cyan border border-cyan/30 hover:bg-cyan/10 bg-transparent"
        onClick={onFlip}
      >
        <RotateCw className="mr-2 h-4 w-4" />
        Flip to {isFlipped ? 'Question' : 'Answer'}
      </Button>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          className="flex-1 border-gray-700 bg-charcoalSecondary text-white"
          onClick={onPrevious}
          disabled={isFirstCard}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Prev
        </Button>
        <Button 
          variant="cyan"
          className="flex-1"
          onClick={onNext}
          disabled={isLastCard}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
