
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
  
  return data as EducationModule[] || [];
};

export const getEducationModules = async (): Promise<EducationModule[]> => {
  const { data, error } = await supabase
    .from('education_modules')
    .select('*')
    .order('order_index');
    
  if (error) {
    console.error('Error fetching all modules:', error);
    return [];
  }
  
  return data as EducationModule[] || [];
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
  
  return data as EducationModule;
};

export const createEducationModule = createModule;

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
  
  return data as EducationModule;
};

export const updateEducationModule = updateModule;

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

export const deleteEducationModule = deleteModule;

// Content functions
export const getEducationContent = async (moduleId?: string): Promise<EducationContent[]> => {
  let query = supabase.from('education_content').select('*').order('order_index');
  
  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching content:', error);
    return [];
  }
  
  return data as EducationContent[] || [];
};

export const createEducationContent = async (content: Omit<EducationContent, 'id' | 'created_at' | 'updated_at'>): Promise<EducationContent | null> => {
  const { data, error } = await supabase
    .from('education_content')
    .insert(content)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating content:', error);
    return null;
  }
  
  return data as EducationContent;
};

export const updateEducationContent = async (id: string, content: Partial<EducationContent>): Promise<EducationContent | null> => {
  const { data, error } = await supabase
    .from('education_content')
    .update(content)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating content:', error);
    return null;
  }
  
  return data as EducationContent;
};

export const deleteEducationContent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('education_content')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting content:', error);
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
  
  // Transform options from JSON to string[] if needed
  return data ? data.map(q => ({
    ...q,
    level: q.level as Level,
    options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as unknown as string)
  })) as QuizQuestion[] : [];
};

export const fetchAllQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const { data, error } = await supabase
    .from('education_quiz_clients')
    .select('*');
    
  if (error) {
    console.error('Error fetching all quiz questions:', error);
    return [];
  }
  
  // Transform options from JSON to string[] if needed
  return data ? data.map(q => ({
    ...q,
    level: q.level as Level,
    options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as unknown as string)
  })) as QuizQuestion[] : [];
};

export const getQuizQuestions = async (moduleId?: string): Promise<QuizQuestion[]> => {
  let query = supabase.from('education_quiz_clients').select('*');
  
  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
  
  // Transform options from JSON to string[] if needed
  return data ? data.map(q => ({
    ...q,
    level: q.level as Level,
    options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as unknown as string)
  })) as QuizQuestion[] : [];
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
  // Ensure options is stored as JSON
  const preparedQuestion = {
    ...question,
    options: question.options
  };
  
  const { data, error } = await supabase
    .from('education_quiz_clients')
    .insert(preparedQuestion)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating quiz question:', error);
    return null;
  }
  
  // Transform options from JSON to string[] for return
  return {
    ...data,
    level: data.level as Level,
    options: Array.isArray(data.options) ? data.options : JSON.parse(data.options as unknown as string)
  } as QuizQuestion;
};

export const updateQuizQuestion = async (id: string, question: Partial<QuizQuestion>): Promise<QuizQuestion | null> => {
  // Prepare the question for update
  const preparedQuestion: any = { ...question };
  
  const { data, error } = await supabase
    .from('education_quiz_clients')
    .update(preparedQuestion)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating quiz question:', error);
    return null;
  }
  
  // Transform options from JSON to string[] for return
  return {
    ...data,
    level: data.level as Level,
    options: Array.isArray(data.options) ? data.options : JSON.parse(data.options as unknown as string)
  } as QuizQuestion;
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

// Quiz Answer functions for QuizForm.tsx
export const createQuizAnswer = async (answer: Omit<QuizAnswer, 'id'>): Promise<QuizAnswer | null> => {
  const { data, error } = await supabase
    .from('education_quiz_answers')
    .insert(answer)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating quiz answer:', error);
    return null;
  }
  
  return data as QuizAnswer;
};

export const updateQuizAnswer = async (id: string, answer: Partial<QuizAnswer>): Promise<QuizAnswer | null> => {
  const { data, error } = await supabase
    .from('education_quiz_answers')
    .update(answer)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating quiz answer:', error);
    return null;
  }
  
  return data as QuizAnswer;
};

export const deleteQuizAnswer = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('education_quiz_answers')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting quiz answer:', error);
    return false;
  }
  
  return true;
};

// Badge functions
export const getEducationBadges = async (): Promise<EducationBadge[]> => {
  const { data, error } = await supabase
    .from('education_badges')
    .select('*');
    
  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
  
  return data.map(badge => ({
    ...badge,
    id: String(badge.id),
    level: badge.level as Level
  })) as EducationBadge[] || [];
};

export const createEducationBadge = async (badge: Omit<EducationBadge, 'id'>): Promise<EducationBadge | null> => {
  const { data, error } = await supabase
    .from('education_badges')
    .insert({
      name: badge.name,
      description: badge.description,
      image: badge.image,
      level: badge.level,
      unlocked_by: badge.unlocked_by,
      badge_id: badge.badge_id || `badge_${Date.now()}`
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating badge:', error);
    return null;
  }
  
  return {
    ...data,
    id: String(data.id),
    level: data.level as Level
  } as EducationBadge;
};

export const updateEducationBadge = async (id: string, badge: Partial<EducationBadge>): Promise<EducationBadge | null> => {
  // Convert string id to number for database
  const numericId = parseInt(id, 10);
  
  const { data, error } = await supabase
    .from('education_badges')
    .update({
      name: badge.name,
      description: badge.description,
      image: badge.image,
      level: badge.level,
      unlocked_by: badge.unlocked_by,
      badge_id: badge.badge_id
    })
    .eq('id', numericId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating badge:', error);
    return null;
  }
  
  return {
    ...data,
    id: String(data.id),
    level: data.level as Level
  } as EducationBadge;
};

export const deleteEducationBadge = async (id: string): Promise<boolean> => {
  // Convert string id to number for database
  const numericId = parseInt(id, 10);
  
  const { error } = await supabase
    .from('education_badges')
    .delete()
    .eq('id', numericId);
    
  if (error) {
    console.error('Error deleting badge:', error);
    return false;
  }
  
  return true;
};
