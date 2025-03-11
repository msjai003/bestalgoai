
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase, createFallbackClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, confirmPassword: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
        } else if (data?.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
          });
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup function
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign up function with retry mechanism
  const signUp = async (email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      
      // Verify that passwords match
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return { error: new Error('Passwords do not match') };
      }
      
      // First, attempt to store the signup data directly
      try {
        const { error: insertError } = await supabase
          .from('signup')
          .insert([{ email, password }]);

        if (insertError) {
          console.error('Error storing signup data:', insertError);
          toast.error('Failed to store signup information');
          return { error: insertError };
        }
      } catch (insertErr) {
        console.error('Exception storing signup data:', insertErr);
        toast.error('Network error while storing signup data');
        return { error: insertErr as Error };
      }
      
      // Try with main client for auth
      let response = await supabase.auth.signUp({
        email,
        password,
      });
      
      // If main client fails, try with fallback
      if (response.error && response.error.message.includes('fetch')) {
        console.log('Main client failed, trying fallback...');
        const fallbackClient = createFallbackClient();
        
        if (fallbackClient) {
          response = await fallbackClient.auth.signUp({
            email,
            password,
          });
        }
      }
      
      const { data, error } = response;

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Error creating account');
        return { error };
      }

      if (data?.user) {
        toast.success('Account created successfully!');
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Network error during signup. Please try again.');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function with fallback mechanism
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Try with main client first
      let response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If main client fails, try with fallback
      if (response.error && response.error.message.includes('fetch')) {
        console.log('Main signin failed, trying fallback...');
        const fallbackClient = createFallbackClient();
        
        if (fallbackClient) {
          response = await fallbackClient.auth.signInWithPassword({
            email,
            password,
          });
        }
      }
      
      const { data, error } = response;

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Invalid credentials');
        return { error };
      }

      if (data?.user) {
        toast.success('Login successful!');
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      toast.error('Network error during login. Please try again.');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message || 'Error signing out');
      } else {
        toast.success('Successfully signed out');
        setUser(null);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
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
