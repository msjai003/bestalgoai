
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getUserProfile, signOut as mockSignOut } from '@/lib/mockAuth';
import { toast } from 'sonner';

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
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const userProfile = getUserProfile();
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'mock_auth_user') {
        if (event.newValue === null) {
          setUser(null);
          setProfile(null);
        } else {
          try {
            const newUser = JSON.parse(event.newValue);
            setUser(newUser);
            const newProfile = getUserProfile();
            setProfile(newProfile);
          } catch (e) {
            console.error('Error parsing user from storage event:', e);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signOut = async () => {
    try {
      await mockSignOut();
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
