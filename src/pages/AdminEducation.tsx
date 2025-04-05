
import React, { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Book, Award, Database, ArrowUpDown } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
          
          <Alert className="mb-6 bg-red-900/20 border-red-800 text-red-100">
            <Database className="h-4 w-4 text-red-500" />
            <AlertTitle>Database Tables Removed</AlertTitle>
            <AlertDescription>
              The core education tables (education_modules, education_quiz_questions, education_quiz_answers) have been 
              completely removed from the database. This admin panel is non-functional. The app is now using local data 
              for education content.
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
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-center mb-6">
                  <Database className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Database Tables Removed</h3>
                  <p className="text-gray-300 max-w-md mx-auto">
                    Education module management is unavailable because required database tables have been removed.
                    The application now uses local static data.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium mb-2 flex items-center"><ArrowUpDown className="h-4 w-4 mr-2 text-amber-500" /> Missing Tables</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• education_modules</li>
                      <li>• education_quiz_questions</li>
                      <li>• education_quiz_answers</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium mb-2 flex items-center"><InfoIcon className="h-4 w-4 mr-2 text-cyan" /> Alternative</h4>
                    <p className="text-sm text-gray-400">
                      All education content is now served from local static data in src/data/educationData.ts
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="badges">
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                <p className="text-gray-300 mb-4">Badge management functionality is unavailable because required database tables have been removed.</p>
                <Button variant="outline" className="border-cyan text-cyan hover:bg-cyan/10" disabled>
                  View Remaining Database Tables
                </Button>
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
