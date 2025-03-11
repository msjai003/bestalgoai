
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return { error: new Error('Passwords do not match') };
      }
      
      // Mock signup - no actual database connection
      console.log('Mock signup for:', email);
      
      // For demo purposes, "create" a mock user
      if (email.includes('demo')) {
        toast.success('Account created successfully! (Demo mode)');
        setUser({
          id: '123456',
          email: email,
        });
        return { error: null };
      } else {
        // Simulate an error for non-demo emails
        toast.error('Database connection removed. Use demo@example.com for testing');
        return { error: new Error('Database connection removed. Use demo@example.com for testing') };
      }
    } catch (error) {
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
      
      // Mock login - no actual database connection
      console.log('Mock login for:', email);
      
      // For demo purposes, "log in" a mock user
      if (email.includes('demo')) {
        toast.success('Login successful! (Demo mode)');
        setUser({
          id: '123456',
          email: email,
        });
        return { error: null };
      } else {
        // Simulate an error for non-demo emails
        toast.error('Database connection removed. Use demo@example.com for testing');
        return { error: new Error('Database connection removed. Use demo@example.com for testing') };
      }
    } catch (error) {
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
      
      // Mock logout - no actual database connection
      console.log('Mock logout');
      
      toast.success('Successfully signed out');
      setUser(null);
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
