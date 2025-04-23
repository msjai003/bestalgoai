
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignInWithGoogle = ({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) => {
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    setIsLoading(true);
    console.log('Attempting to sign in with Google...');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) {
        console.error('Error signing in with Google:', error);
        return { error: error as Error };
      }
      console.log('Google sign-in initiated successfully:', data);
      return { error: null };
    } catch (error: any) {
      console.error('Exception during Google sign-in:', error);
      return { error: new Error(error.message || 'An error occurred during Google sign-in') };
    } finally {
      setIsLoading(false);
    }
  };

  return { signInWithGoogle };
};
