
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
          .from('pricing_adminpanel')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          throw error;
        }

        setPlans(data || []);
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
