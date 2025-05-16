
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContextType } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    googleUserDetails
  } = useAuthState();

  const {
    signIn,
    signUp,
    signOut,
    resetPassword
  } = useAuthActions({
    setUser,
    setIsLoading,
  });

  const fetchGoogleUserDetails = async () => {
    if (!user) return;
    
    try {
      const { id } = user;
      const { data, error } = await supabase
        .from('google_user_details')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching Google user details:', error);
      }
    } catch (error) {
      console.error('Exception fetching Google user details:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    signIn,
    signUp,
    signOut,
    isLoading,
    googleUserDetails,
    fetchGoogleUserDetails,
    resetPassword,
    updatePassword: async (newPassword: string) => {
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) {
          console.error('Error updating password:', error);
          return { error };
        }
        
        return { error: null };
      } catch (error: any) {
        console.error('Error updating password:', error);
        return { error };
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
