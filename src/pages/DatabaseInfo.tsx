import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, ListX, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatabaseStatus from '@/components/DatabaseStatus';
import FeedbackList from '@/components/FeedbackList';
import FeedbackForm from '@/components/FeedbackForm';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';

const DatabaseInfo: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addSampleData = async () => {
    try {
      setIsLoading(true);
      // Add sample user (only works if already authenticated)
      const { data: authData } = await supabase.auth.getSession();
      
      if (authData.session?.user) {
        // User is logged in, use their ID
        const userId = authData.session.user.id;
        
        // Add/update user profile
        const { error: userError } = await supabase
          .from('users')
          .upsert({
            id: userId,
            name: 'Test User',
            email: authData.session.user.email,
            phonenumber: '555-123-4567'
          });
          
        if (userError) throw userError;
        
        toast.success('User profile updated successfully!');
      } else {
        // No user logged in, create sample feedback only
        toast.info('Not logged in. Only creating sample feedback.');
      }
      
      // Add sample feedback
      const { error: feedbackError } = await supabase
        .from('feedback')
        .insert({
          name: 'Sample User',
          email: 'sample@example.com',
          message: 'This is a sample feedback message to test the database connection.'
        });
        
      if (feedbackError) throw feedbackError;
      
      toast.success('Sample data added successfully!');
    } catch (error: any) {
      console.error('Error adding sample data:', error);
      toast.error(error.message || 'Failed to add sample data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-gray-400 mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Database Information</h1>
        </div>

        <DatabaseStatus />
        
        <div className="mt-8 space-y-4">
          <Button 
            onClick={addSampleData}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-xl shadow-lg"
          >
            {isLoading ? 'Adding Sample Data...' : 'Add Sample Data'}
          </Button>
          
          <div className="flex justify-between items-center mt-8 mb-4">
            <h2 className="text-xl font-semibold text-white">Feedback Data</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowFeedback(!showFeedback)}
              className="text-blue-400"
            >
              {showFeedback ? (
                <><ListX className="h-4 w-4 mr-2" /> Hide Feedback</>
              ) : (
                <><List className="h-4 w-4 mr-2" /> Show Feedback</>
              )}
            </Button>
          </div>
          
          {showFeedback && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Recent Feedback</h3>
                <FeedbackList />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Submit Feedback</h3>
                <FeedbackForm />
              </div>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="flex justify-center">
            <a 
              href="https://supabase.com/dashboard/project/fzvrozrjtvflksumiqsk/editor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Open Supabase SQL Editor</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInfo;
