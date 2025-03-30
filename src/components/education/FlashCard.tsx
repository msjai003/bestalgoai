
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEducation } from '@/hooks/useEducation';
import { educationData } from '@/data/educationData';
import { ArrowLeft, ArrowRight, RefreshCw, Award } from 'lucide-react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  
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
      <Card className="premium-card p-8 text-center">
        <p>No flashcards available for this module yet.</p>
      </Card>
    );
  }
  
  const currentFlashcard = moduleData.flashcards[currentCard];
  const isLastCard = currentCard === moduleData.flashcards.length - 1;
  
  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(false);
    
    // Wait for flip animation to complete before changing card
    setTimeout(() => {
      nextCard();
      setIsAnimating(false);
      
      // If this is the last card, trigger auto-launch quiz
      if (isLastCard) {
        console.log("Last card reached, setting auto-launch quiz for module:", currentModule);
        // Auto-launch quiz after a short delay
        setTimeout(() => {
          setAutoLaunchQuiz(currentModule);
        }, 800);
      }
    }, 300);
  };
  
  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(false);
    
    // Wait for flip animation to complete before changing card
    setTimeout(() => {
      prevCard();
      setIsAnimating(false);
    }, 300);
  };
  
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div className="font-medium">
          Card {currentCard + 1} of {moduleData.flashcards.length}
        </div>
        <div className="flex items-center">
          <Award className="h-4 w-4 text-cyan mr-2 animate-pulse-slow" />
          <span className="hidden sm:inline">Complete all cards to unlock the quiz</span>
          <span className="sm:hidden">Complete all cards</span>
        </div>
      </div>
      
      <Progress value={cardProgress} className="h-2 w-full bg-charcoalSecondary" />
      
      <div className="h-[320px] md:h-[380px] relative">
        <div 
          className={`w-full h-full transform transition-all duration-500 perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <div 
            className={`absolute inset-0 premium-card p-6 sm:p-8 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-xs text-cyan/80 mb-2 font-medium">
                  {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} • Module {currentModule.replace('module', '')}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-white">{currentFlashcard.title}</h3>
                <div className="text-gray-300 text-base sm:text-lg">{currentFlashcard.question}</div>
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4 mt-6">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleFlip} 
                  className="w-full border-cyan/40 text-cyan hover:bg-cyan/10"
                  disabled={isAnimating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Flip to Answer
                </Button>
                
                <div className="flex justify-between gap-3">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handlePrev} 
                    disabled={currentCard === 0 || isAnimating}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <Button 
                    size="lg"
                    onClick={handleNext} 
                    disabled={isAnimating}
                    className="flex-1"
                  >
                    {isLastCard ? <span className="hidden sm:inline">Complete</span> : <span className="hidden sm:inline">Next</span>}
                    {isLastCard ? <span className="sm:hidden">Done</span> : <span className="sm:hidden">Next</span>}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div 
            className={`absolute inset-0 premium-card p-6 sm:p-8 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-xs text-cyan/80 mb-2 font-medium">Answer</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-white">{currentFlashcard.title}</h3>
                <div className="text-gray-300 text-base sm:text-lg">{currentFlashcard.answer}</div>
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4 mt-6">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleFlip} 
                  className="w-full border-cyan/40 text-cyan hover:bg-cyan/10"
                  disabled={isAnimating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Flip to Question
                </Button>
                
                <div className="flex justify-between gap-3">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handlePrev} 
                    disabled={currentCard === 0 || isAnimating}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <Button 
                    size="lg"
                    onClick={handleNext} 
                    disabled={isAnimating}
                    className="flex-1"
                  >
                    {isLastCard ? <span className="hidden sm:inline">Complete</span> : <span className="hidden sm:inline">Next</span>}
                    {isLastCard ? <span className="sm:hidden">Done</span> : <span className="sm:hidden">Next</span>}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <div className="flex gap-1.5">
            {moduleData.flashcards.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-4 sm:w-5 rounded-full transition-colors duration-300 ${
                  index === currentCard ? 'bg-cyan' : 
                  index < currentCard ? 'bg-cyan/30' : 'bg-gray-700'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
