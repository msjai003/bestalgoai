
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthUser } from './types';

interface AuthResult {
  success: boolean;
  data?: any;
  error?: any;
}

export function useAuthActions() {
  const [authError, setAuthError] = useState<string | null>(null);
  
  const clearAuthError = () => {
    setAuthError(null);
  };

  const handleUser = (user: User | null) => {
    // This will be passed from AuthContext
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null, data?: { user: AuthUser | null } }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error signing in:', error);
        setAuthError(error.message);
        return { error: error as Error };
      }
      
      const authUser = data.user ? {
        id: data.user.id,
        email: data.user.email || ''
      } : null;
      
      return { error: null, data: { user: authUser } };
    } catch (error) {
      console.error('Exception during sign in:', error);
      setAuthError('An unexpected error occurred during sign in.');
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    userData: { 
      fullName: string, 
      mobileNumber: string, 
      tradingExperience: string, 
      profilePictureUrl?: string | null 
    }
  ): Promise<{ error: Error | null, data?: { user: AuthUser | null } }> => {
    try {
      // Simple validation
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match.');
        return { error: new Error('Passwords do not match.') };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            mobile_number: userData.mobileNumber,
            trading_experience: userData.tradingExperience,
            profile_picture_url: userData.profilePictureUrl || null
          }
        }
      });
      
      if (error) {
        console.error('Error signing up:', error);
        setAuthError(error.message);
        return { error: error as Error };
      }
      
      const authUser = data.user ? {
        id: data.user.id,
        email: data.user.email || ''
      } : null;
      
      return { error: null, data: { user: authUser } };
    } catch (error) {
      console.error('Exception during sign up:', error);
      setAuthError('An unexpected error occurred during sign up.');
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async (): Promise<{ error: Error | null, data?: { user: AuthUser | null } }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
        setAuthError(error.message);
        return { error: error as Error };
      }
      
      return { error: null, data: { user: null } };
    } catch (error) {
      console.error('Exception during Google sign in:', error);
      setAuthError('An unexpected error occurred during Google sign in.');
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`
      });
      
      if (error) {
        console.error('Error resetting password:', error);
        setAuthError(error.message);
        return { error: error as Error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Exception during password reset:', error);
      setAuthError('An unexpected error occurred during password reset.');
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Error updating password:', error);
        setAuthError(error.message);
        return { error: error as Error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Exception during password update:', error);
      setAuthError('An unexpected error occurred during password update.');
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        setAuthError(error.message);
        return { success: false, error };
      }
      return { success: true };
    } catch (error) {
      console.error('Exception during sign out:', error);
      setAuthError('An unexpected error occurred during sign out.');
      return { success: false, error: error.message };
    }
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    authError,
    clearAuthError,
  };
}
