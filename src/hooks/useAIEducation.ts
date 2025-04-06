import { useState, useEffect } from 'react';
import { educationData } from '@/data/educationData';
import { Level } from '@/hooks/useEducation';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';

// Return the same shape as educationData modules
export const useAIEducation = (currentLevel: Level, useRealData: boolean = false) => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const fetchAIModules = async (level: Level, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useRealData) {
        console.log("Fetching AI-enhanced modules for level:", level);
        
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
        // Simulate AI-enhanced modules by adding "AI" to titles and preserving all original data
        const enhancedModules = educationData[level].map(module => ({
          ...module,
          title: `AI-Enhanced: ${module.title}`,
          description: `AI personalized learning: ${module.description}`,
          // Make sure to include the quiz data from the original module
          quiz: module.quiz ? {
            ...module.quiz,
            questions: module.quiz.questions.map(q => ({
              ...q,
              // Add some AI context to the questions but keep the same structure
              question: q.question,
              explanation: q.explanation ? `${q.explanation} (AI optimized)` : 'AI optimized explanation'
            }))
          } : undefined
        }));
        
        // Save the newly generated modules to Supabase
        if (useRealData) {
          const { error: insertError } = await supabase
            .from('ai_modules')
            .insert({
              level,
              modules: enhancedModules,
              created_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error("Error saving AI modules to Supabase:", insertError);
          }
        }
        
        // Use a more realistic delay to avoid race conditions
        await new Promise(resolve => setTimeout(resolve, 800));
        setModules(enhancedModules);
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
    fetchAIModules(currentLevel);
  }, [currentLevel, useRealData]);

  const regenerateModules = async () => {
    if (regenerating) return;
    
    setRegenerating(true);
    try {
      await fetchAIModules(currentLevel, true);
      toast({
        title: "Modules Regenerated",
        description: "Fresh AI-enhanced modules have been created for you.",
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
