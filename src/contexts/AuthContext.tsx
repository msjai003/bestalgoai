
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, confirmPassword: string, userData: { fullName: string, mobileNumber: string, tradingExperience: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
        }
        
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
          });
        }
      } catch (error) {
        console.error('Error during session check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    userData: { fullName: string, mobileNumber: string, tradingExperience: string }
  ) => {
    try {
      setIsLoading(true);
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return { error: new Error('Passwords do not match') };
      }

      // Call Supabase auth signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            mobile_number: userData.mobileNumber,
            trading_experience: userData.tradingExperience
          }
        }
      });

      if (error) {
        console.error('Error during signup:', error);
        toast.error(error.message);
        return { error };
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
        toast.success('Account created successfully!');
      } else {
        // User might need to confirm their email
        toast.info('Please check your email to confirm your account');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error('Error during signup');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Error during sign in:', error);
        toast.error(error.message);
        return { error };
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
        toast.success('Login successful!');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error during sign in:', error);
      toast.error('Error during login');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // First, check if there's a valid session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        // If there's a valid session, sign out normally
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('Error during sign out:', error);
          toast.error(error.message);
        } else {
          toast.success('Successfully signed out');
        }
      } else {
        // If there's no valid session, just clear the user state
        console.log('No active session found, clearing local user state');
      }
      
      // Regardless of the outcome, clear the user state
      setUser(null);
      
    } catch (error: any) {
      console.error('Error during sign out:', error);
      // Even if there's an error, clear the user state to avoid getting stuck
      setUser(null);
      toast.error('Error signing out, but session has been cleared locally');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
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
