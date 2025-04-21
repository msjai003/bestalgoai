
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Usage:
 *   const { sendWelcomeEmailSmtp } = useSendWelcomeSmtp();
 *   await sendWelcomeEmailSmtp({ email, fullName, welcomeMessage });
 */

export interface WelcomeSmtpOptions {
  email: string;
  fullName: string;
  welcomeMessage?: string;
}

/**
 * React hook for sending a welcome email using the SMTP edge function
 * Returns a function: sendWelcomeEmailSmtp({ email, fullName, welcomeMessage })
 */
export const useSendWelcomeSmtp = () => {
  const sendWelcomeEmailSmtp = async ({
    email,
    fullName,
    welcomeMessage,
  }: WelcomeSmtpOptions): Promise<boolean> => {
    if (!email || !fullName) {
      toast.error('Email and full name are required to send a welcome message.');
      return false;
    }

    try {
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('send-welcome-smtp', {
        body: JSON.stringify({
          email,
          name: fullName,
          welcomeMessage,
        }),
      });
      
      if (error) {
        const msg =
          typeof error === 'object'
            ? error.message || error.error || "Welcome email failed"
            : String(error);
        toast.error(msg);
        return false;
      }

      // The edge function returns an object with { success: true/false }
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

