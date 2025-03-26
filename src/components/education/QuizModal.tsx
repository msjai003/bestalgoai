
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Quiz } from '@/data/educationData';
import { useEducation } from '@/hooks/useEducation';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz;
  moduleTitle: string;
}

export const QuizModal = ({ open, onOpenChange, quiz, moduleTitle }: QuizModalProps) => {
  const { submitQuizAnswer } = useEducation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const totalQuestions = quiz.questions.length;
  const currentQuestionData = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  
  const handleNext = () => {
    if (isLastQuestion && isAnswered) {
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
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
    setIsAnswered(true);
    
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };
  
  const handleFinishQuiz = () => {
    const isPassed = correctAnswers / totalQuestions >= 0.7; // 70% passing threshold
    submitQuizAnswer(isPassed);
    onOpenChange(false);
    // Reset state for next time
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setShowResults(false);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset state for next time
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setShowResults(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{moduleTitle} Quiz</DialogTitle>
        </DialogHeader>
        
        {!showResults ? (
          <>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{correctAnswers} correct so far</span>
            </div>
            
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
            <div className="w-full h-4 bg-gray-700 rounded-full mb-6">
              <div 
                className={`h-4 rounded-full ${
                  correctAnswers / totalQuestions >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
              ></div>
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
