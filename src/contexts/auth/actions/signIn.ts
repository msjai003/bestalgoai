
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useSignIn = ({ setUser, setIsLoading }: { setUser: (user: AuthUser | null) => void, setIsLoading: (loading: boolean) => void }) => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Error during sign in:', error);
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          app_metadata: data.user.app_metadata || {},
          user_metadata: data.user.user_metadata || {},
          aud: data.user.aud || "authenticated",
          created_at: data.user.created_at || new Date().toISOString()
        };
        setUser(authUser);
        toast.success('Login successful!');
        return { error: null, data: { user: authUser } };
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

  return { signIn };
};
