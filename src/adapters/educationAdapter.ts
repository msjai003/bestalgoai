
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

// Function to fetch questions by level (basics, intermediate, or pro)
export const fetchQuestionsByLevel = async (level: string): Promise<{
  questions: { id: number | string; question: string; answer: string; display_order: number }[];
} | null> => {
  try {
    console.log(`Fetching ${level} questions`);
    
    // Use a type-safe table name based on the level
    let tableName = 'basics_question_answers';
    
    if (level === 'intermediate') {
      tableName = 'intermediate_questions_answers';
    } else if (level === 'pro') {
      tableName = 'pro_questions_answers';
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select('id, question, answer, display_order')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error(`Error fetching ${level} questions:`, error);
      return { questions: [] };
    }
    
    if (!data || data.length === 0) {
      console.log(`No ${level} questions found`);
      return { questions: [] };
    }
    
    console.log(`Found ${data.length} ${level} questions`);
    return { questions: data };
  } catch (error) {
    console.error(`Error in fetchQuestionsByLevel:`, error);
    return { questions: [] };
  }
};

// Function to fetch module quiz data - using the dedicated tables for questions
export const fetchModuleQuizData = async (moduleId: string, level: string = 'basics'): Promise<{
  questions: QuizQuestion[];
} | null> => {
  try {
    console.log('Fetching quiz data for module:', moduleId, 'level:', level);
    
    // Use a type-safe table name based on the level
    const tableName = level === 'intermediate' 
      ? 'intermediate_questions_answers' 
      : 'basics_question_answers';
    
    const { data, error } = await supabase
      .from(tableName)
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
    
    // Transform the data to match QuizQuestion format
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

// New function to fetch basic quiz multiple-choice questions
export const fetchBasicQuizQuestions = async (): Promise<{
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}> => {
  try {
    console.log('Fetching basic quiz questions');
    
    const { data, error } = await supabase
      .from('basic_quiz')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching basic quiz questions:', error);
      return { questions: [] };
    }
    
    if (!data || data.length === 0) {
      console.log('No basic quiz questions found');
      return { questions: [] };
    }
    
    // Transform the data to the format we need
    const questions = data.map(item => ({
      id: item.id,
      question: item.question,
      options: [item.option_a, item.option_b, item.option_c, item.option_d],
      correctAnswer: item.correct_answer
    }));
    
    console.log(`Found ${questions.length} basic quiz questions`);
    return { questions };
  } catch (error) {
    console.error('Error in fetchBasicQuizQuestions:', error);
    return { questions: [] };
  }
};
