
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Quiz } from '@/data/educationData';
import { useEducation } from '@/hooks/useEducation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz;
  moduleTitle: string;
  moduleId: string;
  autoLaunch?: boolean;
}

export const QuizModal = ({ 
  open, 
  onOpenChange, 
  quiz, 
  moduleTitle, 
  moduleId,
  autoLaunch = false 
}: QuizModalProps) => {
  const { submitQuizAnswer, markModuleViewed } = useEducation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionTimer, setQuestionTimer] = useState(20); // Initialize 20 seconds countdown
  
  const totalQuestions = quiz.questions.length;
  const currentQuestionData = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  
  // Start timer when quiz opens
  useEffect(() => {
    if (open && !startTime) {
      setStartTime(Date.now());
      setQuestionTimer(20); // Reset question timer
      
      // Mark the module as viewed when the quiz starts
      markModuleViewed(moduleId);
    }
    
    if (!open) {
      // Reset state when modal closes
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCorrectAnswers(0);
      setShowResults(false);
      setTimeSpent(0);
      setStartTime(null);
      setQuestionTimer(20);
    }
  }, [open, moduleId, markModuleViewed, startTime]);
  
  // Update time spent every second
  useEffect(() => {
    let timer: any;
    
    if (open && startTime && !showResults) {
      timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open, startTime, showResults]);
  
  // Countdown timer for questions
  useEffect(() => {
    let countdownTimer: any;
    
    if (open && !isAnswered && !showResults) {
      countdownTimer = setInterval(() => {
        setQuestionTimer((prevTime) => {
          if (prevTime <= 1) {
            // Time's up - auto submit with current selection
            clearInterval(countdownTimer);
            if (!isAnswered) {
              handleAutoSubmit();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [open, isAnswered, showResults, currentQuestion]);
  
  // Reset timer when moving to next question
  useEffect(() => {
    if (!isAnswered) {
      setQuestionTimer(20);
    }
  }, [currentQuestion]);
  
  const handleAutoSubmit = () => {
    setIsAnswered(true);
    
    // Check if answer is correct
    if (selectedAnswer !== null && selectedAnswer === currentQuestionData.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };
  
  const handleNext = () => {
    if (isLastQuestion && isAnswered) {
      // Calculate total time spent
      if (startTime) {
        const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
        setTimeSpent(totalSeconds);
      }
      
      // Show final results
      setShowResults(true);
    } else if (isAnswered) {
      // Move to next question
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setQuestionTimer(20); // Reset timer for new question
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
    setIsAnswered(true);
    
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleFinishQuiz = () => {
    const isPassed = correctAnswers / totalQuestions >= 0.7; // 70% passing threshold
    submitQuizAnswer(moduleId, isPassed, correctAnswers, totalQuestions, timeSpent);
    onOpenChange(false);
  };
  
  const handleClose = () => {
    // Only allow closing if the quiz is not completed yet
    if (!showResults) {
      onOpenChange(false);
    }
  };
  
  const getScoreColor = (score: number): string => {
    const percentage = score / totalQuestions;
    if (percentage >= 0.8) return 'text-green-500';
    if (percentage >= 0.7) return 'text-cyan';
    return 'text-red-500';
  };
  
  // Calculate timer color based on time remaining
  const getTimerColor = (): string => {
    if (questionTimer > 10) return 'text-cyan';
    if (questionTimer > 5) return 'text-yellow-500';
    return 'text-red-500 animate-pulse';
  };
  
  return (
    <Dialog open={open} onOpenChange={showResults ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{moduleTitle} Quiz</DialogTitle>
        </DialogHeader>
        
        {!showResults ? (
          <>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <div className="flex items-center">
                <span className={`font-bold text-lg mr-2 ${getTimerColor()}`}>
                  <Clock className="h-4 w-4 inline-block mr-1" />
                  {questionTimer}s
                </span>
                <span className="hidden sm:inline">{correctAnswers} correct so far</span>
              </div>
            </div>
            
            <Progress 
              value={(currentQuestion / totalQuestions) * 100} 
              className="h-1 mb-4" 
            />
            
            <div className="premium-card p-4 mb-4">
              <h3 className="text-lg mb-4">{currentQuestionData?.question}</h3>
              
              <RadioGroup 
                value={selectedAnswer?.toString()} 
                onValueChange={(value) => !isAnswered && setSelectedAnswer(Number(value))}
                className="space-y-3"
                disabled={isAnswered}
              >
                {currentQuestionData?.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-2 p-3 rounded-md border ${
                      isAnswered && currentQuestionData.correctAnswer === index 
                        ? 'border-green-500 bg-green-500/10' 
                        : isAnswered && selectedAnswer === index 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-gray-700'
                    }`}
                  >
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`} 
                      disabled={isAnswered}
                    />
                    <Label 
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                    {isAnswered && currentQuestionData.correctAnswer === index && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {isAnswered && selectedAnswer === index && currentQuestionData.correctAnswer !== index && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button 
                variant="outline" 
                onClick={handleClose}
              >
                Exit Quiz
              </Button>
              <div className="flex gap-2">
                {!isAnswered ? (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    {isLastQuestion ? 'Show Results' : 'Next Question'}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className={`text-xl font-bold mb-2 ${
              correctAnswers / totalQuestions >= 0.7 ? 'text-green-500' : 'text-red-500'
            }`}>
              {correctAnswers / totalQuestions >= 0.7 ? 'Congratulations!' : 'Almost there!'}
            </div>
            <p className="text-lg mb-4">
              You scored {correctAnswers} out of {totalQuestions}
              {correctAnswers / totalQuestions >= 0.7 ? 
                ' and passed the quiz!' : 
                '. You need 70% to pass.'}
            </p>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className={`h-4 rounded-full ${
                  correctAnswers / totalQuestions >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-400 mb-6">
              Time spent: {formatTime(timeSpent)}
            </div>
            <Button 
              onClick={handleFinishQuiz} 
              variant={correctAnswers / totalQuestions >= 0.7 ? 'default' : 'outline'}
              className="w-full"
            >
              {correctAnswers / totalQuestions >= 0.7 ? 'Complete Module' : 'Try Again'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
