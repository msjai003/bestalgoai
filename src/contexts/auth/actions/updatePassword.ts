
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUpdatePassword = ({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) => {
  const { toast } = useToast();

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Password updated successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error('Error updating password');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePassword };
};
