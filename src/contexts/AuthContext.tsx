
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  email: string;
} | null;

export interface AuthContextType {
  user: User;
  isLoading: boolean; // changed from 'loading' to 'isLoading'
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);  // changed from 'loading' to 'isLoading'

  useEffect(() => {
    // Check for session on mount
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        // Make sure we handle the user data properly with required fields
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || ''
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth session error:", error);
        setUser(null);
        setIsLoading(false);
      }
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Make sure we handle the user data properly with required fields
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const value = {
    user,
    isLoading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
