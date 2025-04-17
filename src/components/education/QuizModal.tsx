
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Clock, HelpCircle, BarChart3, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { QuizQuestion } from '@/data/educationData';
import { useEducation } from '@/hooks/useEducation';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: QuizQuestion[];
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
    setAutoLaunchQuiz,
    fetchQuizData, 
    loadingQuizData,
    usingRealData
  } = useEducation();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [quizEndTime, setQuizEndTime] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (open) {
      setCurrentQuestionIndex(0);
      setSelectedOptions([]);
      setIsSubmitted(false);
      setQuizComplete(false);
      setQuizScore(0);
      setQuizStartTime(Date.now());
      setQuizEndTime(0);
      setIsLoading(true);
      
      // If using local quiz data
      if (quiz && !usingRealData) {
        setQuizQuestions(quiz);
        setIsLoading(false);
      } else {
        // Fetch quiz data from server
        fetchQuizData(moduleId)
          .then(data => {
            if (data && data.questions && data.questions.length > 0) {
              setQuizQuestions(data.questions);
            } else if (quiz) {
              // Fallback to local data
              setQuizQuestions(quiz);
            } else {
              setQuizQuestions([]);
            }
            setIsLoading(false);
          })
          .catch(() => {
            // Fallback to local data on error
            if (quiz) {
              setQuizQuestions(quiz);
            } else {
              setQuizQuestions([]);
            }
            setIsLoading(false);
          });
      }
    }
  }, [open, moduleId, quiz, fetchQuizData, usingRealData]);
  
  useEffect(() => {
    if (!open && autoLaunch) {
      setAutoLaunchQuiz(null);
    }
  }, [open, autoLaunch, setAutoLaunchQuiz]);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
    } else {
      // Calculate score
      let score = 0;
      quizQuestions.forEach((question, index) => {
        if (selectedOptions[index] === question.correctAnswer) {
          score++;
        }
      });
      
      setQuizEndTime(Date.now());
      setQuizScore(score);
      setQuizComplete(true);
      
      const passed = score / quizQuestions.length >= 0.7; // 70% to pass
      const timeSpentInSeconds = (Date.now() - quizStartTime) / 1000;
      
      submitQuizAnswer(
        moduleId,
        passed,
        score,
        quizQuestions.length,
        timeSpentInSeconds
      );
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitted(true);
  };
  
  const isCorrect = currentQuestion && selectedOptions[currentQuestionIndex] === currentQuestion.correctAnswer;
  const isAnswerSelected = selectedOptions[currentQuestionIndex] !== undefined;
  const timeSpent = quizEndTime - quizStartTime;
  const minutes = Math.floor(timeSpent / 60000);
  const seconds = Math.floor((timeSpent % 60000) / 1000);
  
  const formatTimeSpent = () => {
    return `${minutes}m ${seconds}s`;
  };
  
  const getScoreColor = () => {
    const percentage = (quizScore / quizQuestions.length) * 100;
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 70) return "text-cyan";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  if (isLoading || loadingQuizData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoalSecondary text-white border-gray-800 max-w-lg">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader className="h-10 w-10 text-cyan animate-spin mb-4" />
            <h3 className="text-lg font-medium">Loading Quiz Questions...</h3>
            <p className="text-gray-400 text-sm mt-2">Please wait</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (quizComplete) {
    const scorePercentage = (quizScore / quizQuestions.length) * 100;
    const passed = scorePercentage >= 70;
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoalSecondary text-white border-gray-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-cyan" />
              Quiz Results: {moduleTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 text-center">
            {passed ? (
              <div className="inline-flex rounded-full bg-green-900/30 p-3 mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            ) : (
              <div className="inline-flex rounded-full bg-red-900/30 p-3 mb-4">
                <X className="h-10 w-10 text-red-500" />
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-1">
              {passed ? "Congratulations!" : "Keep Practicing!"}
            </h3>
            
            <p className="text-gray-300 mb-6">
              {passed 
                ? "You've successfully completed this module." 
                : "Review the material and try again to complete this module."}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-charcoalPrimary rounded-lg p-3">
                <div className={`text-xl font-bold ${getScoreColor()}`}>
                  {quizScore}/{quizQuestions.length}
                </div>
                <div className="text-xs text-gray-400 mt-1">Score</div>
              </div>
              
              <div className="bg-charcoalPrimary rounded-lg p-3">
                <div className="text-xl font-bold text-cyan">
                  {Math.round(scorePercentage)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">Percentage</div>
              </div>
              
              <div className="bg-charcoalPrimary rounded-lg p-3">
                <div className="text-xl font-bold text-cyan">
                  {formatTimeSpent()}
                </div>
                <div className="text-xs text-gray-400 mt-1">Time Spent</div>
              </div>
            </div>
            
            <Badge variant={passed ? "outline" : "destructive"} className="mb-2">
              {passed ? "PASSED" : "FAILED"}
            </Badge>
          </div>
          
          <DialogFooter>
            <Button 
              className="w-full bg-cyan text-charcoalPrimary hover:bg-cyan/90"
              onClick={() => onOpenChange(false)}
            >
              {passed ? "Continue Learning" : "Try Again Later"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!currentQuestion) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoalSecondary text-white border-gray-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              No Quiz Questions
            </DialogTitle>
          </DialogHeader>
          
          <p className="py-6 text-gray-300">
            No questions are available for this module. Please try another module or check back later.
          </p>
          
          <DialogFooter>
            <Button 
              className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary text-white border-gray-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-cyan" />
            {moduleTitle} Quiz
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center text-sm mb-4">
          <Badge variant="outline" className="border-gray-700 text-gray-300">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </Badge>
          
          <div className="text-gray-400 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Time limit: None</span>
          </div>
        </div>
        
        <Card className="p-4 bg-charcoalPrimary border-gray-700 mb-4">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  selectedOptions[currentQuestionIndex] === index
                    ? isSubmitted
                      ? isCorrect
                        ? "bg-green-900/30 border border-green-700"
                        : "bg-red-900/30 border border-red-700"
                      : "bg-cyan/30 border border-cyan/50"
                    : "bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50"
                }`}
                onClick={() => handleOptionSelect(index)}
                disabled={isSubmitted}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {selectedOptions[currentQuestionIndex] === index ? (
                      isSubmitted ? (
                        isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-cyan bg-transparent flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-cyan"></div>
                        </div>
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-500 bg-transparent"></div>
                    )}
                  </div>
                  <div>{option}</div>
                </div>
              </button>
            ))}
          </div>
          
          {isSubmitted && (
            <div className="mt-4 p-3 rounded-md bg-gray-800/50 border border-gray-700">
              <p className="font-medium text-sm mb-1">
                {isCorrect ? (
                  <span className="text-green-500">Correct!</span>
                ) : (
                  <span className="text-red-500">
                    Incorrect. The right answer is: {currentQuestion.options[currentQuestion.correctAnswer]}
                  </span>
                )}
              </p>
              {currentQuestion.explanation && (
                <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
              )}
            </div>
          )}
        </Card>
        
        <DialogFooter className="gap-2 sm:gap-0">
          {!isSubmitted ? (
            <Button
              className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
              disabled={!isAnswerSelected}
              onClick={handleSubmit}
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
              onClick={handleNext}
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
