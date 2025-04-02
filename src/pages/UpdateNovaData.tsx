
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UpdateNovaData = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpdateNovaData = async () => {
    setLoading(true);
    setSuccess(false);
    
    try {
      // First, check if the function exists
      const { data: functionData, error: functionError } = await supabase.functions.invoke('update-velox-data', {
        body: { strategy: 'nova' },
      });

      if (functionError) {
        throw new Error(`Error calling edge function: ${functionError.message}`);
      }

      console.log('Function response:', functionData);
      
      if (functionData.success) {
        setResult(functionData);
        setSuccess(true);
        toast.success(functionData.message || 'Nova Glide data updated successfully');
      } else {
        throw new Error(functionData.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error updating Nova Glide data:', error);
      toast.error(`Failed to update Nova Glide data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen pt-8 px-4">
      <div className="max-w-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Nova Glide Data Management</h1>
          <p className="text-charcoalTextSecondary">Update and refresh the Nova Glide strategy backtest data</p>
        </header>

        <Card className="bg-charcoalSecondary/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Update Nova Glide Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-charcoalTextSecondary">
              This action will refresh the Nova Glide strategy data in the database. This will affect all users viewing the Nova Glide strategy reports.
            </p>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleUpdateNovaData}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Updated
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Data
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                asChild
              >
                <Link to="/zenflow-backtest-report?strategy=nova">
                  View Report
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {success && result && (
          <Card className="bg-green-950/30 border-green-700 mb-6">
            <CardHeader>
              <CardTitle className="text-green-400">Update Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-2">{result.message}</p>
              <p className="text-gray-400 text-sm">
                Strategy data has been updated. You can now view the latest data in the Nova Glide Strategy Report.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/backtest-report">
              Backtest Reports
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNovaData;
