
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
          
          // Using the Resend API via Edge Function with clear request structure
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-email-resend', {
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
            
            // Check if this is a domain verification issue
            const errorMsg = typeof emailError === 'object' && emailError.error ? emailError.error : String(emailError);
            
            if (attempt === maxEmailRetries) {
              console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts`);
              
              // Show detailed error message based on error type
              if (errorMsg.includes("domain") || errorMsg.includes("verified") || errorMsg.includes("You can only send")) {
                toast.error("Email not sent: Your Resend account needs domain verification. Please check admin settings.");
              } else {
                toast.error("Could not send welcome email. Please check your email address.");
              }
            }
            // Wait a bit longer between retries
            await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
          } else {
            console.log('✅ EMAIL SUCCESS:', emailData);
            // Show success toast only to the user who's currently registering
            toast.success('Welcome to BestAlgo! Check your email for more information.');
            emailResult = { success: true, data: emailData };
            break;
          }
        } catch (emailError) {
          console.error(`❌ EMAIL EXCEPTION (attempt ${attempt}):`, emailError);
          if (attempt === maxEmailRetries) {
            console.error(`❌ Failed to send welcome email after ${maxEmailRetries} attempts`);
            // Show toast only to the user who's currently registering
            toast.error("Could not send welcome email due to a server error.");
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
            if (smsData?.success) {
              // Show SMS success toast only to the currently registering user
              toast.success('Welcome SMS sent to your mobile number.');
            }
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

  return { sendWelcomeMessages };
};
