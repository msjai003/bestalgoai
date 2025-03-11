
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast as sonnerToast } from 'sonner';

type Profile = {
  id: string;
  full_name?: string;
  email?: string;
} | null;

type AuthContextType = {
  user: User | null;
  profile: Profile;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  session: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          throw error;
        }
        
        setSession(session);
        setUser(session?.user || null);
        
        // Fetch user profile if we have a user
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session retrieval error:', error);
        sonnerToast('There was a problem loading your session.', {
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from 'profiles' table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // If we can't fetch the profile (maybe it doesn't exist yet), 
      // we'll just set a basic profile with the user ID
      setProfile({ id: userId });
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        sonnerToast(error.message, {
          variant: 'destructive',
        });
        return { error };
      }

      // Toast success
      sonnerToast('Successfully signed in.');

      return { error: null };
    } catch (error) {
      console.error('Exception during sign in:', error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Clear user and profile state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      sonnerToast('You have been successfully signed out.');
    } catch (error) {
      console.error('Sign out error:', error);
      sonnerToast('There was a problem signing you out.', {
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile, 
        isLoading, 
        signIn, 
        signOut,
        session
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
