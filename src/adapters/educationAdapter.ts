
import { supabase } from '@/integrations/supabase/client';
import { Level } from '@/hooks/useEducation';
import { QuizQuestion } from '@/data/educationData';

// Function to fetch user education data
export const fetchUserEducationData = async (userId: string) => {
  try {
    // Since the tables are removed, simply return null to fall back to local data
    console.log("Education tables removed from Supabase, using local data");
    return null;
  } catch (error) {
    console.error("Error fetching user education data:", error);
    return null;
  }
};

// Function to mark a module as viewed
export const markModuleViewed = async (userId: string, moduleId: string) => {
  try {
    console.log("Education tables removed from Supabase, marking module viewed locally only");
    // No operation needed since tables are removed
  } catch (error) {
    console.error("Error marking module as viewed:", error);
  }
};

// Function to mark a module as completed
export const markModuleCompleted = async (userId: string, moduleId: string, level: Level) => {
  try {
    console.log("Education tables removed from Supabase, marking module completed locally only");
    // No operation needed since tables are removed
  } catch (error) {
    console.error("Error marking module as completed:", error);
  }
};

// Function to save quiz result
export const saveQuizResult = async (userId: string, quizResult: {
  moduleId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
}) => {
  try {
    console.log("Education tables removed from Supabase, saving quiz result locally only", quizResult);
    // No operation needed since tables are removed
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
};

// Function to save earned badge
export const saveEarnedBadge = async (userId: string, badgeId: string) => {
  try {
    console.log("Education tables removed from Supabase, saving badge locally only");
    // No operation needed since tables are removed
  } catch (error) {
    console.error("Error saving earned badge:", error);
  }
};

// Function to update education progress
export const updateEducationProgress = async (userId: string, progress: {
  currentModule?: string;
  currentCard?: number;
}) => {
  try {
    console.log("Education tables removed from Supabase, updating progress locally only", progress);
    // No operation needed since tables are removed
  } catch (error) {
    console.error("Error updating education progress:", error);
  }
};

// Updated function to fetch module quiz data - using the basics_question_answers table instead
export const fetchModuleQuizData = async (moduleId: string, level: string = 'basics'): Promise<{
  questions: QuizQuestion[];
} | null> => {
  try {
    console.log('Fetching quiz data for module:', moduleId, 'level:', level);
    
    // Use the basics_question_answers table with the now integer ID
    const { data, error } = await supabase
      .from('basics_question_answers')
      .select('id, question, answer, category, display_order')
      .eq('category', level);
    
    if (error) {
      console.error('Error fetching quiz questions:', error);
      return { questions: [] };
    }
    
    if (!data || data.length === 0) {
      console.log('No quiz questions found for this module, falling back to local data');
      return { questions: [] };
    }
    
    // Transform the data from basics_question_answers to match QuizQuestion format
    // Make sure to convert the integer ID to a string to match the QuizQuestion type
    const questions: QuizQuestion[] = data.map(item => ({
      id: String(item.id), // Convert integer ID to string to match QuizQuestion type
      question: item.question,
      options: [item.answer, "Option 2", "Option 3", "Option 4"], // Create fake options with the correct answer
      correctAnswer: 0, // First option (the actual answer) is always correct
      explanation: "Explanation: " + item.answer
    }));
    
    console.log(`Found ${questions.length} quiz questions from database`);
    return { questions };
  } catch (error) {
    console.error('Error in fetchModuleQuizData:', error);
    return { questions: [] };
  }
};
