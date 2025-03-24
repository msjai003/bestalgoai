
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type FeatureName = 
  | 'razorpay_config' 
  | 'app_theme' 
  | 'feature_flags';

// Define fallback configurations for when database fetch fails
const fallbackConfigs = {
  razorpay_config: {
    test_key: 'rzp_test_Q9hmPFiRhnZuqK',
    test_secret: 'UwAgfVIu0WyhWYVzvaemWse2',
    live_key: 'rzp_live_AlwIwA3L3AFrKc',
    live_secret: 'mVIVbHy7ATembdBaNfNaMvdv',
    mode: 'live' as const  // Changed default mode to 'live'
  }
};

export const useAdminConfig = <T>(featureName: FeatureName) => {
  const [config, setConfig] = useState<T | null>(null);
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
          console.error(`Error fetching ${featureName} config:`, error);
          
          // Use fallback config if database fetch fails
          if (featureName in fallbackConfigs) {
            console.log(`Using fallback config for ${featureName}`);
            setConfig(fallbackConfigs[featureName as keyof typeof fallbackConfigs] as T);
          } else {
            throw error;
          }
        } else if (data) {
          // Cast the feature_value to the expected type
          setConfig(data.feature_value as T);
        }
      } catch (err: any) {
        console.error(`Error in ${featureName} config:`, err);
        setError(err);
        
        // Use fallback even on other errors
        if (featureName in fallbackConfigs) {
          setConfig(fallbackConfigs[featureName as keyof typeof fallbackConfigs] as T);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [featureName]);

  return { config, loading, error };
};

export default useAdminConfig;
