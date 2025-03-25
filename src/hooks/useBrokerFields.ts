
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BrokerField {
  id: number;
  broker_id: number;
  broker_name: string;
  field_name: string;
  field_type: string;
  display_name: string;
  placeholder: string;
  is_required: boolean;
  is_secret: boolean;
  sort_order: number;
}

export const useBrokerFields = (brokerId?: number) => {
  const [fields, setFields] = useState<BrokerField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrokerFields = async () => {
      if (!brokerId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('brokers_adminpanel')
          .select('*')
          .eq('broker_id', brokerId)
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        
        setFields(data as BrokerField[]);
      } catch (err: any) {
        console.error("Error fetching broker fields:", err);
        setError(err.message);
        toast.error("Failed to load broker fields");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokerFields();
  }, [brokerId]);

  return {
    fields,
    isLoading,
    error,
  };
};
