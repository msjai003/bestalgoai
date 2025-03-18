
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ConfigOption {
  id: string;
  category: string;
  value: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
}

/**
 * Hook to fetch and manage strategy configuration options
 */
export const useStrategyConfigOptions = (category?: string) => {
  const queryClient = useQueryClient();
  
  // Fetch config options
  const { data: options, isLoading, error, refetch } = useQuery({
    queryKey: ['strategy-config-options', category],
    queryFn: async () => {
      let query = supabase
        .from('strategy_config_options')
        .select('*');
        
      // Filter by category if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Only fetch active options
      query = query.eq('is_active', true);
      
      // Order by sort_order
      query = query.order('sort_order', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching strategy config options:', error);
        throw error;
      }
      
      return data as ConfigOption[];
    }
  });
  
  // Get options by category
  const getOptionsByCategory = (categoryName: string) => {
    if (!options) return [];
    return options.filter(option => option.category === categoryName && option.is_active);
  };
  
  // Add new option
  const addMutation = useMutation({
    mutationFn: async (newOption: Omit<ConfigOption, 'id'>) => {
      const { data, error } = await supabase
        .from('strategy_config_options')
        .insert(newOption)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Option added successfully');
      queryClient.invalidateQueries({ queryKey: ['strategy-config-options'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add option: ${error.message}`);
    }
  });
  
  // Update option
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ConfigOption> & { id: string }) => {
      const { data, error } = await supabase
        .from('strategy_config_options')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Option updated successfully');
      queryClient.invalidateQueries({ queryKey: ['strategy-config-options'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update option: ${error.message}`);
    }
  });
  
  // Delete option
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('strategy_config_options')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Option deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['strategy-config-options'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete option: ${error.message}`);
    }
  });
  
  return {
    options,
    isLoading,
    error,
    refetch,
    getOptionsByCategory,
    addOption: addMutation.mutate,
    updateOption: updateMutation.mutate,
    deleteOption: deleteMutation.mutate
  };
};
