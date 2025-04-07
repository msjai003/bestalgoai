
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import QuestionCard from './QuestionCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
}

const BasicQuestionsSection = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Use a more explicit type with the from method
        const { data, error } = await supabase
          .from('basics_question_answers')
          .select('id, question, answer, category, display_order')
          .eq('category', 'basic')
          .order('display_order', { ascending: true });

        if (error) {
          throw error;
        }

        // Safely cast the data to our Question type
        setQuestions(data as Question[] || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-6">Basic Trading Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question.question}
            answer={question.answer}
          />
        ))}
      </div>
    </div>
  );
};

export default BasicQuestionsSection;
