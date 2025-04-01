import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Updated types for our education module data
export interface EducationModule {
  id: string;
  title: string;
  description: string | null;
  level: 'basics' | 'intermediate' | 'pro';
  order_index: number;
  estimated_time: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EducationContent {
  id: string;
  module_id: string;
  title: string;
  content: string;
  order_index: number;
  content_type: string;
  media_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  module_id: string;
  question: string;
  explanation: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EducationBadge {
  id: string;
  badge_id: string;
  name: string;
  description: string;
  image: string;
  level: 'basics' | 'intermediate' | 'pro';
  unlocked_by: string;
  created_at: string;
  updated_at: string;
}

// Module functions
export const getEducationModules = async () => {
  const { data, error } = await supabase
    .from('education_modules')
    .select('*')
    .order('order_index');
  
  if (error) {
    console.error('Error fetching education modules:', error);
    toast.error('Failed to fetch education modules');
    return [];
  }
  
  // Type assertion to ensure proper level formatting
  return (data as any[]).map(module => ({
    ...module,
    level: module.level as 'basics' | 'intermediate' | 'pro'
  })) as EducationModule[];
};

// Fixed createEducationModule function
export const createEducationModule = async (module: { 
  title: string; 
  description?: string; 
  level: 'basics' | 'intermediate' | 'pro'; 
  order_index: number;
  estimated_time?: number | null;
  is_active?: boolean;
}) => {
  const { data, error } = await supabase
    .from('education_modules')
    .insert(module)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating education module:', error);
    toast.error('Failed to create education module');
    return null;
  }
  
  toast.success('Education module created successfully');
  return data as EducationModule;
};

// Fixed updateEducationModule function
export const updateEducationModule = async (id: string, updates: Partial<{
  title: string;
  description?: string | null;
  level: 'basics' | 'intermediate' | 'pro';
  order_index: number;
  estimated_time?: number | null;
  is_active?: boolean;
}>) => {
  const { data, error } = await supabase
    .from('education_modules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating education module:', error);
    toast.error('Failed to update education module');
    return null;
  }
  
  toast.success('Education module updated successfully');
  return data as EducationModule;
};

export const deleteEducationModule = async (id: string) => {
  const { error } = await supabase
    .from('education_modules')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting education module:', error);
    toast.error('Failed to delete education module');
    return false;
  }
  
  toast.success('Education module deleted successfully');
  return true;
};

// Content functions
export const getEducationContent = async (moduleId: string) => {
  const { data, error } = await supabase
    .from('education_content')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index');
  
  if (error) {
    console.error('Error fetching education content:', error);
    toast.error('Failed to fetch content');
    return [];
  }
  
  return data as EducationContent[];
};

// Fixed createEducationContent function
export const createEducationContent = async (content: { 
  module_id: string;
  title: string;
  content: string;
  order_index: number;
  content_type?: string;
  media_url?: string | null;
}) => {
  const { data, error } = await supabase
    .from('education_content')
    .insert(content)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating education content:', error);
    toast.error('Failed to create content');
    return null;
  }
  
  toast.success('Content created successfully');
  return data as EducationContent;
};

export const updateEducationContent = async (id: string, updates: Partial<{
  title: string;
  content: string;
  order_index: number;
  content_type?: string;
  media_url?: string;
}>) => {
  const { data, error } = await supabase
    .from('education_content')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating education content:', error);
    toast.error('Failed to update content');
    return null;
  }
  
  toast.success('Content updated successfully');
  return data as EducationContent;
};

export const deleteEducationContent = async (id: string) => {
  const { error } = await supabase
    .from('education_content')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting education content:', error);
    toast.error('Failed to delete content');
    return false;
  }
  
  toast.success('Content deleted successfully');
  return true;
};

// Quiz functions
export const getQuizQuestions = async (moduleId: string) => {
  const { data: questions, error: questionsError } = await supabase
    .from('education_quiz_questions')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index');
  
  if (questionsError) {
    console.error('Error fetching quiz questions:', questionsError);
    toast.error('Failed to fetch quiz questions');
    return [];
  }
  
  // Get answers for all questions
  const questionsWithAnswers: QuizQuestion[] = [];
  
  if (questions && questions.length > 0) {
    for (const question of questions) {
      const { data: answers, error: answersError } = await supabase
        .from('education_quiz_answers')
        .select('*')
        .eq('question_id', question.id)
        .order('order_index');
      
      if (answersError) {
        console.error('Error fetching quiz answers:', answersError);
      }
      
      // Create a properly typed question with answers
      const questionWithAnswers: QuizQuestion = {
        ...question,
        answers: answers as QuizAnswer[] || []
      };
      
      questionsWithAnswers.push(questionWithAnswers);
    }
  }
  
  return questionsWithAnswers;
};

export const createQuizQuestion = async (question: Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at' | 'answers'>) => {
  const { data, error } = await supabase
    .from('education_quiz_questions')
    .insert(question)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating quiz question:', error);
    toast.error('Failed to create quiz question');
    return null;
  }
  
  toast.success('Quiz question created successfully');
  return data;
};

export const updateQuizQuestion = async (id: string, updates: Partial<QuizQuestion>) => {
  // Remove answers field as it's not part of the quiz_questions table
  const { answers, ...questionUpdates } = updates;
  
  const { data, error } = await supabase
    .from('education_quiz_questions')
    .update(questionUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating quiz question:', error);
    toast.error('Failed to update quiz question');
    return null;
  }
  
  toast.success('Quiz question updated successfully');
  return data;
};

export const deleteQuizQuestion = async (id: string) => {
  const { error } = await supabase
    .from('education_quiz_questions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting quiz question:', error);
    toast.error('Failed to delete quiz question');
    return false;
  }
  
  toast.success('Quiz question deleted successfully');
  return true;
};

// Answer functions
export const createQuizAnswer = async (answer: Omit<QuizAnswer, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('education_quiz_answers')
    .insert(answer)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating quiz answer:', error);
    toast.error('Failed to create answer');
    return null;
  }
  
  toast.success('Answer created successfully');
  return data;
};

export const updateQuizAnswer = async (id: string, updates: Partial<QuizAnswer>) => {
  const { data, error } = await supabase
    .from('education_quiz_answers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating quiz answer:', error);
    toast.error('Failed to update answer');
    return null;
  }
  
  toast.success('Answer updated successfully');
  return data;
};

export const deleteQuizAnswer = async (id: string) => {
  const { error } = await supabase
    .from('education_quiz_answers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting quiz answer:', error);
    toast.error('Failed to delete answer');
    return false;
  }
  
  toast.success('Answer deleted successfully');
  return true;
};

// Badge functions
export const getEducationBadges = async () => {
  const { data, error } = await supabase
    .from('education_badges')
    .select('*')
    .order('level');
  
  if (error) {
    console.error('Error fetching education badges:', error);
    toast.error('Failed to fetch badges');
    return [];
  }
  
  // Type assertion to ensure proper level formatting
  return (data as any[]).map(badge => ({
    ...badge,
    level: badge.level as 'basics' | 'intermediate' | 'pro'
  })) as EducationBadge[];
};

export const createEducationBadge = async (badge: {
  badge_id: string;
  name: string;
  description: string;
  image: string;
  level: 'basics' | 'intermediate' | 'pro';
  unlocked_by: string;
}) => {
  const { data, error } = await supabase
    .from('education_badges')
    .insert(badge)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating education badge:', error);
    toast.error('Failed to create badge');
    return null;
  }
  
  toast.success('Badge created successfully');
  return data as EducationBadge;
};

export const updateEducationBadge = async (id: string, updates: Partial<{
  badge_id: string;
  name: string;
  description: string;
  image: string;
  level: 'basics' | 'intermediate' | 'pro';
  unlocked_by: string;
}>) => {
  const { data, error } = await supabase
    .from('education_badges')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating education badge:', error);
    toast.error('Failed to update badge');
    return null;
  }
  
  toast.success('Badge updated successfully');
  return data as EducationBadge;
};

export const deleteEducationBadge = async (id: string) => {
  const { error } = await supabase
    .from('education_badges')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting education badge:', error);
    toast.error('Failed to delete badge');
    return false;
  }
  
  toast.success('Badge deleted successfully');
  return true;
};
