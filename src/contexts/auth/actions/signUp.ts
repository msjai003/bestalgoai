
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendWelcomeSMS } from '../utils';
import { AuthUser } from '../types';

export const useSignUp = ({ setUser, setIsLoading }: { setUser: (user: AuthUser | null) => void, setIsLoading: (loading: boolean) => void }) => {
  const { toast } = useToast();

  const signUp = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    userData: { fullName: string, mobileNumber: string, tradingExperience: string, profilePictureUrl?: string | null }
  ) => {
    try {
      setIsLoading(true);

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return { error: new Error('Passwords do not match') };
      }

      try {
        const { data: existingProfiles, error: profileCheckError } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('email', email)
          .maybeSingle();

        if (profileCheckError) {
          console.error('Error checking for existing profile:', profileCheckError);
        } else if (existingProfiles) {
          toast.error('This email address you entered is already registered');
          return { error: new Error('This email address you entered is already registered') };
        }
      } catch (checkError) {
        console.error('Exception during profile check:', checkError);
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            mobile_number: userData.mobileNumber,
            trading_experience: userData.tradingExperience
          }
        }
      });

      if (error) {
        console.error('Error during signup:', error);

        if (error.message?.includes("already registered") || 
            error.message?.includes("already exists") ||
            error.message?.includes("already in use")) {
          toast.error('This email address you entered is already registered');
          return { error: new Error('This email address you entered is already registered') };
        }

        toast.error(error.message);
        return { error };
      }

      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          app_metadata: data.user.app_metadata || {},
          user_metadata: data.user.user_metadata || {},
          aud: data.user.aud || "authenticated",
          created_at: data.user.created_at || new Date().toISOString()
        };

        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              full_name: userData.fullName,
              email: data.user.email || '',
              mobile_number: userData.mobileNumber,
              trading_experience: userData.tradingExperience,
              profile_picture: userData.profilePictureUrl || null
            });

          if (profileError) {
            console.error('Error creating profile for new user:', profileError);
          } else {
            if (userData.mobileNumber) {
              await sendWelcomeSMS(
                data.user.id,
                userData.fullName,
                userData.mobileNumber
              );
            }
          }
        } catch (profileInsertError) {
          console.error('Exception during profile creation:', profileInsertError);
        }

        setUser(authUser);
        toast.success('Account created successfully!');
        return { error: null, data: { user: authUser } };
      } else {
        toast.info('Please check your email to confirm your account');
        return { error: null, data: { user: null } };
      }

    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || 'Error during signup');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp };
};
