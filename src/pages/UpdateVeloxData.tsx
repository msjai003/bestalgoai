
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const UpdateVeloxData = () => {
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const updateVeloxData = async () => {
    setLoading(true);
    setUpdateStatus('idle');
    
    try {
      // First, clear the veloxedge_metrics table to ensure clean data
      const { error: clearError } = await supabase
        .from('veloxedge_metrics')
        .delete()
        .neq('id', 0); // Delete all records
      
      if (clearError) {
        console.error("Error clearing Velox metrics:", clearError);
        toast.error(`Error clearing metrics: ${clearError.message}`);
      } else {
        console.log("Successfully cleared Velox Edge metrics table");
      }
      
      // Now invoke the update function to generate new data
      const { data, error } = await supabase.functions.invoke('update-velox-data', {
        body: { strategy: 'velox' },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Velox Edge data updated successfully');
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
      <h1 className="text-2xl font-bold mb-4">Update Velox Edge Strategy Data</h1>
      
      <div className="mb-6">
        <p className="text-gray-400 mb-4">
          Use the button below to reset and update the Velox Edge data. This will clear existing metrics and populate the new metrics required for the strategy report.
        </p>
        
        <Button 
          onClick={updateVeloxData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            'Update Velox Edge Data'
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
        <Link to="/zenflow-backtest-report?strategy=velox" className="text-cyan underline block">
          View Velox Edge Strategy Report
        </Link>
        <p className="text-xs text-gray-500">
          Note: After updating the data, you may need to refresh the report page to see the changes.
        </p>
      </div>
    </div>
  );
};

export default UpdateVeloxData;
