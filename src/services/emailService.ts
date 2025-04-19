
import { supabase } from '@/integrations/supabase/client';

/**
 * Send a test email to check if the email system is working
 * @param email The email address to send the test to
 * @param name The name to use in the test email
 * @returns Result of the email sending operation
 */
export const sendTestEmail = async (email: string, name: string) => {
  try {
    console.log("Sending test email to:", email);
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email-resend', {
      body: JSON.stringify({
        email,
        name,
        welcomeMessage: `This is a test email to verify our email system is working properly. If you received this email, it means our email delivery is functioning correctly.`
      })
    });
    
    if (error) {
      console.error("Error sending test email:", error);
      return { success: false, error };
    }
    
    console.log("Test email response:", data);
    
    // Check if the data contains an error
    if (data && data.error) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending test email:", error);
    return { success: false, error };
  }
};

/**
 * Sends a welcome email to a newly registered user
 */
export const sendWelcomeEmail = async (email: string, name: string, welcomeMessage?: string) => {
  try {
    console.log("Sending welcome email to:", email);
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email-resend', {
      body: JSON.stringify({
        email,
        name,
        welcomeMessage
      })
    });
    
    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }
    
    console.log("Welcome email response:", data);
    
    // Check if the data contains an error
    if (data && data.error) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending welcome email:", error);
    return { success: false, error };
  }
};
