
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEmailVerification = () => {
  const sendOtpToEmail = async (emailAddress: string) => {
    console.log(`Sending OTP to email: ${emailAddress}`);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailAddress, {
        redirectTo: `${window.location.origin}/forgot-password?reset=true`,
      });
      
      if (error) {
        console.error('Error sending password reset email:', error);
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error("Failed to send password reset email:", err);
      throw err;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    console.log(`Verifying OTP for email: ${email}`);
    
    try {
      const result = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (result.error) {
        console.error('OTP verification error:', result.error);
        return { error: result.error };
      }
      
      console.log("OTP verification response:", result.data);
      return { data: result.data };
    } catch (error: any) {
      console.error('Error during OTP verification:', error);
      return { error };
    }
  };

  return {
    sendOtpToEmail,
    verifyOtp,
  };
};
