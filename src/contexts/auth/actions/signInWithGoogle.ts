
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { persistGoogleAuth } from '@/utils/authCallbackUtils';

interface SignInWithGoogleProps { 
  setIsLoading: (loading: boolean) => void;
  handleGoogleUser?: (user: any) => Promise<void>;
}

export const useSignInWithGoogle = ({ setIsLoading, handleGoogleUser }: SignInWithGoogleProps) => {
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Check for any existing session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        const user = sessionData.session.user;
        if (handleGoogleUser && user.app_metadata?.provider === 'google') {
          await handleGoogleUser(user);
        }
        setIsLoading(false);
        return { error: null, session: sessionData.session };
      }

      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');

      // Always include redirect_to=/dashboard in callback URL
      const callbackUrl = `${window.location.origin}/auth/callback?redirect_to=/dashboard`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            flow_type: 'auth-code'
          }
        }
      });

      if (error) {
        toast.error('Google sign-in failed: ' + error.message);
        setIsLoading(false);
        return { error };
      }
      setIsLoading(false);
      return { error: null };
    } catch (error: any) {
      toast.error('Google sign-in failed: ' + (error.message || 'Unknown error'));
      setIsLoading(false);
      return { error: new Error(error.message || 'An error occurred during Google sign-in') };
    }
  };

  return { signInWithGoogle };
};

