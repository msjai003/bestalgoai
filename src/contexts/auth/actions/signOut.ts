
import { supabase } from '@/integrations/supabase/client';

export const useSignOut = ({ setUser, setIsLoading }: { setUser: (user: any) => void, setIsLoading: (loading: boolean) => void }) => {
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
  return { signOut };
};
