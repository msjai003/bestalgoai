
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  checkAdminStatus: () => Promise<boolean>;
  fetchPredefinedStrategies: () => Promise<any[]>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }

      setIsAdmin(!!data);
      return !!data;
    } catch (error) {
      console.error('Exception checking admin status:', error);
      setIsAdmin(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredefinedStrategies = async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('predefined_strategies')
        .select('*');

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching predefined strategies:', error);
      toast.error('Failed to load predefined strategies');
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      isLoading,
      checkAdminStatus,
      fetchPredefinedStrategies
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
