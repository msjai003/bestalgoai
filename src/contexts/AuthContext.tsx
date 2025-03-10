
import { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
  user: null;
  profile: null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ user: null, profile: null, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
