
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the Flashcard interface with both question/answer and front/back properties
interface Flashcard {
  id: string;
  title?: string;
  question?: string;
  answer?: string;
  front?: string;
  back?: string;
  difficulty?: string;
  category?: string;
}

export const useAIEducation = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFlashcards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Since the 'flashcards' table doesn't exist in Supabase yet,
        // we'll create mock data locally instead of querying the database
        
        // Mock data for flashcards
        const mockFlashcards: Flashcard[] = [
          {
            id: '1',
            title: 'What is a Stock?',
            question: 'What is a stock and what does it represent?',
            answer: 'A stock represents ownership in a company. When you buy a stock, you're buying a small piece of that company.',
            front: 'What is a stock and what does it represent?',
            back: 'A stock represents ownership in a company. When you buy a stock, you're buying a small piece of that company.',
            difficulty: 'beginner',
            category: 'stocks'
          },
          {
            id: '2',
            title: 'What is a Market Order?',
            question: 'Explain what a market order is in trading',
            answer: 'A market order is an instruction to buy or sell a security immediately at the best available current price.',
            front: 'Explain what a market order is in trading',
            back: 'A market order is an instruction to buy or sell a security immediately at the best available current price.',
            difficulty: 'beginner',
            category: 'orders'
          }
        ];
        
        setFlashcards(mockFlashcards);
      } catch (err) {
        console.error("Unexpected error fetching flashcards:", err);
        setError("An unexpected error occurred.");
        toast({
          title: "Unexpected error",
          description: "An unexpected error occurred while loading flashcards.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [toast]);

  return {
    flashcards,
    isLoading,
    error,
  };
};
