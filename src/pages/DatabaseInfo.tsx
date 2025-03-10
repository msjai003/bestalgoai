
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatabaseStatus from '@/components/DatabaseStatus';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const DatabaseInfo: React.FC = () => {
  const addSampleData = async () => {
    try {
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-xl shadow-lg"
          >
            Add Sample Data
          </Button>
          
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
