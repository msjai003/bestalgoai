
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContextType } from './types';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    googleUserDetails
  } = useAuthState();

  const {
    signIn,
    signUp,
    signOut
  } = useAuthActions({
    setUser,
    setIsLoading,
  });

  const contextValue: AuthContextType = {
    user,
    signIn,
    signUp,
    signOut,
    isLoading,
    googleUserDetails,
    signInWithGoogle: async () => {
      return { error: new Error('Google sign-in has been removed'), data: null };
    },
    fetchGoogleUserDetails: async () => {
      // Changed to match the expected return type (Promise<void>)
      console.log('Google sign-in functionality has been removed');
      // No return value (void)
    },
    resetPassword: async (email: string) => {
      // Since we're removing password reset functionality, we'll just return an error
      console.log('Password reset functionality has been removed');
      return { error: new Error('Password reset functionality has been removed') };
    },
    updatePassword: async (newPassword: string) => {
      // Since we're removing password update functionality, we'll just return an error
      console.log('Password update functionality has been removed');
      return { error: new Error('Password update functionality has been removed') };
    }
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
