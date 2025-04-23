
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useResetPassword = ({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) => {
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/forgot-password',
      });

      if (error) {
        console.error('Error during password reset:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Password reset instructions sent to your email');
      return { error: null };
    } catch (error: any) {
      console.error('Error during password reset:', error);
      toast.error('Error sending password reset instructions');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword };
};
