
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchIntermediateQuizQuestions } from '@/adapters/educationAdapter';
import { Check, X, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const IntermediateQuiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchIntermediateQuizQuestions();
        
        if (data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setError('No quiz questions available at the moment.');
        }
      } catch (err) {
        console.error('Error loading quiz questions:', err);
        setError('Failed to load quiz questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    // Update progress when current question changes
    if (questions.length > 0) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
      setIsAnswered(true);
      
      const currentQuestion = questions[currentQuestionIndex];
      const correctOptionIndex = getCorrectOptionIndex(currentQuestion.correctAnswer);
      
      if (index === correctOptionIndex) {
        setCorrectAnswers(prev => prev + 1);
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect answer!');
      }
    }
  };

  const getCorrectOptionIndex = (correctAnswer: string): number => {
    // Convert letter 'A', 'B', 'C', 'D' to index 0, 1, 2, 3
    return correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0);
  };

  const getOptionLabel = (index: number): string => {
    // Convert index 0, 1, 2, 3 to letter 'A', 'B', 'C', 'D'
    return String.fromCharCode('A'.charCodeAt(0) + index);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setQuizComplete(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-gray-400">Loading quiz questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No questions available at the moment.</p>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="mt-6">
        <Card className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40">
          <h2 className="text-xl font-bold mb-4">Quiz Complete!</h2>
          <p className="mb-4">You scored {correctAnswers} out of {questions.length} questions correctly.</p>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-cyan my-2">
              {Math.round((correctAnswers / questions.length) * 100)}%
            </div>
            <Progress 
              value={(correctAnswers / questions.length) * 100} 
              className="h-2 w-full bg-charcoalPrimary"
            />
          </div>
          
          {correctAnswers / questions.length >= 0.7 ? (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
              <p className="text-green-300 font-medium">
                Great job! You've passed this quiz.
              </p>
            </div>
          ) : (
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4 mb-6">
              <p className="text-orange-300">
                You need 70% to pass. Keep studying and try again!
              </p>
            </div>
          )}
          
          <Button 
            onClick={restartQuiz}
            className="bg-cyan text-charcoalPrimary hover:bg-cyan/90 w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const correctOptionIndex = getCorrectOptionIndex(currentQuestion.correctAnswer);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Intermediate Trading Quiz</h2>
      
      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
        <div>
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      
      <Progress value={progress} className="h-1 w-full bg-charcoalPrimary mb-4" />
      
      <Card className="bg-charcoalSecondary rounded-xl p-5 border border-gray-800/40">
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-1">
            Question {currentQuestionIndex + 1}
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleOptionSelect(index)}
                className="w-full cursor-pointer"
              >
                <Card 
                  className={`p-4 border transition-colors ${
                    selectedOption === index 
                      ? index === correctOptionIndex
                        ? 'bg-green-900/30 border-green-500'
                        : 'bg-red-900/30 border-red-500'
                      : 'bg-charcoalPrimary border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                      selectedOption === index 
                        ? index === correctOptionIndex
                          ? 'border-green-500 bg-green-500/20' 
                          : 'border-red-500 bg-red-500/20'
                        : 'border-gray-500'
                    }`}>
                      <span className="font-medium text-sm">{getOptionLabel(index)}</span>
                    </div>
                    <span>{option}</span>
                    
                    {isAnswered && (
                      <div className="ml-auto">
                        {index === correctOptionIndex && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        {selectedOption === index && index !== correctOptionIndex && (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handlePrevious} 
            disabled={isFirstQuestion}
            className="flex-1"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <Button 
            size="sm"
            onClick={handleNext} 
            disabled={!isAnswered}
            className="flex-1 bg-cyan text-charcoalPrimary hover:bg-cyan/90"
          >
            <span>{isLastQuestion ? "Finish" : "Next"}</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IntermediateQuiz;
