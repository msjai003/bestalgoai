import { useState } from 'react';
import { useAuthContext } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthResult {
  success: boolean;
  data?: any;
  error?: any;
}

export function useAuthActions() {
  const { setUser, setIsLoading } = useAuthContext();
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => {
    setAuthError(null);
  };

  const handleUser = (user: User | null) => {
    setUser(user);
    setIsLoading(false);
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Exception during Google sign in:', error);
      return { success: false, error };
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
      handleUser(null);
      return { success: true };
    } catch (error) {
      console.error('Exception during sign out:', error);
      setAuthError('An unexpected error occurred during sign out.');
      return { success: false, error: error.message };
    }
  };

  return {
    signInWithGoogle,
    signOut,
    authError,
    clearAuthError,
  };
}
