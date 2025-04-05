import { supabase } from '@/integrations/supabase/client';

export type Level = 'basics' | 'intermediate' | 'pro';

export interface EducationModule {
  id: string;
  title: string;
  description: string;
  level: Level;
  order_index: number;
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
}

export interface QuizAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
}

// Module functions
export const fetchModules = async (level: Level): Promise<EducationModule[]> => {
  const { data, error } = await supabase
    .from('education_modules')
    .select('*')
    .eq('level', level)
    .order('order_index');
    
  if (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
  
  return data || [];
};

export const createModule = async (module: Omit<EducationModule, 'id' | 'created_at' | 'updated_at'>): Promise<EducationModule | null> => {
  const { data, error } = await supabase
    .from('education_modules')
    .insert(module)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating module:', error);
    return null;
  }
  
  return data;
};

export const updateModule = async (id: string, module: Partial<EducationModule>): Promise<EducationModule | null> => {
  const { data, error } = await supabase
    .from('education_modules')
    .update(module)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating module:', error);
    return null;
  }
  
  return data;
};

export const deleteModule = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('education_modules')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting module:', error);
    return false;
  }
  
  return true;
};

// Quiz Questions functions
export const fetchQuizQuestions = async (moduleId: string, level: Level): Promise<QuizQuestion[]> => {
  const { data, error } = await supabase
    .from('education_quiz_clients')
    .select('*')
    .eq('module_id', moduleId)
    .eq('level', level);
    
  if (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
  
  return data || [];
};

export const createQuizQuestion = async (question: {
  module_id: string;
  level: Level;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}): Promise<QuizQuestion | null> => {
  const { data, error } = await supabase
    .from('education_quiz_clients')
    .insert(question)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating quiz question:', error);
    return null;
  }
  
  return data;
};

export const updateQuizQuestion = async (id: string, question: Partial<QuizQuestion>): Promise<QuizQuestion | null> => {
  const { data, error } = await supabase
    .from('education_quiz_clients')
    .update(question)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating quiz question:', error);
    return null;
  }
  
  return data;
};

export const deleteQuizQuestion = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('education_quiz_clients')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting quiz question:', error);
    return false;
  }
  
  return true;
};

// Placeholder functions for compatibility with existing code
export const createQuizAnswer = async (answer: {
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
}): Promise<QuizAnswer | null> => {
  // Since we're not using separate answer records, just return null
  console.log('createQuizAnswer called but not implemented for the quiz_clients table', answer);
  return null;
};

export const updateQuizAnswer = async (id: string, answer: Partial<QuizAnswer>): Promise<QuizAnswer | null> => {
  // Since we're not using separate answer records, just return null
  console.log('updateQuizAnswer called but not implemented for the quiz_clients table', id, answer);
  return null;
};

export const deleteQuizAnswer = async (id: string): Promise<boolean> => {
  // Since we're not using separate answer records, just return true
  console.log('deleteQuizAnswer called but not implemented for the quiz_clients table', id);
  return true;
};

// Badge functions (placeholder stubs for compatibility)
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  level: Level;
  unlocked_by: string;
}

export const fetchBadges = async (): Promise<Badge[]> => {
  return [];
};

export const createBadge = async (badge: Omit<Badge, 'id' | 'created_at' | 'updated_at'>): Promise<Badge | null> => {
  return null;
};

export const updateBadge = async (id: string, badge: Partial<Badge>): Promise<Badge | null> => {
  return null;
};

export const deleteBadge = async (id: string): Promise<boolean> => {
  return true;
};
