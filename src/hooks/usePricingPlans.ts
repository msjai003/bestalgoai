
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PricingPlan {
  id: string;
  plan_id: string;
  plan_name: string;
  plan_description: string;
  plan_price: string;
  plan_period: string;
  is_popular: boolean;
  features: string[];
  sort_order: number;
  is_active: boolean;
}

export const usePricingPlans = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('price_admin')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          throw error;
        }

        // Transform the data to ensure features is always a string array
        const transformedData = data?.map(plan => {
          let features: string[] = [];
          
          // Handle different possible formats of the features field
          if (Array.isArray(plan.features)) {
            // Convert each item in the array to string
            features = plan.features.map(item => String(item));
          } else if (typeof plan.features === 'string') {
            try {
              const parsed = JSON.parse(plan.features);
              features = Array.isArray(parsed) ? parsed.map(item => String(item)) : [String(plan.features)];
            } catch {
              features = [String(plan.features)];
            }
          } else if (plan.features) {
            features = [String(plan.features)];
          }
          
          return {
            ...plan,
            features
          } as PricingPlan;
        }) || [];

        setPlans(transformedData);
      } catch (err) {
        console.error('Error fetching pricing plans:', err);
        setError('Failed to load pricing plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  return { plans, isLoading, error };
};
