import { useState, useEffect } from 'react';
import { educationData } from '@/data/educationData';
import { Level } from '@/hooks/useEducation';

// Return the same shape as educationData modules
export const useAIEducation = (currentLevel: Level, useRealData: boolean = false) => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, this would fetch from an AI service
    // For now, we'll return the same data with slight modifications
    setLoading(true);
    setError(null);

    try {
      if (useRealData) {
        // Simulate AI-enhanced modules by adding "AI" to titles and preserving all original data
        const enhancedModules = educationData[currentLevel].map(module => ({
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
        
        // Simulate an API delay
        setTimeout(() => {
          setModules(enhancedModules);
          setLoading(false);
        }, 500);
      } else {
        // If not using real data, return empty array to fallback to standard modules
        setModules([]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in AI education data:", err);
      setError("Failed to load AI-enhanced learning modules");
      setLoading(false);
      setModules([]);
    }
  }, [currentLevel, useRealData]);

  return {
    modules,
    loading,
    error
  };
};
