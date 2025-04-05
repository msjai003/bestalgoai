import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuizQuestion, QuizAnswer } from '@/data/educationData';
import { v4 as uuidv4 } from 'uuid';

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

// Improved function to fetch module quiz data from Supabase
export const fetchModuleQuizData = async (moduleId: string, level?: string): Promise<{
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
        console.error('Error finding module by order index:', moduleError);
        toast.error('Failed to find module');
        return null;
      }
      
      if (moduleData) {
        actualModuleId = moduleData.id;
        console.log('Found module ID by order index:', actualModuleId);
      } else {
        // If still not found, try direct lookup
        const { data: directModule, error: directError } = await supabase
          .from('education_modules')
          .select('id')
          .eq('id', moduleId)
          .maybeSingle();
          
        if (directError || !directModule) {
          console.error('Module not found:', moduleId);
          return null;
        }
          
        actualModuleId = directModule.id;
      }
    }
    
    console.log('Fetching questions for module ID:', actualModuleId);
    
    // Fetch questions for this module
    const { data: questionsData, error: questionsError } = await supabase
      .from('education_quiz_questions')
      .select('*')
      .eq('module_id', actualModuleId)
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
    
    console.log(`Found ${questionsData.length} questions for module ${moduleId}`);
    
    // For each question, fetch its answers
    const questions: QuizQuestion[] = [];
    
    for (const question of questionsData) {
      try {
        const { data: answersData, error: answersError } = await supabase
          .from('education_quiz_answers')
          .select('*')
          .eq('question_id', question.id)
          .order('order_index');
          
        if (answersError) {
          console.error(`Error fetching answers for question ${question.id}:`, answersError);
          continue;
        }
        
        let options: string[] = [];
        let correctAnswer = 0;
        
        // If we have answers from the database, use them
        if (answersData && answersData.length > 0) {
          options = answersData.map(answer => answer.answer_text);
          correctAnswer = answersData.findIndex(answer => answer.is_correct);
          
          if (correctAnswer < 0) correctAnswer = 0; // Default to first answer if none marked as correct
        } else {
          // Generate default answers if none exist
          console.warn(`No answers found for question: ${question.id}, using defaults`);
          
          // For questions with exact matches we can provide standard answers
          if (question.question.includes("primary function of a stock exchange")) {
            options = [
              "To regulate company operations",
              "To provide a centralized marketplace for trading securities",
              "To set stock prices for companies",
              "To allocate dividends to shareholders"
            ];
            correctAnswer = 1; // Second option
          } else if (question.question.includes("bull market")) {
            options = [
              "A market dominated by pessimistic investors",
              "A market characterized by falling prices",
              "A market characterized by rising prices and optimism",
              "A market with high trading volume but stable prices"
            ];
            correctAnswer = 2; // Third option
          } else if (question.question.includes("market capitalization")) {
            options = [
              "The total debt of a company",
              "The total assets a company owns",
              "The current stock price multiplied by the number of outstanding shares",
              "The annual revenue of a company"
            ];
            correctAnswer = 2; // Third option
          } else if (question.question.includes("market makers")) {
            options = [
              "They regulate market activities",
              "They provide liquidity by continuously buying and selling securities",
              "They determine opening and closing prices",
              "They predict market trends for investors"
            ];
            correctAnswer = 1; // Second option
          } else if (question.question.includes("bid-ask spread")) {
            options = [
              "The difference between a stock's 52-week high and low",
              "The difference between the highest price a buyer will pay and lowest a seller will accept",
              "The difference between market open and close prices",
              "The profit margin for brokers on each trade"
            ];
            correctAnswer = 1; // Second option
          } else if (question.question.includes("limit order")) {
            options = [
              "An order to buy or sell a security at a specific price or better",
              "An order that must be executed immediately at market price",
              "An order that expires at the end of the trading day",
              "An order with a maximum quantity limit"
            ];
            correctAnswer = 0; // First option
          } else if (question.question.includes("going long")) {
            options = [
              "Holding a position for many years",
              "Buying a security with the expectation its value will increase",
              "Selling a security you don't own, expecting to buy it back later at a lower price",
              "Trading with borrowed money from a broker"
            ];
            correctAnswer = 1; // Second option
          } else {
            // Generic options for other questions
            options = [
              "Option A - This might be correct",
              "Option B - This could be the answer",
              "Option C - Consider this option",
              "Option D - This is another possibility"
            ];
            correctAnswer = 0; // Default to first answer
          }
        }
        
        questions.push({
          id: question.id,
          question: question.question,
          options,
          correctAnswer,
          explanation: question.explanation || ''
        });
      } catch (error) {
        console.error(`Exception processing question ${question.id}:`, error);
      }
    }
    
    if (questions.length === 0) {
      console.error('Failed to process any questions for this module');
      return null;
    }
    
    return {
      questions
    };
  } catch (error) {
    console.error('Exception fetching quiz data:', error);
    return null;
  }
};
