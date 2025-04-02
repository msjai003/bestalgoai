
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const UpdateNovaData = () => {
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const updateNovaData = async () => {
    setLoading(true);
    setUpdateStatus('idle');
    
    try {
      // Invoke the update function to generate new data
      const { data, error } = await supabase.functions.invoke('update-velox-data', {
        body: { strategy: 'nova' },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Nova Glide data updated successfully');
      console.log('Update result:', data);
      setUpdateStatus('success');
    } catch (error: any) {
      toast.error(`Error updating data: ${error.message}`);
      console.error('Error updating data:', error);
      setUpdateStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Nova Glide Strategy Data</h1>
      
      <div className="mb-6">
        <p className="text-gray-400 mb-4">
          Use the button below to update the Nova Glide data. This will populate the data required for the strategy report.
        </p>
        
        <Button 
          onClick={updateNovaData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            'Update Nova Glide Data'
          )}
        </Button>
        
        {updateStatus === 'success' && (
          <p className="mt-3 text-green-500 text-sm">
            Data updated successfully! The metrics are now available in the report.
          </p>
        )}
        
        {updateStatus === 'error' && (
          <p className="mt-3 text-red-500 text-sm">
            Failed to update data. Please try again or check console for errors.
          </p>
        )}
      </div>
      
      <div className="mt-6 space-y-2">
        <Link to="/zenflow-backtest-report?strategy=nova" className="text-cyan underline block">
          View Nova Glide Strategy Report
        </Link>
        <p className="text-xs text-gray-500">
          Note: After updating the data, you may need to refresh the report page to see the changes.
        </p>
      </div>
    </div>
  );
};

export default UpdateNovaData;
