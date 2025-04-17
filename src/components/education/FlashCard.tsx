
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, RotateCw, ArrowRight } from 'lucide-react';
import { useEducation } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';

export const FlashCard = () => {
  const { 
    currentLevel, 
    currentModule, 
    currentCard, 
    nextCard, 
    prevCard, 
    markModuleViewed 
  } = useEducation();
  
  const [isFlipped, setIsFlipped] = useState(false);
  
  const module = educationData[currentLevel]?.find(m => m.id === currentModule);
  const card = module?.flashcards[currentCard];
  
  if (!module || !card) {
    return (
      <Card className="p-6 flex items-center justify-center h-64 bg-charcoalSecondary border-gray-800">
        <p className="text-gray-400">No flashcard available for this module.</p>
      </Card>
    );
  }
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    
    // Mark module as viewed when user flips the card for the first time
    if (!isFlipped && currentCard === 0) {
      markModuleViewed(currentModule);
    }
  };
  
  const handleNext = () => {
    setIsFlipped(false);
    nextCard();
  };
  
  const handlePrev = () => {
    setIsFlipped(false);
    prevCard();
  };
  
  const isLastCard = currentCard === module.flashcards.length - 1;
  
  return (
    <div className="mb-6">
      <div className="perspective-1000 relative w-full h-64 cursor-pointer" onClick={handleFlip}>
        <div
          className={`w-full h-full relative transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <Card 
            className={`p-6 absolute w-full h-full backface-hidden bg-charcoalSecondary border-gray-800 flex flex-col justify-center ${
              isFlipped ? "hidden" : ""
            }`}
          >
            <div className="absolute top-4 left-4 text-xs text-gray-500">
              {currentCard + 1}/{module.flashcards.length}
            </div>
            <div className="absolute top-4 right-4 text-cyan bg-cyan/10 px-2 py-1 rounded text-xs">
              {module.level}
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">{card.front}</h3>
            <div className="text-center text-gray-400 text-sm mt-3">
              <RotateCw className="h-4 w-4 inline mr-2" />
              Tap to flip
            </div>
          </Card>
          
          {/* Back of card */}
          <Card 
            className={`p-6 absolute w-full h-full backface-hidden rotate-y-180 bg-charcoalSecondary border-gray-800 flex flex-col justify-center ${
              !isFlipped ? "hidden" : ""
            }`}
          >
            <div className="absolute top-4 left-4 text-xs text-gray-500">
              {currentCard + 1}/{module.flashcards.length}
            </div>
            <p className="text-gray-200 text-center">{card.back}</p>
            <div className="text-center text-gray-400 text-sm mt-3">
              <RotateCw className="h-4 w-4 inline mr-2" />
              Tap to flip back
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          className="border-gray-700"
          onClick={handlePrev} 
          disabled={currentCard === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button 
          variant="outline"
          className={isLastCard ? "bg-cyan/10 border-cyan/30 text-cyan" : "border-gray-700"}
          onClick={handleNext}
        >
          {isLastCard ? (
            <>
              Take Quiz 
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
