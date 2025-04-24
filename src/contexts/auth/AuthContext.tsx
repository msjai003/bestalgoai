
import React, { createContext, useContext, ReactNode } from 'react';
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
    updatePassword
  } = useAuthActions({
    setUser,
    setIsLoading,
    handleGoogleUser: handleGoogleSignIn
  });

  const contextValue: AuthContextType = {
    user,
    googleUserDetails,
    signIn: async (email, password) => {
      const result = await signIn(email, password);
      if (result.error) {
        toast.error("Login failed. Please check your credentials.");
      }
      return result;
    },
    signInWithGoogle: async () => {
      console.log('Starting Google sign-in process...');
      const result = await signInWithGoogle();
      console.log('Google sign-in result:', result);
      if (result.error) {
        console.error('Google sign-in error:', result.error);
        toast.error("Google login failed. Please try again.");
      }
      return result;
    },
    signUp: async (email, password, confirmPassword, userData) => {
      const result = await signUp(email, password, confirmPassword, userData);
      if (result.error) {
        toast.error("Sign up failed. Please check your information.");
      } else if (result.data?.user) {
        toast.success("Account created successfully!");
      }
      return result;
    },
    signOut: async () => {
      await signOut();
    },
    resetPassword,
    updatePassword: async (newPassword) => {
      const result = await updatePassword(newPassword);
      if (result.error) {
        toast.error("Failed to update password.");
      } else {
        toast.success("Password updated successfully!");
      }
      return result;
    },
    isLoading,
    fetchGoogleUserDetails: fetchUserGoogleDetails
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
