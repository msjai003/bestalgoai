
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWelcomeSmtp = () => {
  const sendWelcomeEmail = async (email: string, fullName: string, welcomeMessage?: string) => {
    try {
      console.log('🔍 DEBUG: Starting welcome email process for:', { email, fullName });
      
      // Send welcome email with a personalized message
      let emailResult;
      const maxEmailRetries = 3;
      
      for (let attempt = 1; attempt <= maxEmailRetries; attempt++) {
        try {
          console.log(`📧 DEBUG: Sending welcome email (attempt ${attempt}/${maxEmailRetries})...`);
          
          // Using the new SMTP function for email sending
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-smtp', {
            body: JSON.stringify({
              email,
              name: fullName,
              welcomeMessage: welcomeMessage || `Welcome to BestAlgo.ai, ${fullName}! We're excited to have you on board.`
            })
          });

          // Log the complete response for debugging
          console.log(`📧 DEBUG: Email API response:`, {
            data: emailData,
            error: emailError,
            timestamp: new Date().toISOString()
          });

          if (emailError) {
            console.error(`❌ EMAIL ERROR (attempt ${attempt}):`, emailError);
            
            // If this is the last attempt, show an error toast
            if (attempt === maxEmailRetries) {
              console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts`);
              
              // Show detailed error message based on error type
              if (typeof emailError === 'string') {
                toast.error(`Email not sent: ${emailError}`);
              } else if (typeof emailError === 'object') {
                const errorMsg = emailError.message || emailError.error || "Unknown error";
                toast.error(`Email not sent: ${errorMsg}`);
              } else {
                toast.error("Could not send welcome email. Please try again later.");
              }
            }
            // Wait a bit longer between retries
            await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
          } else if (!emailData || !emailData.success) {
            // Handle case where the function returned but marked as unsuccessful
            console.error(`❌ EMAIL UNSUCCESSFUL (attempt ${attempt}):`, emailData);
            const errorMessage = emailData?.error || "Unknown error sending email";
            
            if (attempt === maxEmailRetries) {
              console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts: ${errorMessage}`);
              toast.error(`Email error: ${errorMessage}`);
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
          } else {
            console.log('✅ EMAIL SUCCESS:', emailData);
            // Show success toast
            toast.success('Welcome email sent! Please check your inbox.');
            emailResult = { success: true, data: emailData };
            break;
          }
        } catch (emailError) {
          console.error(`❌ EMAIL EXCEPTION (attempt ${attempt}):`, emailError);
          if (attempt === maxEmailRetries) {
            console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts`);
            toast.error("Could not send welcome email due to a server error.");
          }
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
        }
      }
      
      return emailResult?.success || false;
    } catch (error) {
      console.error('❌ MAIN ERROR in sendWelcomeEmail:', error);
      return false;
    }
  };

  // Add a utility function to test SMTP connection directly
  const testSmtpConnection = async () => {
    try {
      console.log('🔍 DEBUG: Testing SMTP connection...');
      
      const { data, error } = await supabase.functions.invoke('send-welcome-smtp', {
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'SMTP Test',
          testOnly: true
        })
      });
      
      console.log('📧 DEBUG: SMTP test response:', { data, error });
      
      if (error) {
        console.error('❌ SMTP TEST ERROR:', error);
        toast.error(`SMTP test failed: ${error.message || "Unknown error"}`);
        return false;
      }
      
      if (!data || !data.success) {
        const errorMessage = data?.error || "Unknown configuration issue";
        console.error('❌ SMTP TEST FAILED:', errorMessage);
        toast.error(`SMTP configuration issue: ${errorMessage}`);
        return false;
      }
      
      console.log('✅ SMTP TEST SUCCESS:', data);
      toast.success('SMTP configuration is working correctly!');
      return true;
    } catch (error) {
      console.error('❌ SMTP TEST EXCEPTION:', error);
      toast.error(`SMTP test error: ${error.message || "Unknown error"}`);
      return false;
    }
  };

  return { 
    sendWelcomeEmail,
    testSmtpConnection 
  };
};
