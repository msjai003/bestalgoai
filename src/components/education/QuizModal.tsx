
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, ChevronRight, Award, RefreshCw, Clock } from 'lucide-react';
import { useEducation } from '@/hooks/useEducation';
import { QuizQuestion } from '@/data/educationData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: { questions: QuizQuestion[] };
  moduleTitle: string;
  moduleId: string;
  autoLaunch?: boolean;
  onQuizComplete?: () => void;
  isDarkMode?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onOpenChange,
  quiz,
  moduleTitle,
  moduleId,
  autoLaunch = false,
  onQuizComplete,
  isDarkMode = true
}) => {
  const { 
    submitQuizAnswer, 
    startQuiz, 
    setAutoLaunchQuiz, 
    currentLevel,
    fetchQuizData
  } = useEducation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Quiz timer
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [dataFetched, setDataFetched] = useState(false); // Flag to track if data has been fetched
  
  useEffect(() => {
    // Reset dataFetched flag when modal is closed
    if (!open) {
      setDataFetched(false);
    }
    
    const loadQuizData = async () => {
      // Only fetch data if modal is open and data hasn't been fetched yet
      if (open && !dataFetched) {
        setLoading(true);
        setLoadError(null);
        setDataFetched(true); // Mark data as being fetched
        
        try {
          console.log(`Attempt ${loadAttempts + 1} to load quiz data for module ${moduleId}`);
          const supabaseQuizData = await fetchQuizData(moduleId);
          
          if (supabaseQuizData && supabaseQuizData.questions && supabaseQuizData.questions.length > 0) {
            console.log('Found', supabaseQuizData.questions.length, 'quiz questions from database');
            console.log('Using quiz data from Supabase:', supabaseQuizData.questions);
            setQuizQuestions(supabaseQuizData.questions);
          } else if (quiz && quiz.questions && quiz.questions.length > 0) {
            const questionsWithIds = quiz.questions.map(q => {
              if (!q.id) {
                return { ...q, id: uuidv4() };
              }
              return q;
            });
            setQuizQuestions(questionsWithIds);
            console.log('Falling back to local quiz data:', questionsWithIds);
          } else {
            setLoadError('No quiz questions available for this module.');
          }
        } catch (error) {
          console.error('Error loading quiz data:', error);
          setLoadError('Failed to load quiz data. Please try again later.');
          
          if (loadAttempts < 2) {
            setTimeout(() => {
              setLoadAttempts(prevAttempts => prevAttempts + 1);
              setDataFetched(false); // Reset flag to allow another attempt
            }, 1000);
          } else {
            toast.error('Failed to load quiz data after multiple attempts.');
          }
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadQuizData();
  }, [moduleId, open, quiz, currentLevel, fetchQuizData, loadAttempts, dataFetched]);
  
  useEffect(() => {
    if (open) {
      setCurrentQuestion(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setCorrectAnswers(0);
      setQuizComplete(false);
      setQuizStartTime(Date.now());
      setLoadAttempts(0);
      
      // Set a 3-minute timer for the quiz
      setTimeRemaining(180); // 3 minutes in seconds
      
      // Start the timer
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      startQuiz();
    } else if (autoLaunch) {
      setAutoLaunchQuiz(null);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [open, autoLaunch, setAutoLaunchQuiz, startQuiz]);
  
  // Format remaining time as mm:ss
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '00:00';
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
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
      
      // Stop the timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
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
      
      if (passed && onQuizComplete) {
        onQuizComplete();
      }
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setQuizComplete(false);
    setQuizStartTime(Date.now());
    
    // Reset timer
    setTimeRemaining(180);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  const handleCloseQuiz = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    onOpenChange(false);
  };
  
  const hasExplanation = (question: QuizQuestion) => {
    return !!question.explanation && question.explanation.trim() !== '';
  };
  
  // Calculate XP based on correct answers and time spent
  const calculateXP = () => {
    if (!quizComplete) return 0;
    
    const baseXP = 100; // Base XP for completing the quiz
    const correctAnswerXP = correctAnswers * 50; // 50 XP per correct answer
    
    // Time bonus: If completed under 2 minutes, add bonus
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    let timeBonus = 0;
    if (timeSpent < 120) {
      timeBonus = 100;
    } else if (timeSpent < 150) {
      timeBonus = 50;
    }
    
    return baseXP + correctAnswerXP + timeBonus;
  };
  
  // Get background color classes based on theme
  const getBgClass = () => {
    return isDarkMode ? 'bg-charcoalSecondary border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800';
  };
  
  return (
    <Dialog open={open} onOpenChange={handleCloseQuiz}>
      <DialogContent className={`${getBgClass()} max-w-md sm:max-w-lg`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className={`animate-spin h-8 w-8 ${isDarkMode ? 'text-cyan' : 'text-blue-500'}`} />
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading quiz from database...</p>
          </div>
        ) : loadError || quizQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <X className="h-8 w-8 text-red-400" />
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{loadError || `No quiz questions available for this module in the ${currentLevel} level.`}</p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : !quizComplete ? (
          <>
            <DialogTitle>{moduleTitle} Quiz ({currentLevel})</DialogTitle>
            <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              <div className="flex justify-between items-center">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className={timeRemaining && timeRemaining < 30 ? 'text-red-400' : ''}>
                    {formatTimeRemaining()}
                  </span>
                </div>
              </div>
            </DialogDescription>
            
            <div className="w-full bg-charcoalPrimary rounded-full h-2 mb-6">
              <div 
                className={`${isDarkMode ? 'bg-cyan' : 'bg-blue-500'} h-2 rounded-full transition-all duration-300`} 
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="mb-6">
              <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium mb-4`}>{quizQuestions[currentQuestion]?.question || 'No question available'}</p>
              
              <div className="space-y-3">
                {quizQuestions[currentQuestion]?.options?.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className="w-full cursor-pointer"
                  >
                    <Card 
                      className={`p-4 border transition-colors ${
                        selectedOption === index 
                          ? index === quizQuestions[currentQuestion]?.correctAnswer
                            ? 'bg-green-900/30 border-green-500'
                            : 'bg-red-900/30 border-red-500'
                          : isDarkMode 
                            ? 'bg-charcoalPrimary border-gray-700 hover:border-gray-500' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          selectedOption === index 
                            ? index === quizQuestions[currentQuestion]?.correctAnswer
                              ? 'border-green-500 bg-green-500/20' 
                              : 'border-red-500 bg-red-500/20'
                            : isDarkMode ? 'border-gray-500' : 'border-gray-400'
                        }`}>
                          {isAnswered && index === quizQuestions[currentQuestion]?.correctAnswer && (
                            <Check className="h-3 w-3 text-green-500" />
                          )}
                          {isAnswered && selectedOption === index && index !== quizQuestions[currentQuestion]?.correctAnswer && (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <span className={isDarkMode ? '' : 'text-gray-700'}>{option}</span>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {isAnswered && hasExplanation(quizQuestions[currentQuestion]) && (
              <Card className={`p-4 mb-6 ${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>
                  <span className="font-bold">Explanation:</span> {quizQuestions[currentQuestion]?.explanation}
                </p>
              </Card>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className={isDarkMode 
                  ? 'bg-cyan text-charcoalPrimary hover:bg-cyan/90 flex items-center' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 flex items-center'
                }
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <DialogTitle>Quiz Results</DialogTitle>
            <DialogDescription className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Your quiz score and results</DialogDescription>
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Quiz Complete!</h2>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>You scored:</p>
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-cyan' : 'text-blue-500'} my-2`}>
                {Math.round((correctAnswers / quizQuestions.length) * 100)}%
              </div>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {correctAnswers} out of {quizQuestions.length} questions correct
              </p>
              
              <div className={`mt-3 text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                <span className="font-bold">+ {calculateXP()} XP</span> earned!
              </div>
            </div>
            
            {correctAnswers / quizQuestions.length >= 0.7 ? (
              <div className={`${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'} rounded-lg p-4 mb-6`}>
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
                <p className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} font-medium`}>
                  Congratulations! You've passed this quiz.
                </p>
              </div>
            ) : (
              <div className={`${isDarkMode ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-300'} rounded-lg p-4 mb-6`}>
                <p className={isDarkMode ? 'text-orange-300' : 'text-orange-600'}>
                  You need 70% to pass. Keep studying and try again!
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleRestartQuiz}
                className={isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white' : 'border-gray-300 text-gray-600 hover:text-gray-800'}
              >
                Restart Quiz
              </Button>
              <Button 
                onClick={handleCloseQuiz}
                className={isDarkMode 
                  ? 'bg-cyan text-charcoalPrimary hover:bg-cyan/90' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
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
