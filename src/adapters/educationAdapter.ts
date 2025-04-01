
import { supabase } from '@/integrations/supabase/client';

// Assuming this is line 202 that needs fixing - updating to match the expected structure
export const updateUserProgress = async (
  userId: string, 
  currentLevel: string, 
  currentModule: string, 
  currentCard: number
) => {
  // Now properly use the parameters
  await supabase.from('user_education_progress').upsert({ 
    user_id: userId,
    current_level: currentLevel, 
    current_module: currentModule, 
    current_card: currentCard 
  });
};
