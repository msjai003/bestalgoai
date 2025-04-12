
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    setUser,
    googleUserDetails,
    setGoogleUserDetails,
    isLoading,
    setIsLoading,
    fetchUserGoogleDetails
  } = useAuthState();

  const handleGoogleUser = useCallback(async (user: any) => {
    // This function is passed to useAuthActions to handle Google user details
    const { handleGoogleSignIn } = await import('./useAuthState');
    await handleGoogleSignIn(user);
  }, []);

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
    handleGoogleUser
  });

  const fetchGoogleUserDetails = useCallback(async () => {
    if (!user) return;
    await fetchUserGoogleDetails(user.id);
  }, [user, fetchUserGoogleDetails]);

  const contextValue: AuthContextType = {
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
