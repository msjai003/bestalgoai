
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
      
      if (sessionData?.session) {
        console.log('User already has an active session:', sessionData.session.user.id);
        const user = sessionData.session.user;
        
        // If this is a Google user and we have a handler, process it
        if (handleGoogleUser && user.app_metadata?.provider === 'google') {
          await handleGoogleUser(user);
        }
        
        // We're already signed in, so we'll return success
        setIsLoading(false);
        return { error: null, session: sessionData.session };
      }

      // Clear existing auth data as before
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');

      // Generate the absolute callback URL
      const callbackUrl = `${window.location.origin}/auth/callback`;
      console.log('Using callback URL:', callbackUrl);
      
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
        console.error('Error signing in with Google:', error);
        toast.error('Google sign-in failed: ' + error.message);
        setIsLoading(false);
        return { error };
      }
      
      console.log('Google sign-in initiated successfully:', data);
      
      // The actual authentication will happen in the callback
      setIsLoading(false);
      return { error: null };
    } catch (error: any) {
      console.error('Exception during Google sign-in:', error);
      toast.error('Google sign-in failed: ' + (error.message || 'Unknown error'));
      setIsLoading(false);
      return { error: new Error(error.message || 'An error occurred during Google sign-in') };
    }
  };

  return { signInWithGoogle };
};
