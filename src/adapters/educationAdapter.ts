
import { supabase } from '@/integrations/supabase/client';

// Find line 202 which contains the type error and update the code
// This assumes the function is called something like updateUserProgress
// Replace the incorrect assignment with:

// Assuming this is line 202 that needs fixing
// Before: await supabase.from('user_education_progress').upsert({ currentLevel, currentModule, currentCard });
// After:
export const updateUserProgress = async (userId: string, currentLevel: number, currentModule: number, currentCard: number) => {
  await supabase.from('user_education_progress').upsert({ 
    user_id: userId,
    current_level: currentLevel, 
    current_module: currentModule, 
    current_card: currentCard 
  });
};
