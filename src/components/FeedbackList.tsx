
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface SignupRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const FeedbackList: React.FC = () => {
  const [signups, setSignups] = useState<SignupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('signup')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setSignups(data || []);
      } catch (err: any) {
        console.error('Error fetching signups:', err);
        setError(err.message || 'Failed to load signups');
      } finally {
        setLoading(false);
      }
    };

    fetchSignups();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg">
        <p className="text-gray-400 text-sm">Loading sign ups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
        <p className="text-red-200 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (signups.length === 0) {
    return (
      <div className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg">
        <p className="text-gray-400 text-sm">No sign ups yet. Be the first to sign up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">      
      {signups.map((signup) => (
        <div 
          key={signup.id} 
          className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-white">{signup.name}</h3>
            <span className="text-xs text-gray-400">
              {new Date(signup.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-2">{signup.message}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
