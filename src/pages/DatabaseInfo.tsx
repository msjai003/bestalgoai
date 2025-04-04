import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Info, RefreshCw } from 'lucide-react';

const DatabaseInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const populateSampleData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add sample signup
      const { error: signupError } = await supabase
        .from('signup')
        .insert({
          name: 'Sample User',
          email: 'sample@example.com',
          message: 'I am interested in algorithmic trading!'
        });

      if (signupError) {
        throw new Error(`Error adding sample signup: ${signupError.message}`);
      }

      // Get the latest signup records
      const { data: signups, error: fetchError } = await supabase
        .from('signup')
        .select()
        .order('created_at', { ascending: false })
        .limit(5);

      if (fetchError) {
        throw new Error(`Error fetching signup data: ${fetchError.message}`);
      }

      setResult({
        success: true,
        message: 'Sample data added successfully!',
        data: {
          signups
        }
      });

      toast.success('Sample data added successfully!');
    } catch (err: any) {
      console.error('Error populating sample data:', err);
      setError(err.message || 'An error occurred while adding sample data');
      toast.error(err.message || 'Failed to add sample data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Database Information</h1>
      
      <section className="mb-8 p-6 bg-gray-800/40 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-medium mb-4">Test Database Connection</h2>
        <p className="text-gray-300 mb-4">
          Click the button below to add a sample signup record to the database and verify the connection:
        </p>
        
        <Button 
          onClick={populateSampleData} 
          disabled={isLoading}
          className="w-full md:w-auto flex items-center gap-2"
        >
          {isLoading ? 'Adding...' : 'Add Sample Signup'}
          {isLoading && <RefreshCw className="animate-spin h-4 w-4" />}
        </Button>
        
        {error && (
          <Alert className="mt-4 bg-red-900/30 border-red-700">
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {result && (
          <div className="mt-6">
            <Alert className="bg-green-900/30 border-green-700 mb-4">
              <Info className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200 ml-2">
                {result.message}
              </AlertDescription>
            </Alert>
            
            {result.data?.signups && (
              <div>
                <h3 className="text-lg font-medium mb-2">Recent Signups:</h3>
                <div className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(result.data.signups, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default DatabaseInfo;
