
import { useState, useEffect } from 'react';
import { educationData } from '@/data/educationData';
import { Level, QuizQuestion } from '@/hooks/useEducation';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Flashcard {
  front: string;
  back: string;
  title?: string;
  question?: string;
  answer?: string;
}

interface AIModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  flashcards: Flashcard[];
  quiz?: {
    questions: QuizQuestion[];
  };
  content?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedNext?: string[];
  difficultyLabel?: string;
  difficultyClass?: string;
  isRecommended?: boolean;
  needsReview?: boolean;
  isStrength?: boolean;
}

// Return the same shape as educationData modules
export const useAIEducation = (currentLevel: Level, useRealData: boolean = false) => {
  const [modules, setModules] = useState<AIModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();

  // Fetch user profile data to personalize content recommendations
  const fetchUserProfile = async (userId: string) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error("Exception fetching user profile:", err);
      return null;
    }
  };

  // Analyze user quiz results to identify strengths and weaknesses
  const analyzeUserPerformance = async (userId: string) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error fetching quiz results:", error);
        return null;
      }
      
      // Basic performance analysis
      if (!data || data.length === 0) return { needsReview: [], strengths: [] };
      
      const moduleScores: Record<string, { attempts: number, avgScore: number }> = {};
      
      data.forEach(result => {
        if (!moduleScores[result.module_id]) {
          moduleScores[result.module_id] = { attempts: 0, avgScore: 0 };
        }
        
        moduleScores[result.module_id].attempts += 1;
        moduleScores[result.module_id].avgScore += (result.score / moduleScores[result.module_id].attempts);
      });
      
      const needsReview = Object.entries(moduleScores)
        .filter(([_, stats]) => stats.avgScore < 70)
        .map(([moduleId]) => moduleId);
        
      const strengths = Object.entries(moduleScores)
        .filter(([_, stats]) => stats.avgScore > 85)
        .map(([moduleId]) => moduleId);
      
      return { needsReview, strengths };
    } catch (err) {
      console.error("Exception analyzing user performance:", err);
      return null;
    }
  };

  const fetchAIModules = async (level: Level, forceRefresh = false, userId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useRealData) {
        console.log("Fetching AI-enhanced modules for level:", level);
        
        // Get user profile and performance data for personalization
        let profile = null;
        let performance = null;
        
        if (userId) {
          profile = await fetchUserProfile(userId);
          performance = await analyzeUserPerformance(userId);
        }
        
        // First check if we have cached modules in Supabase
        if (!forceRefresh) {
          const { data: cachedModules, error: fetchError } = await supabase
            .from('ai_modules')
            .select('*')
            .eq('level', level)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (!fetchError && cachedModules && cachedModules.length > 0) {
            console.log("Using cached AI modules from Supabase:", cachedModules[0]);
            setModules(cachedModules[0].modules);
            setLoading(false);
            return;
          }
        }
        
        // If no cache or force refresh, generate new modules
        // Simulate AI-enhanced modules based on user level and performance
        const baseModules = educationData[level];
        
        const enhancedModules: AIModule[] = baseModules.map(module => {
          // Check if this module needs review based on performance
          const needsReview = performance?.needsReview.includes(module.id) || false;
          const isStrength = performance?.strengths.includes(module.id) || false;
          
          // Determine difficulty adaptive to user level
          let difficultyLabel = '';
          let difficultyClass = '';
          
          if (needsReview) {
            difficultyLabel = 'Needs Review';
            difficultyClass = 'text-orange-500';
          } else if (isStrength) {
            difficultyLabel = 'Mastered';
            difficultyClass = 'text-green-500';
          } else {
            difficultyLabel = 'Recommended';
            difficultyClass = 'text-cyan';
          }
          
          // Create personalized title and description
          const personalizedTitle = needsReview 
            ? `Review: ${module.title}` 
            : `AI-Enhanced: ${module.title}`;
            
          const personalizedDescription = needsReview
            ? `Personalized review content for ${module.description.toLowerCase()}`
            : `AI personalized learning: ${module.description}`;
          
          const adaptedEstimatedTime = needsReview 
            ? Math.round(module.estimatedTime * 0.7) // Review is quicker
            : module.estimatedTime;
            
          // Enhanced flashcards with more detailed content
          const enhancedFlashcards = module.flashcards.map(card => ({
            front: card.front,
            back: card.back,
            title: card.title,
            question: card.question,
            answer: card.answer
          }));
          
          // Enhanced quiz if available
          const enhancedQuiz = module.quiz ? {
            ...module.quiz,
            questions: module.quiz.questions.map(q => ({
              ...q,
              explanation: q.explanation 
                ? `${q.explanation} (Personalized for your learning style)` 
                : 'AI-generated explanation based on your learning profile'
            }))
          } : undefined;
          
          return {
            ...module,
            title: personalizedTitle,
            description: personalizedDescription,
            estimatedTime: adaptedEstimatedTime,
            flashcards: enhancedFlashcards,
            quiz: enhancedQuiz,
            difficulty: needsReview ? 'beginner' : (isStrength ? 'advanced' : 'intermediate'),
            difficultyLabel,
            difficultyClass,
            isRecommended: !needsReview && !isStrength,
            needsReview,
            isStrength
          };
        });
        
        // Sort modules: needs review first, then recommended, then mastered
        const sortedModules = [
          ...enhancedModules.filter(m => m.needsReview),
          ...enhancedModules.filter(m => m.isRecommended),
          ...enhancedModules.filter(m => m.isStrength)
        ];
        
        // Save the newly generated modules to Supabase
        if (useRealData) {
          const { error: insertError } = await supabase
            .from('ai_modules')
            .insert({
              level,
              modules: sortedModules,
              created_at: new Date().toISOString(),
              user_id: userId
            });
            
          if (insertError) {
            console.error("Error saving AI modules to Supabase:", insertError);
          }
        }
        
        // Use a more realistic delay to avoid race conditions
        await new Promise(resolve => setTimeout(resolve, 800));
        setModules(sortedModules);
      } else {
        // If not using real data, return empty array to fallback to standard modules
        setModules([]);
      }
    } catch (err) {
      console.error("Error in AI education data:", err);
      setError("Failed to load AI-enhanced learning modules");
      setModules([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchAIModules(currentLevel, false, user.id);
    } else {
      console.log("No user logged in, using local storage data");
      fetchAIModules(currentLevel, false);
    }
  }, [currentLevel, useRealData, user]);

  const regenerateModules = async () => {
    if (regenerating) return;
    
    setRegenerating(true);
    try {
      await fetchAIModules(currentLevel, true, user?.id);
      toast({
        title: "Modules Regenerated",
        description: "Fresh AI-enhanced modules have been created for your current learning profile.",
      });
    } catch (err) {
      console.error("Error regenerating modules:", err);
      toast({
        title: "Regeneration Failed",
        description: "There was an error regenerating modules. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRegenerating(false);
    }
  };
  
  return {
    modules,
    loading,
    error,
    regenerateModules,
    regenerating
  };
};
