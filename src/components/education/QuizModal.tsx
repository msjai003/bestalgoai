
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Quiz, QuizQuestion } from '@/data/educationData';
import { useEducation } from '@/hooks/useEducation';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: Quiz;
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
  const { 
    submitQuizAnswer, 
    markModuleViewed, 
    fetchQuizData, 
    loadingQuizData 
  } = useEducation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // State for database quiz data
  const [dbQuizData, setDbQuizData] = useState<{ questions: QuizQuestion[] } | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // If we have quiz data from props or from database
  const hasQuizData = quiz || (dbQuizData && dbQuizData.questions.length > 0);
  
  // Use database quiz data if available, otherwise use the quiz data from props
  const currentQuizData = dbQuizData || (quiz ? { questions: quiz.questions } : null);
  
  // Only if we have quiz data
  const totalQuestions = currentQuizData ? currentQuizData.questions.length : 0;
  const currentQuestionData = currentQuizData && currentQuestion < totalQuestions 
    ? currentQuizData.questions[currentQuestion] 
    : null;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  
  // Fetch quiz data from database when modal opens
  useEffect(() => {
    const loadDbQuizData = async () => {
      if (open && moduleId && !quiz) {
        setIsLoadingQuiz(true);
        setFetchError(null);
        
        try {
          console.log(`Loading quiz data for module: ${moduleId}`);
          
          // Use the mock data for non-UUID module IDs (like "module1")
          // This is a workaround for the database expecting UUIDs
          if (!isValidUUID(moduleId)) {
            console.log(`Module ID "${moduleId}" is not a UUID, using mock data instead`);
            if (quiz) {
              setDbQuizData({ questions: quiz.questions });
            }
            setIsLoadingQuiz(false);
            return;
          }
          
          const data = await fetchQuizData(moduleId);
          console.log(`Received data for module ${moduleId}:`, data);
          setDbQuizData(data);
        } catch (error) {
          console.error(`Error fetching quiz for module ${moduleId}:`, error);
          setFetchError(`Failed to load quiz: ${(error as Error).message}`);
        } finally {
          setIsLoadingQuiz(false);
        }
      }
    };
    
    loadDbQuizData();
  }, [open, moduleId, quiz, fetchQuizData]);
  
  // Helper function to check if a string is a valid UUID
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
  
  // Start timer when quiz opens
  useEffect(() => {
    if (open && !startTime) {
      setStartTime(Date.now());
      
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
      setDbQuizData(null);
      setFetchError(null);
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
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestionData) return;
    
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
  
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader className="h-8 w-8 animate-spin text-cyan mb-4" />
      <p className="text-center">Loading quiz questions...</p>
    </div>
  );
  
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <XCircle className="h-8 w-8 text-red-500 mb-4" />
      <p className="text-center mb-1 text-red-400">{fetchError}</p>
      <p className="text-center text-sm text-gray-400 mb-4">Using fallback quiz data instead.</p>
      <Button onClick={() => onOpenChange(false)}>Close</Button>
    </div>
  );
  
  const renderNoQuestionsState = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-center mb-4">No quiz questions available for this module.</p>
      <Button onClick={() => onOpenChange(false)}>Close</Button>
    </div>
  );
  
  return (
    <Dialog open={open} onOpenChange={showResults ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{moduleTitle} Quiz</DialogTitle>
        </DialogHeader>
        
        {isLoadingQuiz || loadingQuizData ? (
          renderLoadingState()
        ) : fetchError ? (
          renderErrorState()
        ) : !hasQuizData ? (
          renderNoQuestionsState()
        ) : !showResults ? (
          <>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{correctAnswers} correct so far • {formatTime(timeSpent)}</span>
            </div>
            
            <Progress 
              value={(currentQuestion / totalQuestions) * 100} 
              className="h-1 mb-4" 
            />
            
            {currentQuestionData && (
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
                
                {isAnswered && currentQuestionData.explanation && (
                  <div className="mt-4 p-3 bg-gray-800/50 rounded-md border border-gray-700">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Explanation:</span> {currentQuestionData.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
            
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
