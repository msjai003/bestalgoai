
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
    console.log('Attempting to sign in with Google...');
    try {
      // Check if there's an existing session before initiating Google sign-in
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        console.log('User already has an active session');
        const user = sessionData.session.user;
        
        // If this is a Google user and we have a handler, process it
        if (handleGoogleUser && user.app_metadata?.provider === 'google') {
          await handleGoogleUser(user);
        }
        
        // We're already signed in, so we'll return success
        setIsLoading(false);
        return { error: null, session: sessionData.session };
      }

      // Proceed with Google sign-in
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
        setIsLoading(false);
        return { error: error as Error };
      }
      
      console.log('Google sign-in initiated successfully:', data);
      
      // The actual authentication will happen in the callback
      // We don't return session data here because we're being redirected
      setIsLoading(false);
      return { error: null };
    } catch (error: any) {
      console.error('Exception during Google sign-in:', error);
      setIsLoading(false);
      return { error: new Error(error.message || 'An error occurred during Google sign-in') };
    }
  };

  return { signInWithGoogle };
};
