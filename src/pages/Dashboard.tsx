
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const { data, error } = await supabase
          .from('welcome_messages')
          .select('message')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching welcome message:', error);
          return;
        }

        if (data && data.length > 0) {
          setWelcomeMessage(data[0].message);
          toast.info('Welcome Message', {
            description: data[0].message,
            duration: 5000
          });
        }
      } catch (err) {
        console.error('Exception fetching welcome message:', err);
      }
    };

    fetchWelcomeMessage();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {welcomeMessage && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
          <p className="text-blue-200 whitespace-pre-line">{welcomeMessage}</p>
        </div>
      )}

      {/* Rest of the dashboard content */}
    </div>
  );
};

export default Dashboard;
