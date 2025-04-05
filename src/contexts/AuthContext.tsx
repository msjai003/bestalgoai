import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { signInWithGoogle as mockSignInWithGoogle } from '@/lib/mockAuth';
import { GoogleUserDetails, fetchGoogleUserDetails as fetchGoogleUserDetailsUtil, saveGoogleUserDetails } from '@/utils/googleAuthUtils';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  googleUserDetails: GoogleUserDetails | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null, data?: { user: User | null } }>;
  signInWithGoogle: () => Promise<{ error: Error | null, data?: { user: User | null } }>;
  signUp: (email: string, password: string, confirmPassword: string, userData: { fullName: string, mobileNumber: string, tradingExperience: string, profilePictureUrl?: string | null }) => Promise<{ error: Error | null, data?: { user: User | null } }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  isLoading: boolean;
  fetchGoogleUserDetails: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let logoutToastShown = false;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [googleUserDetails, setGoogleUserDetails] = useState<GoogleUserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logoutToastShown = false;
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
        }
        
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
          });
          
          fetchUserGoogleDetails();
        }
      } catch (error) {
        console.error('Error during session check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          
          fetchUserGoogleDetails();
          
          if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
            console.log('Google sign-in detected, saving user details');
            handleGoogleSignIn(session.user);
          }
        } else {
          setUser(null);
          setGoogleUserDetails(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async (user: any) => {
    try {
      if (!user || !user.id) return;
      
      console.log('Handling Google sign-in for user:', user.id);
      
      const googleData = {
        email: user.email || '',
        google_id: user.user_metadata?.sub,
        picture_url: user.user_metadata?.picture,
        given_name: user.user_metadata?.given_name,
        family_name: user.user_metadata?.family_name,
        locale: user.user_metadata?.locale,
        verified_email: user.user_metadata?.email_verified
      };
      
      console.log('Saving Google user data:', googleData);
      
      const success = await saveGoogleUserDetails(user.id, googleData);
      
      if (success) {
        console.log('Google user details saved successfully');
        setGoogleUserDetails({
          id: user.id,
          ...googleData
        });
      } else {
        console.error('Failed to save Google user details');
      }
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
    }
  };

  const fetchUserGoogleDetails = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching Google user details for user:', user.id);
      const data = await fetchGoogleUserDetailsUtil(user.id);
      
      if (data) {
        console.log('Google user details fetched:', data);
        setGoogleUserDetails(data);
      } else {
        console.log('No Google user details found for user:', user.id);
        setGoogleUserDetails(null);
      }
    } catch (error) {
      console.error('Exception fetching Google user details:', error);
    }
  };

  const fetchGoogleUserDetails = async () => {
    await fetchUserGoogleDetails();
  };

  const sendWelcomeSMS = async (userId: string, fullName: string, mobileNumber: string) => {
    if (!mobileNumber) return;
    
    try {
      console.log(`Preparing to send welcome SMS to ${mobileNumber}`);
      
      const formattedMobile = mobileNumber.replace(/\D/g, '');
      
      const { data, error } = await supabase.functions.invoke('send-welcome-sms', {
        body: JSON.stringify({
          userId,
          fullName,
          mobileNumber: formattedMobile
        })
      });
      
      if (error) {
        console.error("Error calling send-welcome-sms function:", error);
      } else {
        console.log("SMS function response:", data);
      }
    } catch (error) {
      console.error("Exception sending welcome SMS:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      console.log('Attempting Google sign-in with Supabase');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
      
      if (data.url) {
        console.log('Got redirect URL from Supabase:', data.url);
        window.location.href = data.url;
        return { error: null };
      }
      
      console.warn('No redirect URL received from Supabase Google auth');
      
      console.log('Falling back to mock Google auth');
      const mockResult = await mockSignInWithGoogle();
      
      if (mockResult.error) {
        toast.error(mockResult.error.message);
        return { error: mockResult.error };
      }
      
      if (mockResult.data?.user) {
        const user: User = {
          id: mockResult.data.user.id,
          email: mockResult.data.user.email,
        };
        
        setUser(user);
        toast.success('Google login successful! (mock)');
        
        await handleGoogleSignIn(mockResult.data.user);
        
        return { error: null, data: { user } };
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
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
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
        
        setUser(user);
        toast.success('Account created successfully!');
        return { error: null, data: { user } };
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
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
        };
        setUser(user);
        toast.success('Login successful!');
        return { error: null, data: { user } };
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
          toast.error(error.message);
        } else if (!logoutToastShown) {
          toast.success('Successfully signed out');
          logoutToastShown = true;
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      googleUserDetails,
      signIn, 
      signInWithGoogle,
      signUp, 
      signOut, 
      resetPassword,
      updatePassword,
      isLoading,
      fetchGoogleUserDetails
    }}>
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
