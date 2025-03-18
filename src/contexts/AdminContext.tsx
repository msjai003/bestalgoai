
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  checkAdminStatus: () => Promise<void>;
}

const defaultContext: AdminContextType = {
  isAdmin: false,
  isLoading: true,
  error: null,
  checkAdminStatus: async () => {}
};

const AdminContext = createContext<AdminContextType>(defaultContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  const checkAdminStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      // Check if user exists in admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // User is admin if they exist in the admin_users table
      setIsAdmin(data && data.length > 0);
    } catch (err: any) {
      console.error('Error checking admin status:', err);
      setError(err.message || 'Failed to verify admin status');
      toast.error('Error checking admin permissions');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [user, checkAdminStatus]);
  
  // Function to safely access predefined strategies (only for admins)
  const fetchPredefinedStrategies = async () => {
    if (!isAdmin) {
      toast.error('You need admin permissions to access this resource');
      return { data: [], error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('predefined_strategies')
        .select('*');
        
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching predefined strategies:', error);
      toast.error('Failed to load predefined strategies');
      return { data: [], error };
    }
  };
  
  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isLoading,
        error,
        checkAdminStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
