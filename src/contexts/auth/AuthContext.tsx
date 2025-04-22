
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContextType } from './types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    setUser,
    googleUserDetails,
    setGoogleUserDetails,
    isLoading,
    setIsLoading,
    fetchUserGoogleDetails,
    handleGoogleSignIn
  } = useAuthState();

  const {
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    authError,
    clearAuthError
  } = useAuthActions();

  const fetchGoogleUserDetails = useCallback(async () => {
    if (!user) return;
    await fetchUserGoogleDetails(user.id);
  }, [user, fetchUserGoogleDetails]);

  const contextValue: AuthContextType = {
    user,
    googleUserDetails,
    signIn: async (email, password) => {
      const result = await signIn(email, password);
      if (result.error) {
        toast({
          title: "Login failed",
          description: "Please check your credentials.",
          variant: "destructive",
        });
      } else if (result.data?.user) {
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
      }
      return result;
    },
    signInWithGoogle: async () => {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({
          title: "Google login failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
      return result;
    },
    signUp: async (email, password, confirmPassword, userData) => {
      const result = await signUp(email, password, confirmPassword, userData);
      if (result.error) {
        toast({
          title: "Sign up failed",
          description: "Please check your information.",
          variant: "destructive",
        });
      } else if (result.data?.user) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to BestAlgo.ai!",
        });
      }
      return result;
    },
    signOut: async () => {
      // Remove the toast notification after logout
      await signOut();
      // No toast message here
    },
    resetPassword,
    updatePassword: async (newPassword) => {
      const result = await updatePassword(newPassword);
      if (result.error) {
        toast({
          title: "Failed to update password",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated successfully!",
          description: "Your password has been changed.",
        });
      }
      return result;
    },
    isLoading,
    fetchGoogleUserDetails
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
