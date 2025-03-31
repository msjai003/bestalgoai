
import React, { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { RefreshCw, Book, Award } from 'lucide-react';
import ModuleManager from '@/components/admin/education/ModuleManager';
import BadgeManager from '@/components/admin/education/BadgeManager';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const AdminEducation = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(true); // In a real scenario, you'd fetch this from Supabase
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-4">You don't have permission to access this page.</p>
      </div>
    );
  }

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
              <ModuleManager />
            </TabsContent>
            
            <TabsContent value="badges">
              <BadgeManager />
            </TabsContent>
          </Tabs>
        </main>
        
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
};

export default AdminEducation;
