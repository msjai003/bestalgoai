
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSendWelcomeSmtp } from '@/hooks/auth/useSendWelcomeSmtp';

export const useWelcomeSmtp = () => {
  // Use our new auth hook for sending emails
  const { sendWelcomeEmailSmtp } = useSendWelcomeSmtp();

  const sendWelcomeEmail = async (email: string, fullName: string, welcomeMessage?: string) => {
    try {
      console.log('🔍 DEBUG: Starting welcome email process for:', { email, fullName });
      
      return await sendWelcomeEmailSmtp({
        email,
        fullName,
        welcomeMessage
      });
    } catch (error) {
      console.error('❌ MAIN ERROR in sendWelcomeEmail:', error);
      return false;
    }
  };

  // Add a utility function to test SMTP connection directly
  const testSmtpConnection = async () => {
    try {
      console.log('🔍 DEBUG: Testing SMTP connection...');
      
      // Using a promise with timeout for better handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("SMTP test timed out after 15 seconds")), 15000);
      });
      
      // Create the actual SMTP test promise
      const smtpTestPromise = supabase.functions.invoke('send-welcome-smtp', {
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'SMTP Test',
          testOnly: true
        })
      }).catch(e => {
        console.error('❌ SMTP TEST API ERROR:', e);
        return { data: null, error: e };
      });
      
      // Race between timeout and actual operation
      const { data, error } = await Promise.race([
        smtpTestPromise,
        timeoutPromise.then(() => {
          console.error('❌ SMTP TEST TIMEOUT');
          return { data: null, error: new Error("SMTP test timed out after 15 seconds") };
        })
      ]) as any;
      
      console.log('📧 DEBUG: SMTP test response:', { data, error });
      
      if (error) {
        console.error('❌ SMTP TEST ERROR:', error);
        toast.error(`SMTP connection test failed: ${typeof error === 'object' ? (error.message || error.error || "Unknown error") : error}`);
        return false;
      }
      
      if (!data || !data.success) {
        const errorMessage = data?.error || data?.message || "Unknown configuration issue";
        console.error('❌ SMTP TEST FAILED:', errorMessage);
        toast.error(`SMTP connection failed: ${errorMessage}`);
        return false;
      }
      
      console.log('✅ SMTP TEST SUCCESS:', data);
      toast.success('SMTP connection test successful!');
      return true;
    } catch (error) {
      console.error('❌ SMTP TEST EXCEPTION:', error);
      toast.error(`SMTP connection test error: ${error.message || "Unknown error"}`);
      return false;
    }
  };

  return { 
    sendWelcomeEmail,
    testSmtpConnection 
  };
};
