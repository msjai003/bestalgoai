
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WelcomeSmtpOptions {
  email: string;
  fullName: string;
  welcomeMessage?: string;
}

export const useSendWelcomeSmtp = () => {
  /**
   * Sends a welcome email using the SMTP edge function.
   * Returns true if sent successfully, otherwise false.
   */
  const sendWelcomeEmailSmtp = async ({
    email,
    fullName,
    welcomeMessage,
  }: WelcomeSmtpOptions) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-smtp', {
        body: JSON.stringify({
          email,
          name: fullName,
          welcomeMessage: welcomeMessage || `Welcome to BestAlgo.ai, ${fullName}! We're excited to have you on board.`
        })
      });

      if (error) {
        toast.error(
          typeof error === 'object'
            ? error.message || error.error || "Welcome email failed"
            : String(error)
        );
        return false;
      }

      if (!data?.success) {
        const msg =
          data?.error ||
          data?.message ||
          "Could not send welcome email, but your account was created successfully.";
        toast.error(msg);
        return false;
      }

      toast.success('Welcome email sent! Please check your inbox.');
      return true;
    } catch (err: any) {
      console.error('sendWelcomeEmailSmtp exception:', err);
      toast.error(err?.message || 'Unexpected error sending welcome email.');
      return false;
    }
  };

  return { sendWelcomeEmailSmtp };
};
