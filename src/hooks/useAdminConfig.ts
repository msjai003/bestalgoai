
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type FeatureName = 
  | 'razorpay_config' 
  | 'app_theme' 
  | 'feature_flags';

interface AdminPanelConfig {
  id: string;
  feature_name: FeatureName;
  feature_value: any;
  is_enabled: boolean;
  description: string;
}

export const useAdminConfig = (featureName: FeatureName) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('admin_panel')
          .select('*')
          .eq('feature_name', featureName)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setConfig(data.feature_value);
        }
      } catch (err: any) {
        console.error(`Error fetching ${featureName} config:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [featureName]);

  return { config, loading, error };
};

export default useAdminConfig;
