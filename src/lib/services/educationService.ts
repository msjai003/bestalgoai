
import { supabase } from '@/integrations/supabase/client';

// Education module interface
export interface EducationModule {
  id: string;
  title: string;
  description: string;
  level: string;
  order_index: number;
  is_published: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Education content interface
export interface EducationContent {
  id: string;
  module_id: string;
  title: string;
  content: string;
  order_index: number;
  content_type: string;
  media_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Quiz question interface
export interface QuizQuestion {
  id: string;
  module_id: string;
  level: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  created_at?: string;
  updated_at?: string;
}

// Quiz answer interface
export interface QuizAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
  explanation?: string;
  created_at?: string;
  updated_at?: string;
}

// Badge interface
export interface EducationBadge {
  id: number;
  name: string;
  description: string;
  image: string;
  level: string;
  badge_id: string;
  unlocked_by: string;
}

// Functions for interacting with education modules
export const fetchEducationModules = async (): Promise<EducationModule[]> => {
  try {
    const { data, error } = await supabase
      .from('education_content')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    return (data || []) as unknown as EducationModule[];
  } catch (error) {
    console.error('Error fetching education modules:', error);
    return [];
  }
};

export const createEducationModule = async (module: Omit<EducationModule, 'created_at' | 'id' | 'updated_at'>): Promise<boolean> => {
  try {
    // Using type assertion to handle incompatible schema
    const { error } = await supabase
      .from('education_content')
      .insert(module as any);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating education module:', error);
    return false;
  }
};

export const fetchEducationModule = async (id: string): Promise<EducationModule | null> => {
  try {
    const { data, error } = await supabase
      .from('education_content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as unknown as EducationModule;
  } catch (error) {
    console.error('Error fetching education module:', error);
    return null;
  }
};

export const updateEducationModule = async (id: string, module: Partial<EducationModule>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_content')
      .update(module as any)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating education module:', error);
    return false;
  }
};

export const deleteEducationModule = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_content')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting education module:', error);
    return false;
  }
};

// Functions for interacting with content
export const fetchModuleContent = async (moduleId: string): Promise<EducationContent[]> => {
  try {
    const { data, error } = await supabase
      .from('education_content')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    return (data || []) as unknown as EducationContent[];
  } catch (error) {
    console.error('Error fetching module content:', error);
    return [];
  }
};

export const createEducationContent = async (content: Omit<EducationContent, 'created_at' | 'id' | 'updated_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_content')
      .insert(content);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating education content:', error);
    return false;
  }
};

export const updateEducationContent = async (id: string, content: Partial<EducationContent>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_content')
      .update(content)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating education content:', error);
    return false;
  }
};

export const deleteEducationContent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_content')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting education content:', error);
    return false;
  }
};

// Functions for handling quiz questions
export const fetchModuleQuizQuestions = async (moduleId: string, level: string): Promise<QuizQuestion[]> => {
  try {
    type QuizClientData = {
      id: string;
      module_id: string;
      level: string;
      question: string;
      options: string | string[];
      correct_answer: number;
      explanation?: string;
      created_at?: string;
      updated_at?: string;
    };
    
    const { data, error } = await supabase
      .from('education_quiz_clients')
      .select('*')
      .eq('module_id', moduleId)
      .eq('level', level)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Transform to match the QuizQuestion interface
    const questions = (data as unknown as QuizClientData[]) || [];
    
    return questions.map(q => ({
      id: q.id,
      module_id: q.module_id,
      level: q.level,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
      created_at: q.created_at,
      updated_at: q.updated_at
    }));
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
};

export const fetchAllQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    type QuizClientData = {
      id: string;
      module_id: string;
      level: string;
      question: string;
      options: string | string[];
      correct_answer: number;
      explanation?: string;
      created_at?: string;
      updated_at?: string;
    };
    
    const { data, error } = await supabase
      .from('education_quiz_clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform to match the QuizQuestion interface
    const questions = (data as unknown as QuizClientData[]) || [];
    
    return questions.map(q => ({
      id: q.id,
      module_id: q.module_id,
      level: q.level,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
      created_at: q.created_at,
      updated_at: q.updated_at
    }));
  } catch (error) {
    console.error('Error fetching all quiz questions:', error);
    return [];
  }
};

export const createQuizQuestion = async (question: {
  module_id: string;
  level: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}): Promise<boolean> => {
  try {
    // Convert options array to JSON string if needed
    const formattedQuestion = {
      ...question,
      options: Array.isArray(question.options) ? JSON.stringify(question.options) : question.options
    };
    
    const { error } = await supabase
      .from('education_quiz_clients')
      .insert(formattedQuestion);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating quiz question:', error);
    return false;
  }
};

export const updateQuizQuestion = async (id: string, question: {
  module_id?: string;
  level?: string;
  question?: string;
  options?: string[];
  correct_answer?: number;
  explanation?: string;
}): Promise<boolean> => {
  try {
    // Convert options array to JSON string if needed
    const formattedQuestion = {
      ...question,
      options: question.options ? 
        (Array.isArray(question.options) ? JSON.stringify(question.options) : question.options) 
        : undefined
    };
    
    const { error } = await supabase
      .from('education_quiz_clients')
      .update(formattedQuestion)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating quiz question:', error);
    return false;
  }
};

export const deleteQuizQuestion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_quiz_clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting quiz question:', error);
    return false;
  }
};

// Helper functions for quiz answers
export const createQuizAnswer = async (answer: Omit<QuizAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    console.log('This function is not implemented as quiz answers are now stored in the options array');
    return true;
  } catch (error) {
    console.error('Error creating quiz answer:', error);
    return false;
  }
};

export const updateQuizAnswer = async (id: string, answer: Partial<QuizAnswer>): Promise<boolean> => {
  try {
    console.log('This function is not implemented as quiz answers are now stored in the options array');
    return true;
  } catch (error) {
    console.error('Error updating quiz answer:', error);
    return false;
  }
};

export const deleteQuizAnswer = async (id: string): Promise<boolean> => {
  try {
    console.log('This function is not implemented as quiz answers are now stored in the options array');
    return true;
  } catch (error) {
    console.error('Error deleting quiz answer:', error);
    return false;
  }
};

// Badge related functions
export const fetchBadges = async (): Promise<EducationBadge[]> => {
  try {
    const { data, error } = await supabase
      .from('education_badges')
      .select('*');
    
    if (error) throw error;
    
    return (data || []) as unknown as EducationBadge[];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
};

export const createBadge = async (badge: Omit<EducationBadge, 'id'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_badges')
      .insert(badge as any);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating badge:', error);
    return false;
  }
};

export const updateBadge = async (id: number, badge: Partial<EducationBadge>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_badges')
      .update(badge as any)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating badge:', error);
    return false;
  }
};

export const deleteBadge = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('education_badges')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting badge:', error);
    return false;
  }
};

// Additional helper functions
export const getEducationModules = fetchEducationModules;
export const getEducationContent = fetchModuleContent;
export const getQuizQuestions = fetchModuleQuizQuestions;
export const getEducationBadges = fetchBadges;
export const deleteEducationBadge = deleteBadge;
export const createEducationBadge = createBadge;
export const updateEducationBadge = updateBadge;
