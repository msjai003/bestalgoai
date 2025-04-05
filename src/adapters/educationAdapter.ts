
import { supabase } from '@/integrations/supabase/client';
import { Level } from '@/hooks/useEducation';
import { QuizQuestion } from '@/data/educationData';

// Function to fetch user education data
export const fetchUserEducationData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_education_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user education data:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching user education data:", error);
    return null;
  }
};

// Function to mark a module as viewed
export const markModuleViewed = async (userId: string, moduleId: string) => {
  try {
    const { error } = await supabase
      .from('user_module_views')
      .insert([
        { user_id: userId, module_id: moduleId }
      ]);
    
    if (error) {
      console.error("Error marking module as viewed:", error);
    }
  } catch (error) {
    console.error("Error marking module as viewed:", error);
  }
};

// Function to mark a module as completed
export const markModuleCompleted = async (userId: string, moduleId: string, level: Level) => {
  try {
    const { error } = await supabase
      .from('user_completed_modules')
      .insert([
        { user_id: userId, module_id: moduleId, level: level }
      ]);
    
    if (error) {
      console.error("Error marking module as completed:", error);
    }
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
    const { moduleId, score, totalQuestions, passed, timeSpent } = quizResult;
    
    const { error } = await supabase
      .from('user_quiz_results')
      .insert([
        { 
          user_id: userId, 
          module_id: moduleId, 
          score: score, 
          total_questions: totalQuestions,
          passed: passed,
          time_spent: timeSpent
        }
      ]);
    
    if (error) {
      console.error("Error saving quiz result:", error);
    }
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
};

// Function to save earned badge
export const saveEarnedBadge = async (userId: string, badgeId: string) => {
  try {
    const { error } = await supabase
      .from('user_earned_badges')
      .insert([
        { user_id: userId, badge_id: badgeId }
      ]);
    
    if (error) {
      console.error("Error saving earned badge:", error);
    }
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
    const { currentModule } = progress;
    
    const { error } = await supabase
      .from('user_education_progress')
      .update({ current_module: currentModule })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error updating education progress:", error);
    }
  } catch (error) {
    console.error("Error updating education progress:", error);
  }
};

// Improved function to fetch module quiz data from Supabase
export const fetchModuleQuizData = async (moduleId: string, level: string = 'basics'): Promise<{
  questions: QuizQuestion[];
} | null> => {
  try {
    console.log('Fetching quiz data for module:', moduleId, 'level:', level);
    
    // Check if the moduleId is a standard ID format like "module1" or a UUID
    let actualModuleId = moduleId;
    let moduleLevel = level || 'basics'; // Default to basics if no level specified
    
    // If moduleId is not a UUID (like "module1"), try to find the actual module
    if (!moduleId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const moduleNumber = parseInt(moduleId.replace('module', '')) || 1;
      console.log(`Looking for module with order_index ${moduleNumber} in level '${moduleLevel}'`);
      
      const { data: moduleData, error: moduleError } = await supabase
        .from('education_modules')
        .select('id')
        .eq('level', moduleLevel)
        .eq('order_index', moduleNumber)
        .maybeSingle();
      
      if (moduleError) {
        console.error('Error finding module ID:', moduleError);
        return null;
      }
      
      if (moduleData) {
        actualModuleId = moduleData.id;
        console.log(`Found module ID: ${actualModuleId}`);
      } else {
        console.warn('Module not found, using original ID');
      }
    }
    
    // Now get the questions for this module and level
    const { data: questionsData, error: questionsError } = await supabase
      .from('education_quiz_questions')
      .select(`
        id,
        question,
        explanation,
        order_index,
        level,
        education_quiz_answers (
          id,
          answer_text,
          is_correct,
          order_index
        )
      `)
      .eq('module_id', actualModuleId)
      .eq('level', moduleLevel)
      .order('order_index');
    
    if (questionsError) {
      console.error('Error fetching quiz questions:', questionsError);
      return null;
    }
    
    if (!questionsData || questionsData.length === 0) {
      console.log('No quiz questions found for this module and level');
      return { questions: [] };
    }
    
    // Format the data to match our expected structure
    const questions = questionsData.map(question => {
      if (!question || !question.education_quiz_answers) {
        console.error('Invalid question data:', question);
        return null;
      }
      
      // Format answers from the nested query
      const answers = (question.education_quiz_answers || []).map((answer: any) => ({
        id: answer.id,
        answer_text: answer.answer_text,
        is_correct: answer.is_correct,
        order_index: answer.order_index,
        question_id: question.id
      }));
      
      // Get the index of the correct answer for our frontend format
      const correctAnswer = answers.findIndex((a: any) => a.is_correct);
      
      // Format the question object
      return {
        id: question.id,
        question: question.question,
        explanation: question.explanation,
        options: answers.map((a: any) => a.answer_text),
        correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
        level: question.level
      };
    }).filter(Boolean) as QuizQuestion[];
    
    console.log(`Found ${questions.length} quiz questions for this module and level`);
    return { questions };
    
  } catch (error) {
    console.error('Error in fetchModuleQuizData:', error);
    return null;
  }
};
