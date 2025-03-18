
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { PredefinedStrategy } from '@/types/predefined-strategy';

type AdminContextType = {
  fetchPredefinedStrategies: () => Promise<PredefinedStrategy[]>;
  updatePredefinedStrategy: (
    id: string, 
    data: { name?: string; description?: string }
  ) => Promise<boolean>;
  deletePredefinedStrategy: (id: string) => Promise<boolean>;
  createPredefinedStrategy: (strategy: Omit<PredefinedStrategy, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  isAdmin: boolean;
};

const AdminContext = createContext<AdminContextType>({
  fetchPredefinedStrategies: async () => [],
  updatePredefinedStrategy: async () => false,
  deletePredefinedStrategy: async () => false,
  createPredefinedStrategy: async () => false,
  isAdmin: false,
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin when component mounts
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // In a real app, you'd check user claims from auth
        // For now, we'll just mock it
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const fetchPredefinedStrategies = async (): Promise<PredefinedStrategy[]> => {
    try {
      // We're using a type assertion here to work with the existing database structure
      // This is a temporary solution until we can properly define the database schema
      const { data, error } = await supabase
        .from('predefined_strategies')
        .select('*') as { data: PredefinedStrategy[] | null, error: any };

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching predefined strategies:', error);
      toast.error('Failed to fetch predefined strategies');
      return [];
    }
  };

  const updatePredefinedStrategy = async (
    id: string,
    data: { name?: string; description?: string }
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('predefined_strategies')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Strategy updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating predefined strategy:', error);
      toast.error('Failed to update strategy');
      return false;
    }
  };

  const deletePredefinedStrategy = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('predefined_strategies')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Strategy deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting predefined strategy:', error);
      toast.error('Failed to delete strategy');
      return false;
    }
  };

  const createPredefinedStrategy = async (
    strategy: Omit<PredefinedStrategy, 'id' | 'created_at' | 'updated_at'>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('predefined_strategies').insert({
        ...strategy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      toast.success('Strategy created successfully');
      return true;
    } catch (error) {
      console.error('Error creating predefined strategy:', error);
      toast.error('Failed to create strategy');
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        fetchPredefinedStrategies,
        updatePredefinedStrategy,
        deletePredefinedStrategy,
        createPredefinedStrategy,
        isAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
