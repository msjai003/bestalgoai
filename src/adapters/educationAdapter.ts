import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuizQuestion, QuizAnswer } from '@/data/educationData';

// Type for quiz result
interface QuizResult {
  moduleId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
}

// Function to save a quiz result to Supabase
export const saveQuizResult = async (userId: string, result: QuizResult) => {
  if (!userId) {
    console.error('User ID is required to save quiz results');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('user_quiz_results')
      .insert({
        user_id: userId,
        module_id: result.moduleId,
        score: result.score,
        total_questions: result.totalQuestions,
        passed: result.passed,
        time_spent: result.timeSpent
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving quiz result:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception saving quiz result:', error);
    return null;
  }
};

// Function to mark a module as completed
export const markModuleCompleted = async (userId: string, moduleId: string, level: string) => {
  if (!userId) {
    console.error('User ID is required to mark module as completed');
    return null;
  }
  
  try {
    // Check if module is already completed
    const { data: existing } = await supabase
      .from('user_completed_modules')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();
    
    if (existing) {
      // Already completed, just return it
      return existing;
    }
    
    // Insert new completed module
    const { data, error } = await supabase
      .from('user_completed_modules')
      .insert({
        user_id: userId,
        module_id: moduleId,
        level: level
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error marking module as completed:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception marking module as completed:', error);
    return null;
  }
};

// Function to mark a module as viewed
export const markModuleViewed = async (userId: string, moduleId: string) => {
  if (!userId) {
    console.error('User ID is required to mark module as viewed');
    return null;
  }
  
  try {
    // Check if view already exists
    const { data: existing } = await supabase
      .from('user_module_views')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();
    
    if (existing) {
      // Already viewed, just return it
      return existing;
    }
    
    // Insert new view
    const { data, error } = await supabase
      .from('user_module_views')
      .insert({
        user_id: userId,
        module_id: moduleId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error marking module as viewed:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception marking module as viewed:', error);
    return null;
  }
};

// Function to save earned badge
export const saveEarnedBadge = async (userId: string, badgeId: string) => {
  if (!userId) {
    console.error('User ID is required to save earned badge');
    return null;
  }
  
  try {
    // Check if badge already earned
    const { data: existing } = await supabase
      .from('user_earned_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .maybeSingle();
    
    if (existing) {
      // Already earned, just return it
      return existing;
    }
    
    // Insert new earned badge
    const { data, error } = await supabase
      .from('user_earned_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving earned badge:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception saving earned badge:', error);
    return null;
  }
};

// Function to update user education progress
export const updateEducationProgress = async (
  userId: string, 
  updates: { 
    currentLevel?: string; 
    currentModule?: string; 
    currentCard?: number;
  }
) => {
  if (!userId) {
    console.error('User ID is required to update education progress');
    return null;
  }
  
  try {
    // Check if progress record exists
    const { data: existing } = await supabase
      .from('user_education_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Create an object with correctly named properties for the database
    const dbUpdates: { 
      current_level?: string; 
      current_module?: string; 
      current_card?: number;
    } = {};

    // Map the properties to match the database column names
    if (updates.currentLevel !== undefined) dbUpdates.current_level = updates.currentLevel;
    if (updates.currentModule !== undefined) dbUpdates.current_module = updates.currentModule;
    if (updates.currentCard !== undefined) dbUpdates.current_card = updates.currentCard;
    
    if (existing) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_education_progress')
        .update(dbUpdates)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating education progress:', error);
        return null;
      }
      
      return data;
    } else {
      // Create new progress record with defaults
      const newProgress = {
        user_id: userId,
        current_level: updates.currentLevel || 'basics',
        current_module: updates.currentModule || 'module1',
        current_card: updates.currentCard || 0
      };
      
      const { data, error } = await supabase
        .from('user_education_progress')
        .insert(newProgress)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating education progress:', error);
        return null;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Exception updating education progress:', error);
    return null;
  }
};

// Function to fetch user education data
export const fetchUserEducationData = async (userId: string) => {
  if (!userId) {
    console.error('User ID is required to fetch education data');
    return null;
  }
  
  try {
    // Get progress
    const { data: progress, error: progressError } = await supabase
      .from('user_education_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (progressError) {
      console.error('Error fetching education progress:', progressError);
    }
    
    // Get completed modules
    const { data: completedModules, error: completedError } = await supabase
      .from('user_completed_modules')
      .select('*')
      .eq('user_id', userId);
    
    if (completedError) {
      console.error('Error fetching completed modules:', completedError);
    }
    
    // Get quiz results
    const { data: quizResults, error: quizError } = await supabase
      .from('user_quiz_results')
      .select('*')
      .eq('user_id', userId);
    
    if (quizError) {
      console.error('Error fetching quiz results:', quizError);
    }
    
    // Get earned badges
    const { data: earnedBadges, error: badgesError } = await supabase
      .from('user_earned_badges')
      .select('*')
      .eq('user_id', userId);
    
    if (badgesError) {
      console.error('Error fetching earned badges:', badgesError);
    }
    
    // Get viewed modules
    const { data: viewedModules, error: viewedError } = await supabase
      .from('user_module_views')
      .select('*')
      .eq('user_id', userId);
    
    if (viewedError) {
      console.error('Error fetching viewed modules:', viewedError);
    }
    
    return {
      progress: progress || {
        current_level: 'basics',
        current_module: 'module1',
        current_card: 0
      },
      completedModules: completedModules || [],
      quizResults: quizResults || [],
      earnedBadges: earnedBadges || [],
      viewedModules: viewedModules || []
    };
  } catch (error) {
    console.error('Exception fetching education data:', error);
    return null;
  }
};

// Function to update user progress
export const updateUserProgress = async (userId: string, progressData: { 
  current_level?: string; 
  current_module?: string; 
  current_card?: number; 
}) => {
  try {
    const { error } = await supabase
      .from('user_education_progress')
      .update({
        current_level: progressData.current_level,
        current_module: progressData.current_module,
        current_card: progressData.current_card
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
};

// New function to fetch module quiz data from Supabase
export const fetchModuleQuizData = async (moduleId: string): Promise<{
  questions: QuizQuestion[];
} | null> => {
  try {
    // Fetch questions for this module
    const { data: questionsData, error: questionsError } = await supabase
      .from('education_quiz_questions')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index');
      
    if (questionsError) {
      console.error('Error fetching quiz questions:', questionsError);
      toast.error('Failed to load quiz questions');
      return null;
    }
    
    if (!questionsData || questionsData.length === 0) {
      console.warn('No quiz questions found for module:', moduleId);
      return null;
    }
    
    // For each question, fetch its answers
    const questions: QuizQuestion[] = [];
    
    for (const question of questionsData) {
      const { data: answersData, error: answersError } = await supabase
        .from('education_quiz_answers')
        .select('*')
        .eq('question_id', question.id)
        .order('order_index');
        
      if (answersError) {
        console.error('Error fetching answers:', answersError);
        continue;
      }
      
      if (!answersData || answersData.length === 0) {
        console.warn('No answers found for question:', question.id);
        continue;
      }
      
      // Map the database answer format to our app answer format
      const options = answersData.map(answer => answer.answer_text);
      const correctAnswer = answersData.findIndex(answer => answer.is_correct);
      
      questions.push({
        question: question.question,
        options,
        correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
        explanation: question.explanation || ''
      });
    }
    
    return {
      questions
    };
  } catch (error) {
    console.error('Exception fetching quiz data:', error);
    return null;
  }
};
