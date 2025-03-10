
import { createContext, useState, useContext, ReactNode } from 'react';

type UserProfile = {
  id: string;
  full_name: string | null;
  email: string;
  mobile: string | null;
  trading_experience: string | null;
  is_research_analyst: boolean;
  certification_number: string | null;
};

type AuthContextType = {
  user: null;
  profile: null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    console.log('Sign out functionality has been removed');
  };

  return (
    <AuthContext.Provider value={{ user: null, profile: null, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
