import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, ChevronRight, Award, RefreshCw } from 'lucide-react';
import { useEducation } from '@/hooks/useEducation';
import { QuizQuestion } from '@/data/educationData';
import { fetchModuleQuizData } from '@/adapters/educationAdapter';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: { questions: QuizQuestion[] };
  moduleTitle: string;
  moduleId: string;
  autoLaunch?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onOpenChange,
  quiz,
  moduleTitle,
  moduleId,
  autoLaunch = false
}) => {
  const { submitQuizAnswer, startQuiz, setAutoLaunchQuiz, usingRealData, loadingQuizData } = useEducation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadQuizData = async () => {
      if (usingRealData && open) {
        setLoading(true);
        try {
          const data = await fetchModuleQuizData(moduleId);
          if (data && data.questions && data.questions.length > 0) {
            setQuizQuestions(data.questions);
          } else {
            toast.error('Could not load quiz questions. Using backup data.');
            if (quiz && quiz.questions) {
              const questionsWithIds = quiz.questions.map(q => {
                if (!q.id) {
                  return { ...q, id: uuidv4() };
                }
                return q;
              });
              setQuizQuestions(questionsWithIds);
            } else {
              toast.error('No quiz questions available.');
              onOpenChange(false);
            }
          }
        } catch (error) {
          console.error('Error loading quiz data:', error);
          toast.error('Failed to load quiz data.');
          
          if (quiz && quiz.questions) {
            const questionsWithIds = quiz.questions.map(q => {
              if (!q.id) {
                return { ...q, id: uuidv4() };
              }
              return q;
            });
            setQuizQuestions(questionsWithIds);
          }
        } finally {
          setLoading(false);
        }
      } else if (quiz && quiz.questions) {
        const questionsWithIds = quiz.questions.map(q => {
          if (!q.id) {
            return { ...q, id: uuidv4() };
          }
          return q;
        });
        setQuizQuestions(questionsWithIds);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    
    loadQuizData();
  }, [moduleId, open, quiz, usingRealData]);
  
  useEffect(() => {
    if (open) {
      setCurrentQuestion(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setCorrectAnswers(0);
      setQuizComplete(false);
      setQuizStartTime(Date.now());
      
      startQuiz();
    } else if (autoLaunch) {
      setAutoLaunchQuiz(null);
    }
  }, [open, autoLaunch, setAutoLaunchQuiz, startQuiz]);
  
  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
      setIsAnswered(true);
      
      const currentQuestionData = quizQuestions[currentQuestion];
      if (currentQuestionData && index === currentQuestionData.correctAnswer) {
        setCorrectAnswers(prev => prev + 1);
      }
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      
      const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
      const score = Math.round((correctAnswers / quizQuestions.length) * 100);
      const passed = score >= 70;
      
      submitQuizAnswer(
        moduleId,
        passed,
        score,
        quizQuestions.length,
        timeSpent
      );
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setQuizComplete(false);
    setQuizStartTime(Date.now());
  };
  
  const handleCloseQuiz = () => {
    onOpenChange(false);
  };
  
  const hasExplanation = (question: QuizQuestion) => {
    return !!question.explanation && question.explanation.trim() !== '';
  };
  
  if (loading || loadingQuizData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoalSecondary border-gray-700 text-white max-w-md sm:max-w-lg">
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="animate-spin h-8 w-8 text-cyan" />
            <p className="mt-4 text-gray-300">Loading quiz...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (quizQuestions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoalSecondary border-gray-700 text-white max-w-md sm:max-w-lg">
          <div className="flex flex-col items-center justify-center py-8">
            <X className="h-8 w-8 text-red-400" />
            <p className="mt-4 text-gray-300">No quiz questions available for this module.</p>
            <Button className="mt-4" onClick={handleCloseQuiz}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary border-gray-700 text-white max-w-md sm:max-w-lg">
        {!quizComplete ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">{moduleTitle} Quiz</h2>
              <p className="text-gray-400 text-sm">Question {currentQuestion + 1} of {quizQuestions.length}</p>
            </div>
            
            <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-6">
              <div 
                className="bg-cyan h-2 rounded-full" 
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="mb-6">
              <p className="text-white font-medium mb-4">{quizQuestions[currentQuestion]?.question}</p>
              
              <div className="space-y-3">
                {quizQuestions[currentQuestion]?.options.map((option, index) => (
                  <Card 
                    key={index}
                    className={`p-4 cursor-pointer border transition-colors ${
                      selectedOption === index 
                        ? index === quizQuestions[currentQuestion]?.correctAnswer
                          ? 'bg-green-900/30 border-green-500'
                          : 'bg-red-900/30 border-red-500'
                        : 'bg-charcoalPrimary border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedOption === index 
                          ? index === quizQuestions[currentQuestion]?.correctAnswer
                            ? 'border-green-500 bg-green-500/20' 
                            : 'border-red-500 bg-red-500/20'
                          : 'border-gray-500'
                      }`}>
                        {isAnswered && index === quizQuestions[currentQuestion]?.correctAnswer && (
                          <Check className="h-3 w-3 text-green-500" />
                        )}
                        {isAnswered && selectedOption === index && index !== quizQuestions[currentQuestion]?.correctAnswer && (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {isAnswered && hasExplanation(quizQuestions[currentQuestion]) && (
              <Card className="p-4 mb-6 bg-blue-900/20 border-blue-700">
                <p className="text-sm text-blue-100">
                  <span className="font-bold">Explanation:</span> {quizQuestions[currentQuestion]?.explanation}
                </p>
              </Card>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="bg-cyan text-charcoalPrimary hover:bg-cyan/90 flex items-center"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Quiz Complete!</h2>
              <p className="text-gray-300">You scored:</p>
              <div className="text-4xl font-bold text-cyan my-2">
                {Math.round((correctAnswers / quizQuestions.length) * 100)}%
              </div>
              <p className="text-gray-300">
                {correctAnswers} out of {quizQuestions.length} questions correct
              </p>
            </div>
            
            {correctAnswers / quizQuestions.length >= 0.7 ? (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-green-300 font-medium">
                  Congratulations! You've passed this quiz.
                </p>
              </div>
            ) : (
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4 mb-6">
                <p className="text-orange-300">
                  You need 70% to pass. Keep studying and try again!
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleRestartQuiz}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                Restart Quiz
              </Button>
              <Button 
                onClick={handleCloseQuiz}
                className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
