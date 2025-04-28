
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthUser } from './types';

interface UseAuthActionsProps {
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthActions = ({ setUser, setIsLoading }: UseAuthActionsProps) => {
  return {
    resetPassword: async (email: string) => {
      try {
        setIsLoading(true);
        
        // Use the current window location to determine the redirect URL dynamically
        // This ensures we don't hardcode any domains that might change
        const baseUrl = window.location.origin;
        const redirectUrl = `${baseUrl}/auth/callback`;
        
        console.log('Sending password reset with redirect to:', redirectUrl);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });

        if (error) {
          console.error('Error during password reset:', error);
          toast.error(error.message);
          return { error };
        }
        
        toast.success('Password reset instructions sent to your email');
        return { error: null };
      } catch (error: any) {
        console.error('Error during password reset:', error);
        toast.error('Error sending password reset instructions');
        return { error: error as Error };
      } finally {
        setIsLoading(false);
      }
    },

    signIn: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error('Error during sign in:', error);
          return { error, data: null };
        }
        
        setUser(data.user as AuthUser);
        return { error: null, data };
      } catch (error: any) {
        console.error('Error during sign in:', error);
        return { error: error as Error, data: null };
      } finally {
        setIsLoading(false);
      }
    },
    
    signUp: async (
      email: string, 
      password: string, 
      confirmPassword: string, 
      userData: { fullName: string, mobileNumber: string, tradingExperience: string, profilePictureUrl?: string | null }
    ) => {
      try {
        setIsLoading(true);
        
        if (password !== confirmPassword) {
          return { error: new Error('Passwords do not match'), data: null };
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: userData.fullName,
              mobile_number: userData.mobileNumber,
              trading_experience: userData.tradingExperience,
              profile_picture_url: userData.profilePictureUrl
            }
          }
        });
        
        if (error) {
          console.error('Error during sign up:', error);
          return { error, data: null };
        }
        
        if (data.user) {
          setUser(data.user as AuthUser);
        }
        
        return { error: null, data };
      } catch (error: any) {
        console.error('Error during sign up:', error);
        return { error: error as Error, data: null };
      } finally {
        setIsLoading(false);
      }
    },
    
    signOut: async () => {
      try {
        setIsLoading(true);
        
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('Error during sign out:', error);
          return;
        }
        
        setUser(null);
      } catch (error) {
        console.error('Error during sign out:', error);
      } finally {
        setIsLoading(false);
      }
    },
    
    updatePassword: async (newPassword: string) => {
      try {
        setIsLoading(true);
        
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) {
          console.error('Error updating password:', error);
          return { error };
        }
        
        return { error: null };
      } catch (error: any) {
        console.error('Error updating password:', error);
        return { error: error as Error };
      } finally {
        setIsLoading(false);
      }
    }
  };
};
