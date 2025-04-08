
import React, { useState, useEffect } from 'react';
import { fetchProQuizQuestions } from '@/adapters/educationAdapter';
import QuizHeader from './quiz/QuizHeader';
import QuizQuestionCard from './quiz/QuizQuestionCard';
import QuizResults from './quiz/QuizResults';
import LoadingState from './quiz/LoadingState';
import ErrorState from './quiz/ErrorState';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const ProQuiz = () => {
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
        const data = await fetchProQuizQuestions();
        
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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
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
      <QuizResults 
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        onRestartQuiz={restartQuiz}
      />
    );
  }

  return (
    <div className="mt-6">
      <QuizHeader 
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        progress={progress}
      />
      
      <QuizQuestionCard
        currentQuestion={questions[currentQuestionIndex]}
        currentQuestionIndex={currentQuestionIndex}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        questions={questions}
        onOptionSelect={handleOptionSelect}
        onPrevious={handlePrevious}
        onNext={handleNext}
        getCorrectOptionIndex={getCorrectOptionIndex}
        getOptionLabel={getOptionLabel}
      />
    </div>
  );
};

export default ProQuiz;
