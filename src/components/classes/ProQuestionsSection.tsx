
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fetchQuestionsByLevel } from '@/adapters/educationAdapter';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProQuiz from './ProQuiz';

interface Question {
  id: string | number;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
}

const ProQuestionsSection = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("flashcards");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await fetchQuestionsByLevel('pro');
        
        if (result && result.questions.length > 0) {
          setQuestions(result.questions);
        } else {
          setError('No questions available at the moment.');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // Update progress when current question changes
    if (questions.length > 0) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    }
  }, [currentQuestionIndex, questions.length]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-gray-400">Loading questions...</p>
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

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsFlipped(false);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsFlipped(false);
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Professional Algo Trading</h2>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-charcoalSecondary border border-gray-800/40">
          <TabsTrigger value="flashcards" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
            <span>Flashcards</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
            <span>Quiz</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="flashcards">
          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
            <div>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          <Progress value={progress} className="h-1 w-full bg-charcoalPrimary mb-4" />
          
          <div className="h-[300px] md:h-[360px] relative">
            <div 
              className={`w-full h-full transform transition-all duration-500 perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card (Question) */}
              <div 
                className={`absolute inset-0 bg-charcoalSecondary rounded-xl p-5 border border-gray-800/40 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      Pro • Question {currentQuestionIndex + 1}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Question</h3>
                    <div className="text-gray-300 text-sm sm:text-base">{currentQuestion.question}</div>
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
                        disabled={isLastQuestion}
                        className="flex-1 bg-cyan text-charcoalPrimary hover:bg-cyan/90"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Back of card (Answer) */}
              <div 
                className={`absolute inset-0 bg-charcoalSecondary rounded-xl p-5 border border-gray-800/40 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Answer</div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Answer</h3>
                    <div className="text-gray-300 text-sm sm:text-base">{currentQuestion.answer}</div>
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
                        disabled={isLastQuestion}
                        className="flex-1 bg-cyan text-charcoalPrimary hover:bg-cyan/90"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                {questions.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1 w-3 sm:w-4 rounded-full ${index === currentQuestionIndex ? 'bg-cyan' : 'bg-gray-700'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="quiz">
          <ProQuiz />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProQuestionsSection;
