import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthUser } from './types';

interface AuthActionsProps {
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthActions = ({ setUser, setIsLoading }: AuthActionsProps) => {
  const { toast } = useToast();

  const signUp = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    userData: { fullName: string, mobileNumber: string, tradingExperience: string, profilePictureUrl?: string | null }
  ) => {
    try {
      setIsLoading(true);
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return { error: new Error('Passwords do not match') };
      }

      try {
        const { data: existingProfiles, error: profileCheckError } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('email', email)
          .maybeSingle();
          
        if (profileCheckError) {
          console.error('Error checking for existing profile:', profileCheckError);
        } else if (existingProfiles) {
          toast.error('This email address you entered is already registered');
          return { error: new Error('This email address you entered is already registered') };
        }
      } catch (checkError) {
        console.error('Exception during profile check:', checkError);
      }

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
        
        if (error.message?.includes("already registered") || 
            error.message?.includes("already exists") ||
            error.message?.includes("already in use")) {
          toast.error('This email address you entered is already registered');
          return { error: new Error('This email address you entered is already registered') };
        }
        
        toast.error(error.message);
        return { error };
      }
      
      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          app_metadata: data.user.app_metadata || {},
          user_metadata: data.user.user_metadata || {},
          aud: data.user.aud || "authenticated",
          created_at: data.user.created_at || new Date().toISOString()
        };
        
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              full_name: userData.fullName,
              email: data.user.email || '',
              mobile_number: userData.mobileNumber,
              trading_experience: userData.tradingExperience,
              profile_picture: userData.profilePictureUrl || null
            });
            
          if (profileError) {
            console.error('Error creating profile for new user:', profileError);
          }
        } catch (profileInsertError) {
          console.error('Exception during profile creation:', profileInsertError);
        }
        
        setUser(authUser);
        toast.success('Account created successfully!');
        return { error: null, data: { user: authUser } };
      } else {
        toast.info('Please check your email to confirm your account');
        return { error: null, data: { user: null } };
      }
      
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || 'Error during signup');
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
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          app_metadata: data.user.app_metadata || {},
          user_metadata: data.user.user_metadata || {},
          aud: data.user.aud || "authenticated",
          created_at: data.user.created_at || new Date().toISOString()
        };
        setUser(authUser);
        toast.success('Login successful!');
        return { error: null, data: { user: authUser } };
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
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('Error during sign out:', error);
        }
      } else {
        console.log('No active session found, clearing local user state');
      }
      
      setUser(null);
      
    } catch (error: any) {
      console.error('Error during sign out:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      const baseUrl = window.location.origin;
      // Make sure the type parameter is set to recovery
      const redirectUrl = `${baseUrl}/auth/callback?type=recovery&reset=true`;
      
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
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Password updated successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error('Error updating password');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
};
