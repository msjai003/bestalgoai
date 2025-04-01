
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UpdateVeloxData = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const updateVeloxData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-velox-data');
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setResult(JSON.stringify(error, null, 2));
      } else {
        toast({
          title: "Success",
          description: "Zenflow Strategy data updated successfully",
        });
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error("Error updating data:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setResult(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/zenflow-backtest" className="p-2">
            <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Update Zenflow Data</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-20 pb-20 px-4">
        <div className="flex flex-col items-center space-y-6">
          <p className="text-white text-center">
            This page will update the Zenflow Strategy data in the database.
          </p>
          
          <Button 
            onClick={updateVeloxData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            {loading ? 'Updating Data...' : 'Update Zenflow Data'}
          </Button>
          
          {result && (
            <div className="mt-6 w-full">
              <h2 className="text-white font-medium mb-2">Result:</h2>
              <pre className="bg-charcoalSecondary/50 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto max-h-96 overflow-y-auto">
                {result}
              </pre>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <Link to="/zenflow-backtest-report?strategy=zenflow">
              <Button variant="outline">
                View Zenflow Strategy Report
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default UpdateVeloxData;
