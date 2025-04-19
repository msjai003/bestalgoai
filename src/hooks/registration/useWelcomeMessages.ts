
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
            if (attempt === maxEmailRetries) {
              toast.error('We could not send your welcome email, but your account was created successfully.');
            }
            // Wait a bit longer between retries
            await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
          } else {
            console.log('✅ EMAIL SUCCESS:', emailData);
            toast.success('Welcome email has been sent! Please check your inbox.');
            emailResult = { success: true, data: emailData };
            break;
          }
        } catch (emailError) {
          console.error(`❌ EMAIL EXCEPTION (attempt ${attempt}):`, emailError);
          if (attempt === maxEmailRetries) {
            toast.error('We could not send your welcome email, but your account was created successfully.');
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
              toast.success('Welcome SMS has been sent to your mobile number!');
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
