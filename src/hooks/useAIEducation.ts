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
        const { data, error } = await supabase
          .from('flashcards')
          .select('*');
        if (error) {
          console.error("Error fetching flashcards:", error);
          setError(error.message);
          toast({
            title: "Error fetching flashcards",
            description: "Failed to load flashcards. Please try again.",
            variant: "destructive",
          });
        } else {
          setFlashcards(data || []);
        }
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
