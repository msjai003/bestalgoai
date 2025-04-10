
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface FlipCardActionsProps {
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isPreviousDisabled?: boolean;
}

export const FlipCardActions: React.FC<FlipCardActionsProps> = ({
  isFlipped,
  onFlip,
  onNext,
  onPrevious,
  isPreviousDisabled = false
}) => {
  return (
    <div>
      <Button
        className="w-full mb-4 text-cyan border border-cyan/30 hover:bg-cyan/10 bg-transparent rounded-full"
        onClick={onFlip}
      >
        <RotateCw className="mr-2 h-4 w-4" />
        Flip to {isFlipped ? 'Question' : 'Answer'}
      </Button>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          className="flex-1 rounded-full border-gray-700 bg-charcoalSecondary text-white"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
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
