
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthUser } from './types';
import { User } from '@supabase/supabase-js';

interface UseAuthActionsProps {
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (loading: boolean) => void;
}

// Helper function to convert Supabase User to AuthUser
const mapToAuthUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
    aud: user.aud || "authenticated",
    created_at: user.created_at || new Date().toISOString()
  };
};

export const useAuthActions = ({ setUser, setIsLoading }: UseAuthActionsProps) => {
  return {
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
        
        const authUser = mapToAuthUser(data.user);
        setUser(authUser);
        return { error: null, data: { user: authUser } };
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
        
        const authUser = mapToAuthUser(data.user);
        
        if (authUser) {
          setUser(authUser);
        }
        
        return { error: null, data: { user: authUser } };
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
    
    resetPassword: async (email: string) => {
      try {
        setIsLoading(true);
        
        if (!email.trim()) {
          return { error: new Error('Please enter your email address') };
        }
        
        // Get the current window location to use as base for the reset URL
        const baseUrl = window.location.origin;
        
        // Send reset email with a redirect to our reset-password page
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${baseUrl}/reset-password`
        });
        
        if (error) {
          console.error('Error sending password reset email:', error);
          return { error };
        }
        
        toast.success('Password reset email sent. Please check your inbox.');
        return { error: null };
      } catch (error: any) {
        console.error('Error sending password reset email:', error);
        return { error };
      } finally {
        setIsLoading(false);
      }
    }
  };
};
