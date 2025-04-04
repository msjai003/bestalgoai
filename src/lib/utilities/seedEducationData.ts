
import { educationData } from "@/data/educationData";
import { createQuizQuestion, createQuizAnswer } from "@/lib/services/educationService";
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

/**
 * Seeds the module 1 quiz questions and answers to the Supabase database.
 * This function can be called from the admin panel or directly to ensure 
 * that module 1 data is properly stored in the database.
 */
export const seedModule1QuizData = async (): Promise<boolean> => {
  try {
    console.log("Starting to seed Module 1 quiz data...");
    
    // First, check if module1 exists or get its UUID
    const { data: moduleData, error: moduleError } = await supabase
      .from('education_modules')
      .select('id')
      .eq('level', 'basics')
      .eq('order_index', 1)
      .maybeSingle();
    
    if (moduleError) {
      console.error("Error fetching module:", moduleError);
      toast.error("Failed to find Module 1 in database");
      return false;
    }
    
    if (!moduleData) {
      console.error("Module 1 not found in database");
      toast.error("Module 1 not found in database");
      return false;
    }
    
    const moduleId = moduleData.id;
    console.log("Found module with ID:", moduleId);
    
    // Get module 1 quiz data from local data
    const module1 = educationData.basics.find(m => m.id === 'module1');
    if (!module1 || !module1.quiz || !module1.quiz.questions) {
      console.error("No quiz questions found in local data for module 1");
      toast.error("Quiz questions not found in local data");
      return false;
    }
    
    // Check if we already have questions for this module to avoid duplicates
    const { count, error: countError } = await supabase
      .from('education_quiz_questions')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', moduleId);
      
    if (countError) {
      console.error("Error counting questions:", countError);
    } else if (count && count > 0) {
      console.log(`${count} questions already exist for module. Skipping seeding.`);
      toast.info(`Module already has ${count} questions`);
      return true;
    }
    
    // Process each quiz question
    for (let i = 0; i < module1.quiz.questions.length; i++) {
      const question = module1.quiz.questions[i];
      console.log(`Processing question ${i+1}:`, question.question);
      
      // Insert question
      const newQuestion = await createQuizQuestion({
        module_id: moduleId,
        question: question.question,
        explanation: question.explanation || null,
        order_index: i
      });
      
      if (!newQuestion) {
        console.error(`Failed to create question ${i+1}`);
        continue;
      }
      
      // Insert answers
      for (let j = 0; j < question.options.length; j++) {
        const answerText = question.options[j];
        const isCorrect = j === question.correctAnswer;
        
        await createQuizAnswer({
          question_id: newQuestion.id,
          answer_text: answerText,
          is_correct: isCorrect,
          order_index: j
        });
      }
    }
    
    console.log("Successfully seeded Module 1 quiz data");
    toast.success("Module 1 quiz data has been successfully added to database");
    return true;
  } catch (error) {
    console.error("Error seeding Module 1 quiz data:", error);
    toast.error("Failed to seed quiz data");
    return false;
  }
};
