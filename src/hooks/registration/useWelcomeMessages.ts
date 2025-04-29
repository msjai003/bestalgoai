
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWelcomeMessages = () => {
  const sendWelcomeMessages = async (email: string, fullName: string, mobileNumber?: string) => {
    try {
      console.log('🔍 DEBUG: Starting welcome message process for:', { email, fullName, mobileNumber });
      
      // Send welcome email with a personalized message
      let emailResult;
      const maxEmailRetries = 3;
      
      for (let attempt = 1; attempt <= maxEmailRetries; attempt++) {
        try {
          console.log(`📧 DEBUG: Sending welcome email (attempt ${attempt}/${maxEmailRetries})...`);
          
          // Using the SMTP function for email sending
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-email-smtp', {
            body: JSON.stringify({
              email,
              name: fullName,
              welcomeMessage: `Welcome to BestAlgo.ai, ${fullName}! We're excited to have you on board.`
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
            
            // Check if this is a configuration issue
            const errorMsg = typeof emailError === 'object' && emailError.message 
              ? emailError.message 
              : typeof emailError === 'object' && emailError.error 
                ? emailError.error 
                : String(emailError);
            
            if (attempt === maxEmailRetries) {
              console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts`);
              // Don't show toast error messages about email failures
            }
            // Wait a bit longer between retries
            await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
          } else if (!emailData || !emailData.success) {
            // Handle case where the function returned but marked as unsuccessful
            console.error(`❌ EMAIL UNSUCCESSFUL (attempt ${attempt}):`, emailData);
            const errorMessage = emailData?.error || "Unknown error sending email";
            
            if (attempt === maxEmailRetries) {
              console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts: ${errorMessage}`);
              // Don't show toast error messages about email failures
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
          } else {
            console.log('✅ EMAIL SUCCESS:', emailData);
            // Don't show separate email success toast
            emailResult = { success: true, data: emailData };
            break;
          }
        } catch (emailError) {
          console.error(`❌ EMAIL EXCEPTION (attempt ${attempt}):`, emailError);
          if (attempt === maxEmailRetries) {
            console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts`);
            // Don't show toast error messages about email failures
          }
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
        }
      }
      
      // Send welcome SMS if mobile number is provided
      if (mobileNumber) {
        try {
          console.log('📱 DEBUG: Attempting to send welcome SMS to:', mobileNumber);
          
          const { data: smsData, error: smsError } = await supabase.functions.invoke('send-welcome-sms', {
            body: JSON.stringify({
              fullName,
              mobileNumber
            })
          });

          // Log SMS response for debugging
          console.log(`📱 DEBUG: SMS API response:`, {
            data: smsData, 
            error: smsError,
            timestamp: new Date().toISOString()
          });

          if (smsError) {
            console.error('❌ SMS ERROR:', smsError);
          } else {
            console.log('✅ SMS SUCCESS:', smsData);
            // Don't show separate SMS success toast
          }
        } catch (smsException) {
          console.error('❌ SMS EXCEPTION:', smsException);
        }
      }
      
      return emailResult?.success || false;
    } catch (error) {
      console.error('❌ MAIN ERROR in sendWelcomeMessages:', error);
      return false;
    }
  };

  // Add a utility function to test SMTP connection directly
  const testSmtpConnection = async () => {
    try {
      console.log('🔍 DEBUG: Testing SMTP connection...');
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email-smtp', {
        body: JSON.stringify({
          // Send to a test email - this will only test the connection and not actually send
          email: 'test@example.com',
          name: 'SMTP Test',
          testOnly: true
        })
      });
      
      console.log('📧 DEBUG: SMTP test response:', { data, error });
      
      if (error) {
        console.error('❌ SMTP TEST ERROR:', error);
        return false;
      }
      
      if (!data || !data.success) {
        const errorMessage = data?.error || "Unknown configuration issue";
        console.error('❌ SMTP TEST FAILED:', errorMessage);
        return false;
      }
      
      console.log('✅ SMTP TEST SUCCESS:', data);
      return true;
    } catch (error) {
      console.error('❌ SMTP TEST EXCEPTION:', error);
      return false;
    }
  };

  return { 
    sendWelcomeMessages,
    testSmtpConnection 
  };
};
