
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const UpdateVeloxData = () => {
  const [loading, setLoading] = useState(false);
  
  const updateVeloxData = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('update-velox-data', {
        body: { strategy: 'velox' },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Velox Edge data updated successfully');
      console.log('Update result:', data);
    } catch (error: any) {
      toast.error(`Error updating data: ${error.message}`);
      console.error('Error updating data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Velox Edge Strategy Data</h1>
      
      <div className="mb-6">
        <p className="text-gray-400 mb-4">
          Click the button below to update the Velox Edge Strategy data in the database.
        </p>
        
        <Button 
          onClick={updateVeloxData}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Velox Edge Data'}
        </Button>
      </div>
      
      <div className="mt-6">
        <Link to="/zenflow-backtest-report?strategy=velox" className="text-cyan underline">
          View Velox Edge Strategy Report
        </Link>
      </div>
    </div>
  );
};

export default UpdateVeloxData;
