
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  email?: string;
} | null;

export interface AuthContextType {
  user: User;
  isLoading: boolean;
  googleUserDetails?: any; // Add this to fix related errors
  signIn?: (email: string, password: string) => Promise<any>;
  signUp?: (email: string, password: string) => Promise<any>;
  signOut?: () => Promise<any>;
  signInWithGoogle?: () => Promise<any>;
  resetPassword?: (email: string) => Promise<any>;
  updatePassword?: (password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleUserDetails, setGoogleUserDetails] = useState<any>(null);

  useEffect(() => {
    // Check for session on mount
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Add these stub functions to fix related errors
  const signIn = async () => { /* Implementation needed */ };
  const signUp = async () => { /* Implementation needed */ };
  const signOut = async () => { /* Implementation needed */ };
  const signInWithGoogle = async () => { /* Implementation needed */ };
  const resetPassword = async () => { /* Implementation needed */ };
  const updatePassword = async () => { /* Implementation needed */ };
  
  const value = {
    user,
    isLoading,
    googleUserDetails,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
