
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useEducation } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';
import { ArrowLeft, ArrowRight, RefreshCw, Award, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const FlashCard = () => {
  const { 
    currentLevel, 
    currentModule, 
    currentCard, 
    nextCard, 
    prevCard, 
    markModuleViewed,
    setAutoLaunchQuiz
  } = useEducation();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardProgress, setCardProgress] = useState(0);
  const [studyStartTime, setStudyStartTime] = useState<number | null>(null);
  
  // Get current module data
  const moduleData = educationData[currentLevel].find(m => m.id === currentModule);
  
  useEffect(() => {
    // Set study start time when component mounts
    if (!studyStartTime) {
      setStudyStartTime(Date.now());
    }
    
    // Mark this module as viewed after 10 seconds
    const viewTimeout = setTimeout(() => {
      if (moduleData) {
        markModuleViewed(moduleData.id);
      }
    }, 10000);
    
    return () => {
      clearTimeout(viewTimeout);
    };
  }, [moduleData, markModuleViewed, studyStartTime]);
  
  // Update progress when current card changes
  useEffect(() => {
    if (moduleData && moduleData.flashcards.length > 0) {
      setCardProgress(((currentCard + 1) / moduleData.flashcards.length) * 100);
    }
  }, [currentCard, moduleData]);
  
  if (!moduleData || moduleData.flashcards.length === 0) {
    return (
      <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 text-center">
        <p>No flashcards available for this module yet.</p>
      </div>
    );
  }
  
  const currentFlashcard = moduleData.flashcards[currentCard];
  const isLastCard = currentCard === moduleData.flashcards.length - 1;
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNext = () => {
    setIsFlipped(false);
    nextCard();
    
    // If this is the last card, suggest quiz
    if (isLastCard) {
      // Auto-launch quiz after a short delay
      setTimeout(() => {
        setAutoLaunchQuiz(currentModule);
      }, 1500);
    }
  };
  
  const handlePrev = () => {
    setIsFlipped(false);
    prevCard();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div>
          Card {currentCard + 1} of {moduleData.flashcards.length}
        </div>
        <div className="flex items-center">
          <Award className="h-4 w-4 text-cyan mr-1" />
          <span className="hidden sm:inline">Complete all cards to unlock the quiz</span>
          <span className="sm:hidden">Complete all cards</span>
        </div>
      </div>
      
      <Progress value={cardProgress} className="h-1 w-full bg-charcoalPrimary animate-progress" style={{"--progress-width": `${cardProgress}%`} as React.CSSProperties} />
      
      <div className="h-[300px] md:h-[360px] relative">
        <div 
          className={`w-full h-full transform transition-all duration-500 perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <div 
            className={`absolute inset-0 bg-charcoalSecondary rounded-xl p-5 border border-gray-800/40 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} • Module {currentModule.replace('module', '')}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">{currentFlashcard.title}</h3>
                <div className="text-gray-300 text-sm sm:text-base">{currentFlashcard.question}</div>
              </div>
              
              <div className="flex flex-col gap-2 sm:gap-3 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFlip} 
                  className="w-full border-cyan/40 text-cyan hover:bg-cyan/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Flip to Answer
                </Button>
                
                <div className="flex w-full gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handlePrev} 
                    disabled={currentCard === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleNext} 
                    className="flex-1 bg-cyan text-charcoalPrimary hover:bg-cyan/90"
                  >
                    {isLastCard ? <span className="hidden sm:inline">Complete</span> : <span className="hidden sm:inline">Next</span>}
                    {isLastCard ? <span className="sm:hidden">Done</span> : <span className="sm:hidden">Next</span>}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div 
            className={`absolute inset-0 bg-charcoalSecondary rounded-xl p-5 border border-gray-800/40 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-xs text-gray-400 mb-1">Answer</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">{currentFlashcard.title}</h3>
                <div className="text-gray-300 text-sm sm:text-base">{currentFlashcard.answer}</div>
              </div>
              
              <div className="flex flex-col gap-2 sm:gap-3 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFlip} 
                  className="w-full border-cyan/40 text-cyan hover:bg-cyan/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Flip to Question
                </Button>
                
                <div className="flex w-full gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handlePrev} 
                    disabled={currentCard === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleNext}
                    className="flex-1 bg-cyan text-charcoalPrimary hover:bg-cyan/90"
                  >
                    {isLastCard ? <span className="hidden sm:inline">Complete</span> : <span className="hidden sm:inline">Next</span>}
                    {isLastCard ? <span className="sm:hidden">Done</span> : <span className="sm:hidden">Next</span>}
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
                className={`h-1 w-3 sm:w-4 rounded-full ${index === currentCard ? 'bg-cyan' : 'bg-gray-700'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
