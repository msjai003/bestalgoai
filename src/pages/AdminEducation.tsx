
import React, { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Book, Award } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const AdminEducation = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(true); // In a real scenario, you'd fetch this from Supabase

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
          <div className="flex items-center justify-between px-4 h-16">
            <h1 className="text-lg font-semibold">Education Management</h1>
          </div>
        </header>

        <main className="pt-20 px-4 pb-24">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Education Content Management</h2>
            <p className="text-gray-400">
              Manage education modules, content, quiz questions, and badges. All changes will immediately reflect in the user-facing education section.
            </p>
          </div>
          
          <Alert className="mb-6 bg-amber-900/20 border-amber-800 text-amber-100">
            <InfoIcon className="h-4 w-4 text-amber-500" />
            <AlertTitle>Database Tables Removed</AlertTitle>
            <AlertDescription>
              The education tables (education_modules, education_quiz_questions, education_quiz_answers) have been removed from the database. 
              This admin panel is currently non-functional. The app is using local data for education content.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="modules" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="modules" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Modules & Content</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Badges</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules">
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                <p className="text-gray-300">Education module management is unavailable because required database tables have been removed.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="badges">
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                <p className="text-gray-300">Badge management is unavailable because required database tables have been removed.</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
};

export default AdminEducation;
