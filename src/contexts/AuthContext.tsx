
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase, createFallbackClient } from '@/lib/supabase/client';
import { storeSignupData } from '@/lib/supabase/test-connection';
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

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return { error: new Error('Passwords do not match') };
      }
      
      // First store the signup data in our custom signup table
      const signupResult = await storeSignupData(email, password, confirmPassword);
      
      if (!signupResult.success) {
        console.error('Error storing signup data:', signupResult.message);
        toast.error(signupResult.message || 'Failed to store signup information');
        return { error: new Error(signupResult.message || 'Failed to store signup information') };
      }
      
      // Then use Supabase Auth to create the user
      let response = await supabase.auth.signUp({
        email,
        password,
      });
      
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

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      let response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
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
