
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GoogleUserDetails } from '@/utils/googleAuthUtils';

type User = {
  id: string;
  email: string;
} | null;

export interface AuthContextType {
  user: User;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ data: any; error: any }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (newPassword: string) => Promise<{ data: any; error: any }>;
  googleUserDetails: GoogleUserDetails | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signInWithGoogle: async () => ({ data: null, error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ data: null, error: null }),
  updatePassword: async () => ({ data: null, error: null }),
  googleUserDetails: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleUserDetails, setGoogleUserDetails] = useState<GoogleUserDetails | null>(null);

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
          
          // If we have a Google provider, fetch the user details
          if (data.session.user.app_metadata?.provider === 'google') {
            fetchGoogleUserDetails(data.session.user.id);
          }
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
      async (event, session) => {
        // Make sure we handle the user data properly with required fields
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          
          // If we have a Google provider, fetch the user details
          if (session.user.app_metadata?.provider === 'google') {
            fetchGoogleUserDetails(session.user.id);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Fetch Google user details from our database
  const fetchGoogleUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('google_user_details')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setGoogleUserDetails(data as GoogleUserDetails);
      }
    } catch (error) {
      console.error('Error fetching Google user details:', error);
    }
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: any) => {
    const options = userData ? { data: userData } : undefined;
    return await supabase.auth.signUp({ email, password, options });
  };
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };
  
  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setGoogleUserDetails(null);
  };
  
  // Reset password (send reset email)
  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password?type=recovery`,
    });
  };
  
  // Update password
  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({
      password: newPassword
    });
  };
  
  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    googleUserDetails
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
