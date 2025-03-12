
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // Mock auth
  useEffect(() => {
    // Check if there's a user in localStorage (mock persistence)
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return { error: new Error('Passwords do not match') };
      }

      // Demo mode behavior - accept any email with "demo" in it
      if (!email.includes('demo')) {
        toast.error('In demo mode, use an email containing "demo"');
        return { error: new Error('In demo mode, use an email containing "demo"') };
      }
      
      // Mock user creation
      const newUser = {
        id: `user-${Date.now()}`,
        email,
      };

      // Store the mock user
      localStorage.setItem('mockUser', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Account created successfully!');
      return { error: null };
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
      
      // Demo mode behavior - accept any email with "demo" in it
      if (!email.includes('demo')) {
        toast.error('In demo mode, use an email containing "demo"');
        return { error: new Error('In demo mode, use an email containing "demo"') };
      }
      
      // Mock user sign in
      const mockUser = {
        id: `user-${Date.now()}`,
        email,
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Login successful!');
      return { error: null };
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
      localStorage.removeItem('mockUser');
      setUser(null);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error during sign out:', error);
      toast.error('Error signing out');
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
