
import { useState, useEffect } from "react";
import { BrokerField } from "@/types/broker";
import { supabase } from "@/integrations/supabase/client";

export const useBrokerFields = (brokerId: number | null) => {
  const [fields, setFields] = useState<BrokerField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrokerFields = async () => {
      if (!brokerId) {
        setFields([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('brokers_admin_panel')
          .select('*')
          .eq('broker_id', brokerId)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;

        setFields(data || []);
      } catch (err: any) {
        console.error("Error fetching broker fields:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokerFields();
  }, [brokerId]);

  return {
    fields,
    isLoading,
    error
  };
};
