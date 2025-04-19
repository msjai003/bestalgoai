
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useWelcomeMessages = () => {
  const sendWelcomeMessages = async (email: string, fullName: string, mobileNumber?: string) => {
    try {
      console.log('Sending welcome messages to:', { email, fullName });
      
      // Send welcome email with a personalized message
      let emailResult;
      const maxEmailRetries = 3;
      
      for (let attempt = 1; attempt <= maxEmailRetries; attempt++) {
        try {
          console.log(`Sending welcome email (attempt ${attempt}/${maxEmailRetries})...`);
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-email-resend', {
            body: JSON.stringify({
              email,
              name: fullName,
              welcomeMessage: `Welcome to BestAlgo.ai, ${fullName}! We're excited to have you on board.`
            })
          });

          if (emailError) {
            console.error(`Error sending welcome email attempt ${attempt}:`, emailError);
            if (attempt === maxEmailRetries) {
              toast.error('We could not send your welcome email, but your account was created successfully.');
            }
          } else {
            console.log('Welcome email sent successfully!');
            toast.success('Welcome email has been sent! Please check your inbox.');
            emailResult = { success: true, data: emailData };
            break;
          }
        } catch (emailError) {
          console.error(`Exception during welcome email attempt ${attempt}:`, emailError);
          if (attempt === maxEmailRetries) {
            toast.error('We could not send your welcome email, but your account was created successfully.');
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      
      // Send welcome SMS if mobile number is provided
      if (mobileNumber) {
        try {
          console.log('Attempting to send welcome SMS to:', mobileNumber);
          
          const { data: smsData, error: smsError } = await supabase.functions.invoke('send-welcome-sms', {
            body: JSON.stringify({
              fullName,
              mobileNumber
            })
          });

          if (smsError) {
            console.error('Error sending welcome SMS:', smsError);
          } else {
            console.log('Welcome SMS response:', smsData);
            if (smsData?.success) {
              toast.success('Welcome SMS has been sent to your mobile number!');
            }
          }
        } catch (smsException) {
          console.error('Exception during welcome SMS sending:', smsException);
        }
      }
      
      return emailResult?.success || false;
    } catch (error) {
      console.error('Error in handleSendWelcomeMessages:', error);
      return false;
    }
  };

  return { sendWelcomeMessages };
};
