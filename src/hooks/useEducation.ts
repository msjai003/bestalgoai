import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EducationItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  estimated_time: number;
  created_at: string;
}

interface UserProgress {
  education_id: string;
  completed: boolean;
}

export const useEducation = () => {
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchEducationItems();
      fetchUserProgress(userId);
    }
  }, [userId]);

  const fetchEducationItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        toast({
          title: "Error fetching education items",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEducationItems(data);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching education items",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the issue in the function where 'eq' is used
  const fetchUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_progress', { user_id_param: userId })
        .execute();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  };

  const markAsComplete = async (educationId: string) => {
    if (!userId) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to save progress.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_education_progress')
        .upsert(
          {
            user_id: userId,
            education_id: educationId,
            completed: true,
          },
          { onConflict: ['user_id', 'education_id'], ignoreDuplicates: false }
        );

      if (error) {
        toast({
          title: "Error marking as complete",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Education item marked as complete!",
        });
        // Refresh user progress after marking as complete
        fetchUserProgress(userId);
      }
    } catch (err: any) {
      toast({
        title: "Error marking as complete",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return {
    educationItems,
    userProgress,
    isLoading,
    error,
    markAsComplete,
  };
};
