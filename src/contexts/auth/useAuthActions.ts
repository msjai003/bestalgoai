import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockSignInWithGoogle } from '@/lib/auth-mock';
import { saveGoogleUserDetails, sendWelcomeSMS } from './utils';
import { AuthUser } from './types';

interface AuthActionsProps {
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  handleGoogleUser?: (user: any) => Promise<void>;
}

export const useAuthActions = ({ setUser, setIsLoading, handleGoogleUser }: AuthActionsProps) => {
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      console.log('Attempting Google sign-in with Supabase');

      // Use your deployed callback path
      const redirectTo = "https://www.bestalgo.ai/auth/callback";

      console.log('Using redirect URL:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Error during Google sign in:', error);
        return { error };
      }

      if (data?.url) {
        console.log('Got redirect URL from Supabase:', data.url);
        window.location.href = data.url;
        return { error: null };
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock Google auth in development');
        const mockResult = await mockSignInWithGoogle();

        if (mockResult.error) {
          toast.error(mockResult.error.message);
          return { error: mockResult.error };
        }

        if (mockResult.data?.user) {
          const authUser: AuthUser = {
            id: mockResult.data.user.id,
            email: mockResult.data.user.email,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString()
          };

          setUser(authUser);
          toast.success('Google login successful! (mock)');

          if (handleGoogleUser) {
            await handleGoogleUser(mockResult.data.user);
          }

          return { error: null, data: { user: authUser } };
        }
      } else {
        console.error('Google authentication failed - no redirect URL provided');
        return { error: new Error('Google authentication failed') };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Exception during Google sign in:', error);
      toast.error('Error during Google sign in: ' + (error.message || 'Unknown error'));
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

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
          } else {
            if (userData.mobileNumber) {
              await sendWelcomeSMS(
                data.user.id,
                userData.fullName,
                userData.mobileNumber
              );
            }
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
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/forgot-password',
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
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
};
