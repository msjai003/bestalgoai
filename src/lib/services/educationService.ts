
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export type Level = 'basics' | 'intermediate' | 'pro';

export interface EducationModule {
  id: string;
  title: string;
  description: string;
  level: Level;
  order_index: number;
  estimated_time?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuizQuestion {
  id: string;
  module_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  level: Level;
  order_index?: number;
}

export interface QuizAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface EducationContent {
  id: string;
  module_id: string;
  title: string;
  content: string;
  content_type?: string;
  media_url?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface EducationBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  level: Level;
  unlocked_by: string;
  badge_id?: string;
}

// Mock functions for education modules
export const fetchModules = async (level: Level): Promise<EducationModule[]> => {
  try {
    // For demonstration, return mock data that matches the type
    return [
      {
        id: "1",
        title: "Introduction to Trading",
        description: "Basic concepts of trading",
        level: level,
        order_index: 0,
        is_active: true
      }
    ];
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
};

export const getEducationModules = async (): Promise<EducationModule[]> => {
  try {
    // Return mock data that matches the type
    return [
      {
        id: "1",
        title: "Introduction to Trading",
        description: "Basic concepts of trading",
        level: 'basics',
        order_index: 0,
        is_active: true
      },
      {
        id: "2",
        title: "Advanced Trading",
        description: "Advanced concepts of trading",
        level: 'intermediate',
        order_index: 1,
        is_active: true
      }
    ];
  } catch (error) {
    console.error('Error fetching all modules:', error);
    return [];
  }
};

export const createModule = async (module: Omit<EducationModule, 'id' | 'created_at' | 'updated_at'>): Promise<EducationModule | null> => {
  try {
    // Mock creating a module and return a success response
    return {
      id: `module-${Date.now()}`,
      ...module,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating module:', error);
    return null;
  }
};

export const createEducationModule = createModule;

export const updateModule = async (id: string, module: Partial<EducationModule>): Promise<EducationModule | null> => {
  try {
    // Mock updating a module
    return {
      id,
      title: module.title || "Default Title",
      description: module.description || "Default Description",
      level: module.level || 'basics',
      order_index: module.order_index || 0,
      is_active: module.is_active !== undefined ? module.is_active : true,
      estimated_time: module.estimated_time,
      updated_at: new Date().toISOString(),
      created_at: "2023-01-01T00:00:00Z"
    };
  } catch (error) {
    console.error('Error updating module:', error);
    return null;
  }
};

export const updateEducationModule = updateModule;

export const deleteModule = async (id: string): Promise<boolean> => {
  try {
    // Mock deletion
    console.log(`Module with id ${id} would be deleted`);
    return true;
  } catch (error) {
    console.error('Error deleting module:', error);
    return false;
  }
};

export const deleteEducationModule = deleteModule;

// Content functions
export const getEducationContent = async (moduleId?: string): Promise<EducationContent[]> => {
  try {
    // Return mock data
    return [
      {
        id: "content1",
        module_id: moduleId || "module1",
        title: "Introduction",
        content: "This is an introduction to trading",
        content_type: "text",
        order_index: 0
      }
    ];
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
};

export const createEducationContent = async (content: Omit<EducationContent, 'id' | 'created_at' | 'updated_at'>): Promise<EducationContent | null> => {
  try {
    // Mock creation
    return {
      id: `content-${Date.now()}`,
      ...content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating content:', error);
    return null;
  }
};

export const updateEducationContent = async (id: string, content: Partial<EducationContent>): Promise<EducationContent | null> => {
  try {
    // Mock updating content
    return {
      id,
      module_id: content.module_id || "default-module",
      title: content.title || "Default Title",
      content: content.content || "Default Content",
      content_type: content.content_type || "text",
      order_index: content.order_index || 0,
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating content:', error);
    return null;
  }
};

export const deleteEducationContent = async (id: string): Promise<boolean> => {
  try {
    // Mock deletion
    console.log(`Content with id ${id} would be deleted`);
    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    return false;
  }
};

// Quiz Questions functions
export const fetchQuizQuestions = async (moduleId: string, level: Level): Promise<QuizQuestion[]> => {
  try {
    // Return mock data
    return [
      {
        id: "question1",
        module_id: moduleId,
        question: "What is trading?",
        options: ["Buying and selling assets", "Cooking food", "Playing sports", "None of the above"],
        correct_answer: 0,
        explanation: "Trading involves buying and selling financial assets",
        level
      }
    ];
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
};

export const fetchAllQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    // Return mock data
    return [
      {
        id: "question1",
        module_id: "module1",
        question: "What is trading?",
        options: ["Buying and selling assets", "Cooking food", "Playing sports", "None of the above"],
        correct_answer: 0,
        explanation: "Trading involves buying and selling financial assets",
        level: 'basics'
      },
      {
        id: "question2",
        module_id: "module2",
        question: "What is a stock?",
        options: ["Ownership in a company", "A type of soup", "A measurement tool", "None of the above"],
        correct_answer: 0,
        explanation: "A stock represents ownership in a company",
        level: 'intermediate'
      }
    ];
  } catch (error) {
    console.error('Error fetching all quiz questions:', error);
    return [];
  }
};

export const getQuizQuestions = async (moduleId?: string): Promise<QuizQuestion[]> => {
  try {
    if (moduleId) {
      return fetchAllQuizQuestions().then(questions => 
        questions.filter(q => q.module_id === moduleId)
      );
    }
    return fetchAllQuizQuestions();
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
};

export const createQuizQuestion = async (question: {
  module_id: string;
  level: Level;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  order_index?: number;
}): Promise<QuizQuestion | null> => {
  try {
    // Mock creating a question
    return {
      id: `question-${Date.now()}`,
      ...question
    };
  } catch (error) {
    console.error('Error creating quiz question:', error);
    return null;
  }
};

export const updateQuizQuestion = async (id: string, question: Partial<QuizQuestion>): Promise<QuizQuestion | null> => {
  try {
    // Mock updating a question
    // Simulate fetching the existing question first
    const existingQuestion = {
      id,
      module_id: "module1",
      question: "Original question?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct_answer: 0,
      level: 'basics' as Level
    };
    
    return {
      ...existingQuestion,
      ...question
    };
  } catch (error) {
    console.error('Error updating quiz question:', error);
    return null;
  }
};

export const deleteQuizQuestion = async (id: string): Promise<boolean> => {
  try {
    // Mock deletion
    console.log(`Question with id ${id} would be deleted`);
    return true;
  } catch (error) {
    console.error('Error deleting quiz question:', error);
    return false;
  }
};

// Quiz Answer functions
export const createQuizAnswer = async (answer: Omit<QuizAnswer, 'id'>): Promise<QuizAnswer | null> => {
  try {
    // Mock creating an answer
    return {
      id: `answer-${Date.now()}`,
      ...answer
    };
  } catch (error) {
    console.error('Error creating quiz answer:', error);
    return null;
  }
};

export const updateQuizAnswer = async (id: string, answer: Partial<QuizAnswer>): Promise<QuizAnswer | null> => {
  try {
    // Mock updating an answer
    return {
      id,
      question_id: answer.question_id || "question1",
      answer_text: answer.answer_text || "Default answer",
      is_correct: answer.is_correct !== undefined ? answer.is_correct : false,
      order_index: answer.order_index || 0
    };
  } catch (error) {
    console.error('Error updating quiz answer:', error);
    return null;
  }
};

export const deleteQuizAnswer = async (id: string): Promise<boolean> => {
  try {
    // Mock deletion
    console.log(`Answer with id ${id} would be deleted`);
    return true;
  } catch (error) {
    console.error('Error deleting quiz answer:', error);
    return false;
  }
};

// Badge functions
export const getEducationBadges = async (): Promise<EducationBadge[]> => {
  try {
    // Return mock data
    return [
      {
        id: "badge1",
        name: "Beginner Badge",
        description: "Completed the basics module",
        image: "🏆",
        level: 'basics',
        unlocked_by: "completed_basics"
      },
      {
        id: "badge2",
        name: "Intermediate Badge",
        description: "Completed the intermediate module",
        image: "🥇",
        level: 'intermediate',
        unlocked_by: "completed_intermediate"
      }
    ];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
};

export const createEducationBadge = async (badge: Omit<EducationBadge, 'id'>): Promise<EducationBadge | null> => {
  try {
    // Mock creating a badge
    return {
      id: `badge-${Date.now()}`,
      ...badge
    };
  } catch (error) {
    console.error('Error creating badge:', error);
    return null;
  }
};

export const updateEducationBadge = async (id: string, badge: Partial<EducationBadge>): Promise<EducationBadge | null> => {
  try {
    // Mock updating a badge
    const existingBadge = {
      id,
      name: "Original Badge",
      description: "Original description",
      image: "🏆",
      level: 'basics' as Level,
      unlocked_by: "original_condition"
    };
    
    return {
      ...existingBadge,
      ...badge
    };
  } catch (error) {
    console.error('Error updating badge:', error);
    return null;
  }
};

export const deleteEducationBadge = async (id: string): Promise<boolean> => {
  try {
    // Mock deletion
    console.log(`Badge with id ${id} would be deleted`);
    return true;
  } catch (error) {
    console.error('Error deleting badge:', error);
    return false;
  }
};
