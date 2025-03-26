
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEducation } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

export const FlashCard = () => {
  const { currentLevel, currentModule, currentCard, nextCard, prevCard } = useEducation();
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Get current module data
  const moduleData = educationData[currentLevel].find(m => m.id === currentModule);
  
  if (!moduleData || moduleData.flashcards.length === 0) {
    return (
      <Card className="premium-card p-6 text-center">
        <p>No flashcards available for this module yet.</p>
      </Card>
    );
  }
  
  const currentFlashcard = moduleData.flashcards[currentCard];
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNext = () => {
    setIsFlipped(false);
    nextCard();
  };
  
  const handlePrev = () => {
    setIsFlipped(false);
    prevCard();
  };
  
  return (
    <div className="h-[320px] md:h-[360px] relative">
      <div 
        className={`w-full h-full transform transition-all duration-500 perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div 
          className={`absolute inset-0 premium-card p-6 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="text-xs text-gray-400 mb-1">
                {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} • Module {currentModule.replace('module', '')}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{currentFlashcard.title}</h3>
              <div className="text-gray-300">{currentFlashcard.question}</div>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={handleFlip} 
                className="w-full border-cyan/40 text-cyan hover:bg-cyan/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Flip to Answer
              </Button>
              
              <div className="flex justify-between gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handlePrev} 
                  disabled={currentCard === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1"
                  disabled={currentCard === moduleData.flashcards.length - 1}
                >
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className={`absolute inset-0 premium-card p-6 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="text-xs text-gray-400 mb-1">Answer</div>
              <h3 className="text-xl font-bold mb-4 text-white">{currentFlashcard.title}</h3>
              <div className="text-gray-300">{currentFlashcard.answer}</div>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={handleFlip} 
                className="w-full border-cyan/40 text-cyan hover:bg-cyan/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Flip to Question
              </Button>
              
              <div className="flex justify-between gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handlePrev} 
                  disabled={currentCard === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1"
                  disabled={currentCard === moduleData.flashcards.length - 1}
                >
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="flex gap-1">
          {moduleData.flashcards.map((_, index) => (
            <div 
              key={index}
              className={`h-1 w-4 rounded-full ${index === currentCard ? 'bg-cyan' : 'bg-gray-700'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
