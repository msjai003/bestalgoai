
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        console.log("Fetching feedback from Supabase...");
        
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching feedback:', error);
          throw new Error(error.message);
        }

        console.log("Feedback fetched successfully:", data);
        setFeedbacks(data || []);
      } catch (err: any) {
        console.error('Error fetching feedback:', err);
        setError(err.message);
        toast({
          title: "Failed to load feedback",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800/40 border border-gray-700 rounded-lg">
        <p className="text-gray-400 text-center">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-800/40 border border-gray-700 rounded-lg">
        <p className="text-red-400 text-center">Error: {error}</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="p-6 bg-gray-800/40 border border-gray-700 rounded-lg">
        <p className="text-gray-400 text-center">No feedback submitted yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <div 
          key={feedback.id} 
          className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-white">{feedback.name}</h3>
            <span className="text-xs text-gray-400">
              {new Date(feedback.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-2">{feedback.message}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
